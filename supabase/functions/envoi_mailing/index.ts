// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import brevo from "npm:@getbrevo/brevo";
import supabaseClient from "../_shared/supabaseClient.ts";
import { handle } from "../_shared/helpers.ts";
import { sendTransacEmail } from "../_shared/brevo.ts";

type Payload = { mailing_id: string };

Deno.serve(
  handle<Payload>(async (payload, headers) => {
    const { mailing_id } = payload;
    const authorization = headers.get("Authorization") ?? "";
    const supabase = supabaseClient({
      authorization,
    });

    // First get the token from the Authorization header
    const token = authorization.replace("Bearer ", "");

    // Now we can get the session or user object
    const { error: authError } = await supabase.auth.getUser(token);

    if (authError) {
      throw authError;
    }

    const { data: mailingData, error: mailingError } = await supabase
      .from("mailing")
      .select("*,mail_template(*)")
      .eq("id", Number(mailing_id));

    if (mailingError) {
      throw mailingError;
    }

    const mailing = mailingData[0];

    const { data: mailsData, error: mailsError } = await supabase
      .from("mail")
      .select("*")
      .eq("mailing_id", mailing.id);

    if (mailsError) {
      throw mailsError;
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: "contact@lincassable.com",
      name: "L'INCASSABLE",
    };
    sendSmtpEmail.subject = mailing?.mail_template?.sujet;
    sendSmtpEmail.htmlContent = mailing?.mail_template?.corps;
    sendSmtpEmail.tags = [
      Deno.env.get("BREVO_WEBHOOK_KEY") ?? "",
      String(mailing.id),
    ];
    sendSmtpEmail.messageVersions = [];

    for (const mail of mailsData ?? []) {
      sendSmtpEmail.messageVersions.push({
        htmlContent: mail.corps ?? "",
        subject: mail.sujet ?? "",
        to: [{ email: mail.to }],
      });
    }

    const brevoResponse = await sendTransacEmail(sendSmtpEmail);

    if (brevoResponse) {
      const { response } = brevoResponse;
      if (response.statusCode === 201) {
        await supabase
          .from("mailing")
          .update({ statut: "Envoyé", date_envoi: new Date().toISOString() })
          .eq("id", Number(mailing_id))
          .select();

        await supabase
          .from("mail")
          .update({ statut: "waiting" })
          .eq("mailing_id", Number(mailing_id))
          .eq("statut", "created")
          .select();
      } else {
        await supabase
          .from("mailing")
          .update({ statut: "Échec", date_envoi: new Date().toISOString() })
          .eq("id", Number(mailing_id))
          .select();
      }
    }
  }, true)
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/envoi_mailing' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
