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
    const { data: collecteData, error: collecteError } = await supabaseAdmin
      .from("collecte")
      .insert({
        date: "2025-02-26",
        point_de_collecte_id: pointDeMassification.id,
        point_de_massification_id: centreDeTri.id,
        collecte_nb_casier_75_plein: 10,
        livraison_nb_casier_75_vide: 10,
      })
      .select("*");

    expect(collecteError).toBeNull();
    const collecte = collecteData![0];

    // Crée des collectes entre le point de collecte et le point de massification
    const { data: deliveryData, error: deliveryError } = await supabaseAdmin
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
        // du taux de remplissage
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

    // Invoque une première fois la fonction. Étant donné qu'aucune collecte n'a été effectuée
    // ce jour, aucun taux de remplissage ne doit être crée
    await supabaseAdmin.functions.invoke("compute_taux_remplissage", {
      body: {},
    });

    // Ajoute une nouvelle collecte qui a lieu aujourd'hui
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
      ])
      .select("*");

    expect(deliveryTodayError).toBeNull();

    // Invoque une nouvelle fois la fonction
    await supabaseAdmin.functions.invoke("compute_taux_remplissage", {
      body: {},
    });

    await waitFor(async () => {
      const { data, error } = await supabaseAdmin
        .from("remplissage_contenants")
        .select("*");
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      const tauxRemplissage = data![0];
      expect(tauxRemplissage.nb_casiers_plein).toEqual(25);
    });
  });
});
