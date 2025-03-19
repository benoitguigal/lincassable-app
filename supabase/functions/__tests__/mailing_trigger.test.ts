import { expect } from "jsr:@std/expect";
import { describe, beforeAll, afterEach, it } from "jsr:@std/testing/bdd";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/types/supabase.ts";
import { waitFor } from "./helpers.ts";

const supabaseAdmin = createClient<Database>(
  Deno.env.get("API_URL") ?? "",
  Deno.env.get("SERVICE_ROLE_KEY") ?? ""
);

describe("envoi_mailing", () => {
  beforeAll(async () => {
    await supabaseAdmin.rpc("truncate_tables");
  });

  afterEach(async () => {
    await supabaseAdmin.rpc("truncate_tables");
  });

  it("should create mails associated to mailing based on the mail template", async () => {
    const { data: mailTemplateData, error: mailTemplateError } =
      await supabaseAdmin
        .from("mail_template")
        .insert({
          corps:
            "Bonjour {{point_de_collecte.nom}}, merci de nous communiquer" +
            " votre taux de remplissage avant le {{dateLimit}}",
          sujet: "Demande taux de remplissage",
          nom: "demande-taux-remplissage",
          variables: [
            {
              name: "dateLimit",
              type: "date",
              label: "Date limite",
            },
          ],
        })
        .select();

    expect(mailTemplateError).toBeNull();

    const mailTemplateId = mailTemplateData![0].id;

    const { data: pointDeCollecteData, error: pointDeCollecteError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Bureau L'INCASSABLE",
          adresse: "134 Boulevard Longchamp, 13001 Marseille, France",
          type: "Massification",
          setup_date: "2024-09-20",
          latitude: 43.3033002,
          longitude: 5.3926264,
          emails: ["benoit@lincassable.com"],
          contacts: ["Benoit Guigal"],
          telephones: [],
          contenant_collecte_type: "casier_x12",
          stock_casiers_75: 12,
          stock_paloxs: 0,
        })
        .select();

    expect(pointDeCollecteError).toBeNull();

    const pointDeCollecteId = pointDeCollecteData![0].id;

    const { data: mailingData, error: mailingError } = await supabaseAdmin
      .from("mailing")
      .insert({
        mail_template_id: mailTemplateId,
        statut: "En attente",
        point_de_collecte_ids: [pointDeCollecteId],
        variables: { dateLimit: "2025-02-26" },
      })
      .select();

    expect(mailingError).toBeNull();

    const mailing = mailingData![0];

    // Attend l'invocation de la fonction par le trigger
    await waitFor(async () => {
      const { data: mailData } = await supabaseAdmin.from("mail").select();
      expect(mailData).toHaveLength(1);
      expect(mailData?.[0]).toMatchObject({
        to: "benoit@lincassable.com",
        statut: "created",
        corps:
          "Bonjour , merci de nous communiquer votre taux de remplissage avant le mercredi 26 février",
        sujet: "Demande taux de remplissage",
        mailing_id: mailing.id,
        point_de_collecte_id: pointDeCollecteId,
      });
    });
  });
});
