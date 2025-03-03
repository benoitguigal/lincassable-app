// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import brevo from "npm:@getbrevo/brevo";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { Database } from "../_shared/types/supabase.ts";

Deno.serve(async (req) => {
  // permet de faire des requêtes depuis le navigateur
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { mailing_id } = await req.json();

    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // First get the token from the Authorization header
    const token = req.headers.get("Authorization").replace("Bearer ", "");

    // Now we can get the session or user object
    const { error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      throw authError;
    }

    const { data: mailingData, error: mailingError } = await supabaseClient
      .from("mailing")
      .select("*,mail_template(*)")
      .eq("id", mailing_id);

    if (mailingError) {
      throw mailingError;
    }

    const mailing = mailingData[0];

    const { data: mailsData, error: mailsError } = await supabaseClient
      .from("mail")
      .select("*")
      .eq("mailing_id", mailing.id);

    if (mailsError) {
      throw mailsError;
    }

    const brevoClient = new brevo.TransactionalEmailsApi();
    const apiKey = brevoClient.authentications["apiKey"];
    apiKey.apiKey = Deno.env.get("BREVO_API_KEY");

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: "contact@lincassable.com",
      name: "L'INCASSABLE",
    };
    sendSmtpEmail.subject = mailing?.mail_template?.sujet;
    sendSmtpEmail.htmlContent = mailing?.mail_template?.corps;
    sendSmtpEmail.tags = [
      Deno.env.get("BREVO_WEBHOOK_KEY"),
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

    const { response } = await brevoClient.sendTransacEmail(sendSmtpEmail);

    if (response.statusCode === 201) {
      await supabaseClient
        .from("mailing")
        .update({ statut: "Envoyé", date_envoi: new Date().toISOString() })
        .eq("id", mailing_id)
        .select();

      await supabaseClient
        .from("mail")
        .update({ statut: "waiting" })
        .eq("mailing_id", mailing_id)
        .eq("statut", "created")
        .select();
    } else {
      await supabaseClient
        .from("mailing")
        .update({ statut: "Échec", date_envoi: new Date().toISOString() })
        .eq("id", mailing_id)
        .select();
    }

    return new Response(JSON.stringify({ status: response.statusMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: response.statusCode,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/envoi_mailing' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
