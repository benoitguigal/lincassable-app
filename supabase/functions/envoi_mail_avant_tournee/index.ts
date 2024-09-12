// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

import { corsHeaders } from "../_shared/cors.ts";

import sgMail from "npm:@sendgrid/mail";

const sendGridApiKey = Deno.env.get("SENDGRID_API_KEY");

sgMail.setApiKey(sendGridApiKey);

Deno.serve(async (req) => {
  // permet de faire des requêtes depuis le navigateur
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { subject, html, to } = await req.json();

  const msg = {
    to,
    from: "collecte@lincassable.com",
    subject: subject,
    html,
  };

  try {
    const response = await sgMail.send(msg);
    const data = { status: response[0].statusCode };

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
