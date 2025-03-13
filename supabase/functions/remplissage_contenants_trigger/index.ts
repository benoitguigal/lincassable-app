// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import discordClient from "../_shared/discord.ts";
import { Database } from "../_shared/types/supabase.ts";

type RemplissageContenants =
  Database["public"]["Tables"]["remplissage_contenants"]["Row"];

type InsertPayload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: RemplissageContenants;
  old_record: null;
};

Deno.serve(async (req) => {
  const { record } = (await req.json()) as InsertPayload;

  try {
    const { data: pointsDeCollecte, error } = await supabaseAdmin
      .from("point_de_collecte")
      .select("nom")
      .eq("id", record.point_de_collecte_id);

    if (error) {
      throw error;
    }

    if (pointsDeCollecte?.length) {
      let msg = "";

      if (record.demande_collecte) {
        msg += `Demande de collecte effectuée par ${pointsDeCollecte[0].nom}`;
      } else {
        msg += `Taux de remplissage renseigné par ${pointsDeCollecte[0].nom}`;
      }

      if (record.nb_casiers_plein) {
        msg += `\n${record.nb_casiers_plein} casiers pleins`;
      }

      if (record.remplissage_palox) {
        msg += `\nPalox rempli à ${record.remplissage_palox}%`;
      }

      discordClient.edit({ channel: "outil-formulaire" });

      await discordClient.send({
        content: msg,
      });
    }
    return new Response(
      JSON.stringify({
        status: `OK`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send_discord_message_taux_de_remplissage_insert' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
