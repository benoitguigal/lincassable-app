// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import { Tournee, UpdatePayload } from "../_shared/types/index.ts";
import { webhooks } from "../_shared/discord.ts";
import { handle } from "../_shared/helpers.ts";
import { SendSmtpEmail } from "npm:@getbrevo/brevo";
import { sendTransacEmail } from "../_shared/brevo.ts";

const UI_HOST = Deno.env.get("UI_HOST");

Deno.serve(
  handle<UpdatePayload<Tournee>>(async (payload) => {
    const { type, record, old_record } = payload;
    const { data: tournees } = await supabaseAdmin
      .from("tournee")
      .select("*,zone_de_collecte(*),transporteur(*,transporteur_users(*))")
      .eq("id", record.id);

    if (tournees?.length) {
      const tournee = tournees[0];

      if (type === "UPDATE") {
        const zoneDeCollecte = tournee.zone_de_collecte;
        const transporteur = tournee.transporteur;

        const dateIsModified = record.date !== old_record.date;
        const statutIsModified = record.statut !== old_record.statut;
        const prixIsModified = record.prix !== old_record.prix;
        const pointDeMassificationIsModified =
          record.point_de_massification_id !==
          old_record.point_de_massification_id;
        const isEnAttenteDeValidation =
          record.statut === "En attente de validation" &&
          old_record.statut !== "En attente de validation";

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

        if (pointDeMassificationIsModified) {
          // modifie le point de massification des collectes correspondantes
          const { error } = await supabaseAdmin
            .from("collecte")
            .update({
              point_de_massification_id: record.point_de_massification_id,
            })
            .eq("tournee_id", record.id);
          if (error) {
            throw error;
          }
        }

        if (isEnAttenteDeValidation) {
          // envoie un mail au transporteur
          for (const userId of tournee.transporteur.transporteur_users.map(
            (u) => u.user_id
          )) {
            if (userId) {
              const {
                data: { user },
              } = await supabaseAdmin.auth.admin.getUserById(userId);
              if (user?.email) {
                const sendSmtpEmail = new SendSmtpEmail();
                sendSmtpEmail.sender = {
                  email: "contact@lincassable.com",
                  name: "L'INCASSABLE",
                };
                sendSmtpEmail.subject =
                  "Tournée L'INCASSABLE en attente de validation transporteur";
                sendSmtpEmail.htmlContent = `<div>Bonjour</div>
                <br/>
                <div>
                La tournée L'INCASSABLE du ${tournee.date} sur la zone ${tournee.zone_de_collecte.nom} est en attente de validation transporteur. 
                Vous pouvez valider cette tournée en suivant ce <a href="${UI_HOST}/tournee/edit/${tournee.id}">ce lien</a>.
                </div>
                <br/>
                <div>
                Bien à vous
                <br/>
                L'équipe L'INCASSABLE
                </div>
                `;
                sendSmtpEmail.to = [{ email: user.email }];
                await sendTransacEmail(sendSmtpEmail);
              }
            }
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

          if (Deno.env.get("DISCORD_NOTIFICATION") === "active") {
            await webhooks.tournee.send({
              content: msg,
            });
          }
        }
      }
    }
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send_discord_message_tournee_update' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
