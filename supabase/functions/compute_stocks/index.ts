/// <reference lib="deno.ns" />
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import { handle } from "../_shared/helpers.ts";

type Payload = { point_de_collecte_id?: number } | null;

Deno.serve(
  handle<Payload>(async (payload) => {
    const { point_de_collecte_id } = payload ?? {};

    let pointDeCollecteQuery = supabaseAdmin
      .from("point_de_collecte")
      .select("*");

    if (point_de_collecte_id) {
      pointDeCollecteQuery = pointDeCollecteQuery.eq(
        "id",
        point_de_collecte_id
      );
    }

    // Récupère l'ensemble des points de collecte
    const { data: pointsDeCollecte, error: pointsDeCollecteError } =
      await pointDeCollecteQuery;

    if (pointsDeCollecteError) {
      throw pointsDeCollecteError;
    }

    for (const pointDeCollecte of pointsDeCollecte) {
      // Récupère le dernier inventaire de stock en date
      const { data: inventaires, error: inventaireError } = await supabaseAdmin
        .from("inventaire")
        .select("*")
        .eq("point_de_collecte_id", pointDeCollecte.id)
        .order("date", { ascending: false });

      if (inventaireError) {
        throw inventaireError;
      }

      if (inventaires.length) {
        const lastInventaire = inventaires[0];

        // Récupère les dernières collectes depuis la date de l'inventaire
        const { data: collectes, error: collecteError } = await supabaseAdmin
          .from("collecte")
          .select("*")
          .eq("point_de_collecte_id", pointDeCollecte.id)
          .gte("date", lastInventaire.date)
          .lte("date", new Date().toISOString());

        if (collecteError) {
          throw collecteError;
        }

        let stockCasier75 = lastInventaire.stock_casiers_75;
        let stockCasier33 = lastInventaire.stock_casiers_33;
        let stockPalox = lastInventaire.stock_paloxs;

        // Met à jour les stocks à partir des mouvements
        for (const collecte of collectes ?? []) {
          stockCasier75 += collecte.livraison_nb_casier_75_vide;
          stockCasier75 -= collecte.collecte_nb_casier_75_plein;
          stockCasier33 += collecte.livraison_nb_casier_33_vide;
          stockCasier33 -= collecte.collecte_nb_casier_33_plein;
          stockPalox += collecte.livraison_nb_palox_vide;
          stockPalox -= collecte.collecte_nb_palox_plein;
        }

        const { error: updatePointDeCollecteError } = await supabaseAdmin
          .from("point_de_collecte")
          .update({
            stock_casiers_75: stockCasier75,
            stock_casiers_33: stockCasier33,
            stock_paloxs: stockPalox,
          })
          .eq("id", pointDeCollecte.id)
          .select("*");

        if (updatePointDeCollecteError) {
          throw updatePointDeCollecteError;
        }
      }
    }
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/compute_stocks' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
