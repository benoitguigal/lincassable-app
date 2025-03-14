// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import { Tournee, UpdatePayload } from "../_shared/types/index.ts";
import { webhooks } from "../_shared/discord.ts";

Deno.serve(async (req) => {
  const { type, record, old_record } =
    (await req.json()) as UpdatePayload<Tournee>;

  try {
    const { data: tournees } = await supabaseAdmin
      .from("tournee")
      .select("*,zone_de_collecte(*),transporteur(*)")
      .eq("id", record.id);

    if (tournees?.length) {
      const tournee = tournees[0];

      if (type === "UPDATE") {
        const zoneDeCollecte = tournee.zone_de_collecte;
        const transporteur = tournee.transporteur;

        const dateIsModified = record.date !== old_record.date;
        const statutIsModified = record.statut !== old_record.statut;
        const prixIsModified = record.prix !== old_record.prix;

        if (dateIsModified) {
          // modifie la date des collectes correspondantes
          const { error } = await supabaseAdmin
            .from("collecte")
            .update({ date: record.date })
            .eq("tournee_id", record.id);
          if (error) {
            throw error;
          }
        }

        // Envoie une notification sur Discord pour notifier que la
        // tournée a été modifiée
        if (dateIsModified || statutIsModified || prixIsModified) {
          let msg = `La tournée ${zoneDeCollecte?.nom} du ${tournee.date} par le transporteur ${transporteur?.nom} a été modifiée`;
          if (dateIsModified) {
            msg =
              msg +
              `\nAncienne date : ${old_record.date} - Nouvelle date : ${record.date}`;
          }

          if (statutIsModified) {
            msg =
              msg +
              `\nAncien statut : ${old_record.statut} - Nouveau statut : ${record.statut}`;
          }

          if (prixIsModified) {
            msg =
              msg +
              `\nAncien prix : ${old_record.prix} - Nouveau prix : ${record.prix}`;
          }

          await webhooks.tournee.send({
            content: msg,
          });
        }
      }
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send_discord_message_tournee_update' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
