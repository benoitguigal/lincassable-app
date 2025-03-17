// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import { handle } from "../_shared/helpers.ts";

type BrevoEvent = {
  event: string;
  email: string;
  tags: string[];
};

Deno.serve(
  handle<BrevoEvent>(async (payload) => {
    const { event, email, tags }: BrevoEvent = payload;
    if (tags.length !== 2 || tags[0] !== Deno.env.get("BREVO_WEBHOOK_KEY")) {
      return { status: "Forbidden" };
    }
    const mailing_id = Number(tags[1]);
    const { data, error } = await supabaseAdmin
      .from("mail")
      .update({ statut: event })
      .eq("mailing_id", mailing_id)
      .eq("to", email)
      .select();
    if (error) {
      throw error;
    }
    return data;
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/brevo_webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
