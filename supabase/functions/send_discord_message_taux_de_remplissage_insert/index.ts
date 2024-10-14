// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { WebhookClient } from "npm:discord.js";

const webhookId = Deno.env.get("DISCORD_WEBHOOK_ID");
const webhookToken = Deno.env.get("DISCORD_WEBHOOK_TOKEN");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  const { record } = await req.json();

  const supabaseClient = createClient(
    supabaseUrl ?? "",
    supabaseServiceRoleKey
  );

  const { data: pointsDeCollecte } = await supabaseClient
    .from("point_de_collecte")
    .select("nom")
    .eq("id", record.point_de_collecte_id);

  if (pointsDeCollecte?.length) {
    const webhookClient = new WebhookClient({
      id: webhookId,
      token: webhookToken,
    });

    await webhookClient.send({
      content: `Taux de remplissage renseigné par ${pointsDeCollecte[0].nom}`,
    });

    return new Response(
      JSON.stringify({
        status: `OK`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ status: "not_found" }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send_discord_message_taux_de_remplissage_insert' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
