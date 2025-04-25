// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import { handle } from "../_shared/helpers.ts";

/**
 * Calcule le taux de remplissage sur les points de massification
 * Cette fonction sera executée via un job CRON tous les jours
 */
Deno.serve(
  handle(async () => {
    const {
      data: pointsDeMassificationData,
      error: pointsDeMassificationError,
    } = await supabaseAdmin
      .from("point_de_collecte")
      .select("*")
      .eq("type", "Massification")
      .neq("statut", "archive");

    if (pointsDeMassificationError) {
      throw pointsDeMassificationError;
    }

    for (const pointDeMassification of pointsDeMassificationData) {
      // Recherche la date de la dernière ramasse sur le point de massification
      const {
        data: lastCollecteOnPointMassificationData,
        error: lastCollecteOnPointMassificationError,
      } = await supabaseAdmin
        .from("collecte")
        .select("*")
        .eq("point_de_collecte_id", pointDeMassification.id)
        .order("date", { ascending: false })
        .limit(1);

      if (lastCollecteOnPointMassificationError) {
        throw lastCollecteOnPointMassificationError;
      }

      const lastCollecteOnPointMassification =
        lastCollecteOnPointMassificationData.length
          ? lastCollecteOnPointMassificationData[0]
          : null;

      if (
        lastCollecteOnPointMassification &&
        lastCollecteOnPointMassification.date
      ) {
        // Récupère les dernières livraisons de casiers pleins sur ce point de massification
        // depuis la date de la dernière ramasse
        const { data: lastDeliveriesData, error: lastDeliveriesError } =
          await supabaseAdmin
            .from("collecte")
            .select("*")
            .eq("point_de_massification_id", pointDeMassification.id)
            .gt("date", lastCollecteOnPointMassification.date);

        if (lastDeliveriesError) {
          throw lastDeliveriesError;
        }

        // Nombre de casiers pleins à la date d'aujourd'hui
        const casiers75Pleins = lastDeliveriesData.reduce((acc, delivery) => {
          if (
            // exclut les collectes dans le futur
            delivery.date &&
            new Date(delivery.date).getTime() <= new Date().getTime()
          ) {
            return acc + delivery.collecte_nb_casier_75_plein;
          }
          return acc;
        }, 0);

        // Nombre de casiers pleins prévisionnels en incluant les
        // collectes programmés
        const casiers75PleinsPrevision = lastDeliveriesData.reduce(
          (acc, delivery) => {
            return acc + delivery.collecte_nb_casier_75_plein;
          },
          0
        );

        if (casiers75Pleins !== pointDeMassification.stock_casiers_75_plein) {
          await supabaseAdmin
            .from("point_de_collecte")
            .update({ stock_casiers_75_plein: casiers75Pleins })
            .eq("id", pointDeMassification.id);

          if (casiers75Pleins > 0) {
            // Renseigne le taux de remplissage sur le point de massification
            await supabaseAdmin
              .from("remplissage_contenants")
              .insert({
                point_de_collecte_id: pointDeMassification.id,
                nb_casiers_plein: casiers75Pleins,
              })
              .select("*");
          }
        }

        if (
          casiers75PleinsPrevision !==
          pointDeMassification.stock_casiers_75_plein_prevision
        ) {
          await supabaseAdmin
            .from("point_de_collecte")
            .update({
              stock_casiers_75_plein_prevision: casiers75PleinsPrevision,
            })
            .eq("id", pointDeMassification.id);
        }
      }
    }
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/compute_taux_remplissage' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
