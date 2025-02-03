// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import axios from "npm:axios";
import nunjucks from "npm:nunjucks";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { Database } from "../_shared/types/supabase.ts";

type MessageVersion = {
  to: { email: string; name: string }[];
  htmlContent: string;
  subject: string;
};

function renderVariables(
  pointDeCollecte: Database["public"]["Tables"]["point_de_collecte"]["Row"]
) {
  return {
    lienFormulaireRemplissage:
      `${Deno.env.get("UI_HOST")}/point-de-collecte/taux-de-remplissage/${
        pointDeCollecte.id
      }?` +
      `nom=${encodeURIComponent(pointDeCollecte.nom)}&contenant_collecte=${
        pointDeCollecte.contenant_collecte_type
      }`,
  };
}

Deno.serve(async (req) => {
  // permet de faire des requêtes depuis le navigateur
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { mailing_id } = await req.json();

    const supabaseClient = createClient<Database>(
      //createClient(
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

    const { data: pointDeCollecteData, error: pointDeCollecteError } =
      await supabaseClient
        .from("point_de_collecte")
        .select("*")
        .in("id", mailing?.point_de_collecte_ids ?? []);

    if (pointDeCollecteError) {
      throw pointDeCollecteError;
    }

    const data = {
      sender: { email: "contact@lincassable.com", name: "L'INCASSABLE" },
      subject: mailing?.mail_template?.sujet,
      htmlContent: mailing?.mail_template?.corps,
      messageVersions: [] as MessageVersion[],
    };

    const mailingVariables = mailing.variables as {
      [key: string]: string;
    };

    for (const pointDeCollecte of pointDeCollecteData ?? []) {
      const htmlContent = nunjucks.renderString(mailing?.mail_template?.corps, {
        ...mailingVariables,
        ...renderVariables(pointDeCollecte),
      });

      data.messageVersions.push({
        htmlContent,
        subject: mailing.mail_template?.sujet ?? "",
        to: pointDeCollecte.emails.map((email) => ({
          email,
          name: email,
        })),
      });
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": Deno.env.get("BREVO_API_KEY") ?? "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 201) {
      await supabaseClient
        .from("mailing")
        .update({ statut: "Envoyé", date_envoi: new Date().toISOString() })
        .eq("id", mailing_id)
        .select();
    } else {
      await supabaseClient
        .from("mailing")
        .update({ statut: "Échec", date_envoi: new Date().toISOString() })
        .eq("id", mailing_id)
        .select();
    }

    return new Response(JSON.stringify({ status: response.statusText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: response.status,
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
