// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

import { corsHeaders } from "../_shared/cors.ts";

import brevo from "npm:@getbrevo/brevo";

const client = new brevo.TransactionalEmailsApi();
const apiKey = client.authentications["apiKey"];
apiKey.apiKey = Deno.env.get("BREVO_API_KEY");

Deno.serve(async (req) => {
  // permet de faire des requêtes depuis le navigateur
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { subject, html, to } = await req.json();

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = {
    name: "L'INCASSABLE",
    email: "contact@lincassable.com",
  };
  sendSmtpEmail.to = [{ email: to }];

  try {
    const { response } = await client.sendTransacEmail(sendSmtpEmail);
    const data = { status: response.statusCode };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
