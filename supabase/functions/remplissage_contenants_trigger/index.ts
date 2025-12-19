// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import {
  InsertPayload,
  RemplissageContenants,
} from "../_shared/types/index.ts";
import { webhooks } from "../_shared/discord.ts";
import { handle } from "../_shared/helpers.ts";

Deno.serve(
  handle<InsertPayload<RemplissageContenants>>(async (payload) => {
    const { record } = payload;

    const { data: pointsDeCollecteData, error } = await supabaseAdmin
      .from("point_de_collecte")
      .select("*")
      .eq("id", record.point_de_collecte_id);

    if (error) {
      throw error;
    }

    if (pointsDeCollecteData?.length) {
      let msg = "";

      const pointDeCollecte = pointsDeCollecteData[0];

      if (record.demande_collecte) {
        msg += `Demande de collecte effectuée par ${pointDeCollecte.nom}`;
      } else {
        msg += `Taux de remplissage renseigné par ${pointDeCollecte.nom}`;
      }

      if (record.nb_casiers_plein) {
        msg +=
          `\n${record.nb_casiers_plein} casiers 75cl pleins sur un total de` +
          ` ${pointDeCollecte.stock_casiers_75} (dont ${pointDeCollecte.stock_casiers_75_tampon} de stock tampon)`;
      }

      if (record.nb_casiers_33_plein) {
        msg +=
          `\n${record.nb_casiers_33_plein} casiers 33cl pleins sur un total de` +
          ` ${pointDeCollecte.stock_casiers_33} (dont ${pointDeCollecte.stock_casiers_33_tampon} de stock tampon)`;
      }

      if (record.remplissage_palox) {
        msg += `\nPalox n°1 rempli à ${record.remplissage_palox}%`;
      }

      if (record.remplissage_palox_2) {
        msg += `\nPalox n°2 rempli à ${record.remplissage_palox_2}%`;
      }
      if (Deno.env.get("DISCORD_NOTIFICATION") === "active") {
        await webhooks.remplissage.send({
          content: msg,
        });
      }
    }
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send_discord_message_taux_de_remplissage_insert' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
