/// <reference lib="deno.ns" />
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Database } from "../_shared/types/supabase.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";

type Prevision = Database["public"]["Tables"]["prevision"]["Insert"];

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

Deno.serve(async () => {
  try {
    const previsions: Prevision[] = [];

    // Récupère l'ensemble des points de collecte
    const { data: pointsDeCollecte, error: pointsDeCollecteError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .select("*")
        .eq("previsible", true)
        .eq("statut", "actif")
        .is("collecte_par_id", null);

    if (pointsDeCollecteError) {
      throw pointsDeCollecteError;
    }

    // Pour chaque point de collecte, récupère les deux dernières collectes
    for (const pointDeCollecte of pointsDeCollecte) {
      const { data: collectes, error: collecteError } = await supabaseAdmin
        .from("collecte")
        .select("*")
        .eq("point_de_collecte_id", pointDeCollecte.id)
        .gt("collecte_nb_bouteilles", 0)
        .order("date", { ascending: false })
        .limit(2);

      if (collecteError) {
        throw collecteError;
      }

      const { data: remplissageData, error: remplissageError } =
        await supabaseAdmin
          .from("remplissage_contenants")
          .select("*")
          .eq("point_de_collecte_id", pointDeCollecte.id)
          .order("date", { ascending: false })
          .limit(1);

      if (remplissageError) {
        throw remplissageError;
      }

      const capacite =
        pointDeCollecte.contenant_collecte_type === "palox"
          ? 550
          : 12 * pointDeCollecte.stock_casiers_75;

      const prevision: Prevision = {
        point_de_collecte_id: pointDeCollecte.id,
        capacite,
      };

      const derniereCollecte = collectes[0];
      const avantDerniereCollecte = collectes[1];

      prevision.date_derniere_collecte = derniereCollecte?.date;
      prevision.nb_bouteilles_derniere_collecte =
        derniereCollecte?.collecte_nb_bouteilles;
      prevision.date_avant_derniere_collecte = avantDerniereCollecte?.date;
      prevision.nb_bouteilles_avant_derniere_collecte =
        avantDerniereCollecte?.collecte_nb_bouteilles;

      const dernierFormulaireRemplissage = remplissageData[0];

      if (dernierFormulaireRemplissage) {
        prevision.date_dernier_formulaire_remplissage =
          dernierFormulaireRemplissage.date;
        if (dernierFormulaireRemplissage.nb_casiers_plein) {
          prevision.nb_bouteilles_dernier_formulaire_remplissage =
            dernierFormulaireRemplissage.nb_casiers_plein * 12;
        }
        if (dernierFormulaireRemplissage.remplissage_palox) {
          prevision.nb_bouteilles_dernier_formulaire_remplissage = Math.ceil(
            (dernierFormulaireRemplissage.remplissage_palox * 550) / 100
          );
        }
      }

      if (
        derniereCollecte?.date &&
        dernierFormulaireRemplissage?.date &&
        prevision.nb_bouteilles_dernier_formulaire_remplissage &&
        new Date(dernierFormulaireRemplissage.date).getTime() >
          new Date(derniereCollecte.date).getTime()
      ) {
        // Estime la date de la prochaine collecte à partir des infos de
        // la dernière collecte et du dernier formulaire de taux de remplissage
        const intervalleTemps =
          new Date(dernierFormulaireRemplissage.date).getTime() -
          new Date(derniereCollecte.date).getTime();

        const tempsEstimeRemplissage =
          (capacite / prevision.nb_bouteilles_dernier_formulaire_remplissage) *
          intervalleTemps;

        const dateEstimationProchaineCollecte = new Date(
          new Date(derniereCollecte.date).getTime() + tempsEstimeRemplissage
        );

        prevision.date_estimation_prochaine_collecte = formatDate(
          dateEstimationProchaineCollecte
        );
      } else if (derniereCollecte?.date && avantDerniereCollecte?.date) {
        // Estime la date de la prochaine collecte à partir des infos de la dernière
        // collecte et de l'avant dernière collecte

        const intervalleCollecte =
          new Date(derniereCollecte.date).getTime() -
          new Date(avantDerniereCollecte.date).getTime();

        const tempsEstimeRemplissage =
          (capacite / derniereCollecte.collecte_nb_bouteilles) *
          intervalleCollecte;

        const dateEstimationProchaineCollecte = new Date(
          new Date(derniereCollecte.date).getTime() + tempsEstimeRemplissage
        );

        prevision.date_estimation_prochaine_collecte = formatDate(
          dateEstimationProchaineCollecte
        );
      }

      // Calcule le nombre de jours avant la prochaine collecte
      if (prevision.date_estimation_prochaine_collecte) {
        prevision.nb_jours_avant_estimation_prochaine_collecte = Math.ceil(
          (new Date(prevision.date_estimation_prochaine_collecte).getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      previsions.push(prevision);
    }

    if (previsions.length) {
      const { error: deletePrevisionsError } = await supabaseAdmin
        .from("prevision")
        .delete()
        .gt("id", 0); // all rows

      if (deletePrevisionsError) {
        throw deletePrevisionsError;
      }

      const { error: insertPrevisionsError } = await supabaseAdmin
        .from("prevision")
        .insert(previsions)
        .select();

      if (insertPrevisionsError) {
        throw insertPrevisionsError;
      }
    }

    return new Response(JSON.stringify(previsions), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/compute_previsions' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
