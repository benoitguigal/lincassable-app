import sgMail from "npm:@sendgrid/mail";

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY"));

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { nom, email, message } = await req.json();

  const text = `
Nom : ${nom}  
E-mail : ${email}

${message}
`;

  const msg = {
    to: "contact@lincassable.com",
    from: "benoit@lincassable.com",
    subject: `[Formulaire contact] Nouveau message de ${email}`,
    text,
  };

  const response = await sgMail.send(msg);

  return new Response(JSON.stringify({ status: response[0].statusCode }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/forward-contact-site-web' \
    --header 'Authorization: Bearer <SUPABASE_KEY>' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
