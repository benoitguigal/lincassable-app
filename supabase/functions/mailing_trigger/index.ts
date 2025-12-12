// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import nunjucks from "npm:nunjucks";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import {
  Collecte,
  InsertPayload,
  Mailing,
  MailInsert,
  PointDeCollecte,
  Tournee,
  UpdatePayload,
} from "../_shared/types/index.ts";
import { handle } from "../_shared/helpers.ts";

type GetVariablesOpts = {
  mailing: Mailing;
  pointDeCollecte: PointDeCollecte;
};

function formatDate(dateStr: string | null) {
  if (dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
  return "";
}

// Récupère les variables à injecter dans le template
async function getVariables({ mailing, pointDeCollecte }: GetVariablesOpts) {
  const { tournee_id, start_consigne, end_consigne, ...variables } =
    (mailing.variables ?? {}) as {
      [key: string]: string | number;
    };

  let tournee: Tournee | null = null;
  let collecte: Collecte | null = null;

  if (tournee_id) {
    const { data: tourneeData, error: tourneeError } = await supabaseAdmin
      .from("tournee")
      .select("*")
      .eq("id", Number(tournee_id));

    if (tourneeError) throw tourneeError;

    tournee = tourneeData[0];

    const { data: collecteData, error: collecteError } = await supabaseAdmin
      .from("collecte")
      .select("*")
      .eq("tournee_id", Number(tournee_id))
      .eq("point_de_collecte_id", pointDeCollecte.id);

    if (collecteError) {
      throw collecteError;
    }

    collecte = collecteData[0];
  }

  // Transforme les dates au format localisé "Lundi 13 janvier"
  const formattedVariables = variables
    ? Object.fromEntries(
        Object.entries(variables).map(([key, value]) => {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (typeof value === "string" && dateRegex.test(value)) {
            return [key, formatDate(value)];
          }
          return [key, value];
        })
      )
    : {};

  const lienFormulaireRemplissage =
    `${Deno.env.get("UI_HOST")}/point-de-collecte/taux-de-remplissage/${
      pointDeCollecte.id
    }?` + `nom=${encodeURIComponent(pointDeCollecte.nom)}`;

  const lienFormulaireConsigne = `${Deno.env.get(
    "UI_HOST"
  )}/point-de-collecte/consigne/${pointDeCollecte.id}?nom=${encodeURIComponent(
    pointDeCollecte.nom
  )}&start=${start_consigne ?? ""}&end=${end_consigne ?? ""}`;

  return {
    ...formattedVariables,
    pointDeCollecte: {
      ...pointDeCollecte,
      lienFormulaireRemplissage,
      lienFormulaireConsigne,
    },
    tournee: tournee ? { ...tournee, date: formatDate(tournee.date) } : {},
    collecte: collecte ? { ...collecte, date: formatDate(collecte.date) } : {},
  };
}

type Payload = InsertPayload<Mailing> | UpdatePayload<Mailing>;

Deno.serve(
  handle<Payload>(async (payload) => {
    const { type, record } = payload;
    if (record.statut == "En attente") {
      const { data: mailTemplateData, error: mailTemplateError } =
        await supabaseAdmin
          .from("mail_template")
          .select("*")
          .eq("id", record.mail_template_id);

      if (mailTemplateError) {
        throw mailTemplateError;
      }

      const mailTemplate = mailTemplateData[0];

      const { data: pointsDeCollecteData, error: pointDeCollecteError } =
        await supabaseAdmin
          .from("point_de_collecte")
          .select("*")
          .in("id", record.point_de_collecte_ids ?? []);

      if (pointDeCollecteError) {
        throw pointDeCollecteError;
      }

      if (type === "UPDATE") {
        // Supprime les mails correspondant à ce mailing avant de les ré-générer
        await supabaseAdmin.from("mail").delete().eq("mailing_id", record.id);
      }

      const mails: MailInsert[] = [];

      for (const pointDeCollecte of pointsDeCollecteData) {
        const emails =
          mailTemplate.destinataire_type === "emails"
            ? pointDeCollecte.emails
            : pointDeCollecte.emails_consigne;

        const validEmails = emails.filter((email: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );

        for (const email of validEmails) {
          const variables = await getVariables({
            mailing: record,
            pointDeCollecte,
          });
          const corps = nunjucks.renderString(mailTemplate.corps, variables);
          const mail: MailInsert = {
            statut: "created",
            mailing_id: record.id,
            point_de_collecte_id: pointDeCollecte.id,
            to: email,
            sujet: mailTemplate.sujet,
            corps,
          };
          mails.push(mail);
        }
      }

      const { data, error } = await supabaseAdmin.from("mail").insert(mails);

      if (error) {
        throw error;
      }

      return data;
    }
  })
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/mailing_trigger' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
