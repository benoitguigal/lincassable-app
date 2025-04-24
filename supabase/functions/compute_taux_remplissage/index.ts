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
    // Récupère les collectes du jour
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const { data: collecteData, error: collecteError } = await supabaseAdmin
      .from("collecte")
      .select(
        "*,point_de_massification:point_de_collecte!collecte_point_de_massification_id_fkey(type)"
      )
      .eq("date", today);

    if (collecteError) {
      throw collecteError;
    }

    if (collecteData.length) {
      // Liste les points de massification concernés par une collecte à la date d'aujourd'hui
      const pointsDeMassificationIds = [
        ...new Set(
          collecteData.map((c) => {
            if (c.point_de_massification?.type === "Massification") {
              // exclut les centres de tri
              return c.point_de_massification_id;
            }
            return null;
          })
        ),
      ].filter((id) => id !== null);

      for (const pointDeMassificationId of pointsDeMassificationIds) {
        // Recherche la date de la dernière ramasse
        const {
          data: lastCollecteOnPointMassificationData,
          error: lastCollecteOnPointMassificationError,
        } = await supabaseAdmin
          .from("collecte")
          .select("*")
          .eq("point_de_collecte_id", pointDeMassificationId)
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
          // depuis la date de la dernière ramasse et jusqu'à aujourd'hui
          const { data: lastDeliveriesData, error: lastDeliveriesError } =
            await supabaseAdmin
              .from("collecte")
              .select("*")
              .gt("date", lastCollecteOnPointMassification.date)
              .lte("date", today);

          if (lastDeliveriesError) {
            throw lastDeliveriesError;
          }

          const casiers75Pleins = lastDeliveriesData.reduce((acc, curr) => {
            return acc + curr.collecte_nb_casier_75_plein;
          }, 0);

          // Renseigne le taux de remplissage sur le point de massification
          await supabaseAdmin
            .from("remplissage_contenants")
            .insert({
              point_de_collecte_id: pointDeMassificationId,
              nb_casiers_plein: casiers75Pleins,
            })
            .select("*");
        }
      }
    }

    //
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
