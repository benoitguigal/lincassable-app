// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  InsertPayload,
  UpdatePayload,
  Inventaire,
} from "../_shared/types/index.ts";
import { handle } from "../_shared/helpers.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";

type Payload = InsertPayload<Inventaire> | UpdatePayload<Inventaire>;

Deno.serve(
  handle<Payload>(async (payload) => {
    const { type, record } = payload;
    if (type === "INSERT" || type === "UPDATE") {
      // Met à jour les stocks du point de collecte à partir des données
      // de l'inventaire
      await supabaseAdmin.functions.invoke("compute_stocks", {
        body: { point_de_collecte_id: record.point_de_collecte_id },
      });
    }
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/inventaire_trigger' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
