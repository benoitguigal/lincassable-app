// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import discordClient from "../_shared/discord.ts";
import { CykeWebhookPayload } from "../_shared/cyke.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";

function getEventLabel(eventType: CykeWebhookPayload["event_type"]) {
  switch (eventType) {
    case "delivery_saved":
      return "Crée";
    case "delivery_scheduled":
      return "Programmé";
    case "delivery_picked_up":
      return "Picked Up";
    case "delivery_cancelled":
      return "Annulé";
    case "delivery_failed":
      return "Échec";
    default:
      return "Statut inconnu";
  }
}

Deno.serve(async (req) => {
  const { event_type, payload } = (await req.json()) as CykeWebhookPayload;
  const cykeToken = req.headers.get("X-Cyke-Token");

  if (cykeToken !== Deno.env.get("CYKE_WEBHOOK_TOKEN")) {
    return new Response(JSON.stringify({ status: "forbidden" }), {
      headers: { "Content-Type": "application/json" },
      status: 401,
    });
  }

  try {
    const { data: collecteData, error: collecteError } = await supabaseAdmin
      .from("collecte")
      .select("*,tournee(*)")
      .eq("cyke_id", payload.delivery.id);

    if (collecteError) {
      throw collecteError;
    }

    const collecte = collecteData[0];

    let discordMsg = `Une collecte Agilenville vient de changer de statut : ${getEventLabel(
      event_type
    )}`;

    discordMsg += `\nURL de la livraison sur Cyke : https://www.cyke.io/deliveries/${payload.delivery.id}`;

    discordMsg += `\nURL de suivi : ${payload.delivery.dropoff.tracking_url}`;

    if (collecte && collecte.tournee_id) {
      discordMsg += `\nTournée L'INCASSABLE correspondante : https://app.lincassable.com/tournee/show/${collecte.tournee_id}`;
    }

    await discordClient.send({
      content: discordMsg,
    });

    if (event_type === "delivery_cancelled" && collecte) {
      // Désactive le lien entre la collecte L'INCASSABLE et la livraison Cyke
      const { error: updateCollecteError } = await supabaseAdmin
        .from("collecte")
        .update({ cyke_id: null })
        .eq("id", collecte.id);

      if (updateCollecteError) {
        throw updateCollecteError;
      }

      // Puis supprime la collecte
      const { error: deleteCollecteError } = await supabaseAdmin
        .from("collecte")
        .delete()
        .eq("id", collecte.id);

      if (deleteCollecteError) {
        throw deleteCollecteError;
      }
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cyke_webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
