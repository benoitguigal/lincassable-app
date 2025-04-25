import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect/expect";
import { waitFor } from "./helpers.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/types/supabase.ts";

const supabaseAdmin = createClient<Database>(
  Deno.env.get("API_URL") ?? "",
  Deno.env.get("SERVICE_ROLE_KEY") ?? ""
);

describe("compute_taux_remplissage", () => {
  beforeEach(async () => {
    await supabaseAdmin.rpc("truncate_tables");
  });

  it("should compute taux de remplissage at points de massification", async () => {
    // Crée un point de collecte
    const { data: pointDeCollecteData, error: pointDeCollecteError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Biocoop Tartanpion",
          adresse: "21 Rue Sauveur Tobelem, 13007 Marseille, France",
          type: "Magasin",
          setup_date: "2024-09-20",
          latitude: 43.288188,
          longitude: 5.364199,
          emails: ["biocoop@lincassable.com"],
          contacts: ["M Biocoop"],
          telephones: [],
          contenant_collecte_type: "casier_x12",
          stock_casiers_75: 10,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(pointDeCollecteError).toBeNull();
    const pointDeCollecte = pointDeCollecteData![0];

    // Crée un point de massification
    const { data: pointDeMassificationData, error: pointDeMassificationError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Bureau INCASSABLE",
          adresse: "134 Boulevard Longchamp, 13001 Marseille, France",
          type: "Massification",
          setup_date: "2024-09-20",
          latitude: 43.3033002,
          longitude: 5.3926264,
          emails: ["massification@lincassable.com"],
          contacts: ["M Massification"],
          telephones: [],
          contenant_collecte_type: "casier_x12",
          stock_casiers_75: 200,
          stock_casiers_75_plein: 20,
          stock_casiers_75_plein_prevision: 20,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(pointDeMassificationError).toBeNull();
    const pointDeMassification = pointDeMassificationData![0];

    // Crée un centre de tri
    const { data: centreDeTriData, error: centreDeTriError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Entrepôt",
          adresse: "27 Avenue De Rome, 13127 Vitrolles, France",
          type: "Tri",
          setup_date: "2024-09-20",
          latitude: 43.437293,
          longitude: 5.247665,
          emails: ["tri@lincassable.com"],
          contacts: ["M Tri"],
          telephones: [],
          contenant_collecte_type: "casier_x12",
          stock_casiers_75: 500,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(centreDeTriError).toBeNull();
    const centreDeTri = centreDeTriData![0];

    // Crée une ramasse du centre de massification vers le centre de tri
    // Cette collecte sert de base pour le calcul du nombre de casiers pleins.
    const { error: collecteError } = await supabaseAdmin
      .from("collecte")
      .insert({
        date: "2025-02-26",
        point_de_collecte_id: pointDeMassification.id,
        point_de_massification_id: centreDeTri.id,
        collecte_nb_casier_75_plein: 200,
        livraison_nb_casier_75_vide: 200,
      })
      .select("*");

    expect(collecteError).toBeNull();

    // Crée des collectes entre le point de collecte et le point de massification
    const { error: deliveryError } = await supabaseAdmin
      .from("collecte")
      .insert([
        {
          // livraison effectuée avant le dernier transfert entre
          // le point de massification et le centre de tri -
          // NE DOIT PAS ÊTRE PRISE EN COMPTE
          date: "2025-01-01",
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          collecte_nb_casier_75_plein: 10,
          livraison_nb_casier_75_vide: 10,
        },
        // Les livraisons suivantes doivent êtres prises en compte dans le calcul
        {
          date: "2025-03-01",
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          collecte_nb_casier_75_plein: 10,
          livraison_nb_casier_75_vide: 10,
        },
        {
          date: "2025-03-02",
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          collecte_nb_casier_75_plein: 10,
          livraison_nb_casier_75_vide: 10,
        },
      ])
      .select("*");

    expect(deliveryError).toBeNull();

    // Invoque une première fois la fonction.
    await supabaseAdmin.functions.invoke("compute_taux_remplissage", {
      body: {},
    });

    // Les collectes passées correspondent
    // au nombre de casiers pleins renseignés sur le point de massification.
    // Le taux de remplissage ne doit donc pas être renseigné et le stock de casiers pleins
    // doit rester inchangé
    let remplissageContenantsIsFilled = true;
    try {
      await waitFor(async () => {
        const { data } = await supabaseAdmin
          .from("remplissage_contenants")
          .select("*");
        expect(data?.length).toBeGreaterThan(0);
      });
    } catch (_err) {
      remplissageContenantsIsFilled = false;
    }

    expect(remplissageContenantsIsFilled).toEqual(false);

    // Ajoute une nouvelle collecte qui a lieu aujourd'hui et une autre dans le futur
    const { error: deliveryTodayError } = await supabaseAdmin
      .from("collecte")
      .insert([
        {
          date: new Date().toISOString().split("T")[0],
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          collecte_nb_casier_75_plein: 5,
          livraison_nb_casier_75_vide: 5,
        },
        {
          date: new Date(
            Date.now() +
              // dans deux jours
              2 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          collecte_nb_casier_75_plein: 7,
          livraison_nb_casier_75_vide: 7,
        },
      ])
      .select("*");

    expect(deliveryTodayError).toBeNull();

    // Invoque une nouvelle fois la fonction
    await supabaseAdmin.functions.invoke("compute_taux_remplissage", {
      body: {},
    });

    await waitFor(async () => {
      const {
        data: remplissageContenantsData,
        error: remplissageContenantsError,
      } = await supabaseAdmin
        .from("remplissage_contenants")
        .select("*")
        .eq("point_de_collecte_id", pointDeMassification.id);
      expect(remplissageContenantsError).toBeNull();
      expect(remplissageContenantsData).toHaveLength(1);
      const tauxRemplissage = remplissageContenantsData![0];
      expect(tauxRemplissage.nb_casiers_plein).toEqual(25);

      const {
        data: pointDeMassificationAfterUpdateData,
        error: pointDeMassificationAterUpdateError,
      } = await supabaseAdmin
        .from("point_de_collecte")
        .select("*")
        .eq("id", pointDeMassification.id);

      expect(pointDeMassificationAterUpdateError).toBeNull();
      const pointDeMassificationAfterUpdate =
        pointDeMassificationAfterUpdateData![0];
      expect(pointDeMassificationAfterUpdate.stock_casiers_75_plein).toEqual(
        25
      );
      expect(
        pointDeMassificationAfterUpdate.stock_casiers_75_plein_prevision
      ).toEqual(32);
    });
  });
});
