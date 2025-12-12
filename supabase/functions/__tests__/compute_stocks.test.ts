import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect/expect";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/types/supabase.ts";
import { waitFor } from "./helpers.ts";

const supabaseAdmin = createClient<Database>(
  Deno.env.get("API_URL") ?? "",
  Deno.env.get("SERVICE_ROLE_KEY") ?? ""
);

describe("compute_stocks", () => {
  beforeEach(async () => {
    await supabaseAdmin.rpc("truncate_tables");
  });

  it("should compute stocks based on last inventory and collectes", async () => {
    // Crée un point de collecte
    const { data: pointDeCollecteData, error: pointDeCollecteError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Biocoop Tartanpion",
          adresse: "103 Rue du Camas, 13005 Marseille, France",
          type: "Magasin",
          setup_date: "2024-09-20",
          latitude: 43.2958663,
          longitude: 5.3961985,
          emails: ["biocoop@lincassable.com"],
          contacts: ["M Biocoop"],
          telephones: [],
          contenant_collecte_types: ["casier_x12"],
          stock_casiers_75: 0,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(pointDeCollecteError).toBeNull();
    expect(pointDeCollecteData?.length).toEqual(1);

    const pointDeCollecte = pointDeCollecteData![0];

    // Crée un point de massification intermédiaire
    const { data: pointDeMassificationData, error: pointDeMassificationError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Entrepôt massification",
          adresse: "38 Place Vivaux, 13002 Marseille, France",
          type: "Massification",
          setup_date: "2024-09-20",
          latitude: 43.2967181,
          longitude: 5.3677277,
          emails: ["massification@lincassable.com"],
          contacts: ["M collecte"],
          telephones: [],
          contenant_collecte_types: ["casier_x12"],
          stock_casiers_75: 0,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(pointDeMassificationError).toBeNull();
    expect(pointDeMassificationData?.length).toEqual(1);

    const pointDeMassification = pointDeMassificationData![0];

    // Crée un centre de tri
    const { data: centreDeTriData, error: centreDeTriError } =
      await supabaseAdmin
        .from("point_de_collecte")
        .insert({
          nom: "Centre de tri",
          adresse: "27 Avenue De Rome, 13127 Vitrolles, France",
          type: "Tri",
          setup_date: "2024-09-20",
          latitude: 43.437293,
          longitude: 5.247665,
          emails: ["trin@lincassable.com"],
          contacts: ["M tri"],
          telephones: [],
          contenant_collecte_types: ["casier_x12"],
          stock_casiers_75: 0,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(centreDeTriError).toBeNull();
    expect(centreDeTriData?.length).toEqual(1);

    const centreDeTri = centreDeTriData![0];

    const pointDeCollecteStockCasiers75 = 15;
    const pointDeCollecteStockPalox = 1;
    const pointDeCollecteStockCasiers33 = 10;

    const pointDeMassificationStockCasiers75 = 150;
    const pointDeMassificationStockPalox = 15;
    const pointDeMassificationStockCasiers33 = 100;
    const pointDeMassificationStockCasiers75Plein = 10;
    const pointDeMassificationStockCasiers33Plein = 20;
    const pointsDeMassificationStockPaloxPlein = 5;

    const centreDeTriStockCasiers75 = 300;
    const centreDeTriStockPalox = 50;
    const centreDeTriStockCasiers33 = 200;

    // Crée des inventaires de stock sur les différents points (collecte, massificiation, tri)
    const { error: inventaireError } = await supabaseAdmin
      .from("inventaire")
      .insert([
        // dernier inventaire en date sur le point de collecte, doit être pris en compte
        {
          date: new Date("2025-01-01").toISOString(),
          point_de_collecte_id: pointDeCollecte.id,
          stock_casiers_75: pointDeCollecteStockCasiers75,
          stock_casiers_33: pointDeCollecteStockCasiers33,
          stock_paloxs: pointDeCollecteStockPalox,
        },
        // inventaire antérieur sur le point de collecte, ne doit pas être pris en compte
        {
          date: new Date("2024-12-25").toISOString(),
          point_de_collecte_id: pointDeCollecte.id,
          stock_casiers_33: 20,
          stock_casiers_75: 25,
          stock_paloxs: 0,
        },
        // dernier inventaire en date sur le point de massification
        {
          date: new Date("2025-01-01").toISOString(),
          point_de_collecte_id: pointDeMassification.id,
          stock_casiers_33: pointDeMassificationStockCasiers33,
          stock_casiers_33_plein: pointDeMassificationStockCasiers33Plein,
          stock_casiers_75: pointDeMassificationStockCasiers75,
          stock_casiers_75_plein: pointDeMassificationStockCasiers75Plein,
          stock_paloxs: pointDeMassificationStockPalox,
          stock_paloxs_plein: pointsDeMassificationStockPaloxPlein,
        },
        // dernier inventaire sur le centre de tri
        {
          date: new Date("2025-01-01").toISOString(),
          point_de_collecte_id: centreDeTri.id,
          stock_casiers_33: centreDeTriStockCasiers33,
          stock_casiers_33_plein: 0,
          stock_casiers_75: centreDeTriStockCasiers75,
          stock_casiers_75_plein: 0,
          stock_paloxs: centreDeTriStockPalox,
          stock_paloxs_plein: 0,
        },
      ])
      .select("*");

    expect(inventaireError).toBeNull();

    // Attend que les trigger s'éxecute pour mettre à jour les stocks sur le point de
    // collecte et le point de massification
    await waitFor(async () => {
      const { data: pointsDeCollecteAfterInventaire } = await supabaseAdmin
        .from("point_de_collecte")
        .select("*")
        .eq("id", pointDeCollecte.id);
      expect(pointsDeCollecteAfterInventaire).toHaveLength(1);

      const pointDeCollecteAfterInventaire =
        pointsDeCollecteAfterInventaire![0];
      expect(pointDeCollecteAfterInventaire.stock_casiers_75).toEqual(
        pointDeCollecteStockCasiers75
      );
      expect(pointDeCollecteAfterInventaire.stock_paloxs).toEqual(
        pointDeCollecteStockPalox
      );
      expect(pointDeCollecteAfterInventaire.stock_casiers_33).toEqual(
        pointDeCollecteStockCasiers33
      );

      const { data: pointsDeMassificationAfterInventaire } = await supabaseAdmin
        .from("point_de_collecte")
        .select("*")
        .eq("id", pointDeMassification.id);
      expect(pointsDeMassificationAfterInventaire).toHaveLength(1);

      const pointDeMassificationAfterInventaire =
        pointsDeMassificationAfterInventaire![0];
      expect(pointDeMassificationAfterInventaire.stock_casiers_75).toEqual(
        pointDeMassificationStockCasiers75
      );
      expect(pointDeMassificationAfterInventaire.stock_paloxs).toEqual(
        pointDeMassificationStockPalox
      );
      expect(pointDeMassificationAfterInventaire.stock_casiers_33).toEqual(
        pointDeMassificationStockCasiers33
      );
      expect(
        pointDeMassificationAfterInventaire.stock_casiers_75_plein
      ).toEqual(pointDeMassificationStockCasiers75Plein);
      expect(
        pointDeMassificationAfterInventaire.stock_casiers_33_plein
      ).toEqual(pointDeMassificationStockCasiers33Plein);
      expect(pointDeMassificationAfterInventaire.stock_paloxs_plein).toEqual(
        pointsDeMassificationStockPaloxPlein
      );

      const { data: centresDeTriAfterInventaire } = await supabaseAdmin
        .from("point_de_collecte")
        .select("*")
        .eq("id", centreDeTri.id);
      expect(centresDeTriAfterInventaire).toHaveLength(1);

      const centreDeTriAfterInventaire = centresDeTriAfterInventaire![0];
      expect(centreDeTriAfterInventaire.stock_casiers_75).toEqual(
        centreDeTriStockCasiers75
      );
      expect(centreDeTriAfterInventaire.stock_paloxs).toEqual(
        centreDeTriStockPalox
      );
      expect(centreDeTriAfterInventaire.stock_casiers_33).toEqual(
        centreDeTriStockCasiers33
      );
    });

    // Crée des collectes entre le point de collecte et le point de massification
    await supabaseAdmin
      .from("collecte")
      .insert([
        // collecte entre le point de massification et le point de collecte
        // ayant eu lieu après le dernier inventaire, doit être pris en compte
        {
          date: new Date("2025-01-10").toISOString(),
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          // +2 casiers 75cl sur le point de collecte
          // -2 casiers 75cl sur le point de massification
          collecte_nb_casier_75_plein: 10,
          livraison_nb_casier_75_vide: 12,
          // -3 casiers 33cl sur le point de collecte
          // + 3 casiers 33cl sur le point de massification
          collecte_nb_casier_33_plein: 5,
          livraison_nb_casier_33_vide: 2,
          // + 1 palox sur le point de collecte
          // -1 palox sur le centre de massification
          collecte_nb_palox_plein: 1,
          livraison_nb_palox_vide: 2,
        },
        // collecte entre le point de massification et le point de collecte
        // ayant eu lien avant le dernier inventaire, ne doit pas être pris en compte
        {
          date: new Date("2024-12-27").toISOString(),
          point_de_collecte_id: pointDeCollecte.id,
          point_de_massification_id: pointDeMassification.id,
          collecte_nb_casier_75_plein: 5,
          livraison_nb_casier_75_vide: 3,
          collecte_nb_casier_33_plein: 6,
          livraison_nb_casier_33_vide: 8,
          collecte_nb_palox_plein: 3,
          livraison_nb_palox_vide: 2,
        },
      ])
      .select("*");

    // Met à jour les stocks
    await supabaseAdmin.functions.invoke("compute_stocks", { body: {} });

    const {
      data: pointsDeCollecteAfterCollecte,
      error: pointDeCollecteAfterCollecteError,
    } = await supabaseAdmin
      .from("point_de_collecte")
      .select("*")
      .eq("id", pointDeCollecte.id);

    expect(pointDeCollecteAfterCollecteError).toBeNull();

    expect(pointsDeCollecteAfterCollecte).toHaveLength(1);

    const pointDeCollecteAfterCollecte = pointsDeCollecteAfterCollecte![0];

    expect(pointDeCollecteAfterCollecte.stock_casiers_75).toEqual(
      pointDeCollecteStockCasiers75 + 2
    );
    expect(pointDeCollecteAfterCollecte.stock_casiers_33).toEqual(
      pointDeCollecteStockCasiers33 - 3
    );
    expect(pointDeCollecteAfterCollecte.stock_paloxs).toEqual(
      pointDeCollecteStockPalox + 1
    );

    const {
      data: pointsDeMassificationAfterDelivery,
      error: pointDeMassificationAfterDeliveryError,
    } = await supabaseAdmin
      .from("point_de_collecte")
      .select("*")
      .eq("id", pointDeMassification.id);

    expect(pointDeMassificationAfterDeliveryError).toBeNull();

    expect(pointsDeMassificationAfterDelivery).toHaveLength(1);

    const pointDeMassificationAfterDelivery =
      pointsDeMassificationAfterDelivery![0];

    expect(pointDeMassificationAfterDelivery.stock_casiers_75).toEqual(
      //pointDeMassificationStockCasiers75 - 2 - 2
      pointDeMassificationStockCasiers75 - 2
    );
    expect(pointDeMassificationAfterDelivery.stock_casiers_33).toEqual(
      //pointDeMassificationStockCasiers33 + 3 + 1
      pointDeMassificationStockCasiers33 + 3
    );
    expect(pointDeMassificationAfterDelivery.stock_paloxs).toEqual(
      //pointDeMassificationStockPalox - 1 - 2
      pointDeMassificationStockPalox - 1
    );
    expect(pointDeMassificationAfterDelivery.stock_casiers_75_plein).toEqual(
      pointDeMassificationStockCasiers75Plein + 10
    );
    expect(pointDeMassificationAfterDelivery.stock_casiers_33_plein).toEqual(
      pointDeMassificationStockCasiers33Plein + 5
    );
    expect(pointDeMassificationAfterDelivery.stock_paloxs_plein).toEqual(
      pointsDeMassificationStockPaloxPlein + 1
    );

    // Crée une collecte entre le point de massification et le centre de tri
    await supabaseAdmin
      .from("collecte")
      .insert([
        // collecte entre le centre de tri et le point de massification
        {
          date: new Date("2025-01-10").toISOString(),
          point_de_collecte_id: pointDeMassification.id,
          point_de_massification_id: centreDeTri.id,
          // -2 casiers 75cl sur le centre de massification
          // + 2 casiers 75c sur le centre de tri
          collecte_nb_casier_75_plein: 150,
          livraison_nb_casier_75_vide: 148,
          // +1 casier 33cl sur le centre de massification
          // -1 casier 33cl sur le centre de tri
          collecte_nb_casier_33_plein: 4,
          livraison_nb_casier_33_vide: 5,
          // -2 palox sur le centre de massification
          // +2 palox sur le centre de tri
          collecte_nb_palox_plein: 15,
          livraison_nb_palox_vide: 13,
        },
      ])
      .select("*");

    // Met à jour les stocks
    await supabaseAdmin.functions.invoke("compute_stocks", { body: {} });

    const {
      data: pointsDeMassificationAfterCollecte,
      error: pointDeMassificationAfterCollecteError,
    } = await supabaseAdmin
      .from("point_de_collecte")
      .select("*")
      .eq("id", pointDeMassification.id);

    expect(pointDeMassificationAfterCollecteError).toBeNull();

    expect(pointsDeMassificationAfterCollecte).toHaveLength(1);

    const pointDeMassificationAfterCollecte =
      pointsDeMassificationAfterCollecte![0];

    expect(pointDeMassificationAfterCollecte.stock_casiers_75).toEqual(
      pointDeMassificationStockCasiers75 - 2 - 2
    );
    expect(pointDeMassificationAfterCollecte.stock_casiers_33).toEqual(
      pointDeMassificationStockCasiers33 + 3 + 1
    );
    expect(pointDeMassificationAfterCollecte.stock_paloxs).toEqual(
      pointDeMassificationStockPalox - 1 - 2
    );

    expect(pointDeMassificationAfterCollecte.stock_casiers_75_plein).toEqual(0);
    expect(pointDeMassificationAfterCollecte.stock_casiers_33_plein).toEqual(
      pointDeMassificationStockCasiers33Plein + 5 - 4
    );
    expect(pointDeMassificationAfterCollecte.stock_paloxs_plein).toEqual(0);
  });

  it("should not update stocks when there is no inventory", async () => {
    const stockCasier75 = 10;
    const stockCasier33 = 15;
    const stockPalox = 1;
    // Crée un point de collecte

    await supabaseAdmin
      .from("point_de_collecte")
      .insert({
        nom: "Bureau INCASSABLE",
        adresse: "134 Boulevard Longchamp, 13001 Marseille, France",
        type: "Massification",
        setup_date: "2024-09-20",
        latitude: 43.3033002,
        longitude: 5.3926264,
        emails: ["benoit@lincassable.com"],
        contacts: ["Benoit Guigal"],
        telephones: [],
        contenant_collecte_types: "casier_x12",
        stock_casiers_75: stockCasier75,
        stock_casiers_33: stockCasier33,
        stock_paloxs: stockPalox,
      })
      .select("*");

    // Met à jour les stocks
    await supabaseAdmin.functions.invoke("compute_stocks", { body: {} });

    const {
      data: pointsDeCollecteAfterComputation,
      error: pointDeCollecteAfterComputationError,
    } = await supabaseAdmin.from("point_de_collecte").select("*");

    expect(pointDeCollecteAfterComputationError).toBeNull();

    const { stock_casiers_75, stock_casiers_33, stock_paloxs } =
      pointsDeCollecteAfterComputation![0];

    expect(stock_casiers_75).toEqual(stockCasier75);
    expect(stock_casiers_33).toEqual(stockCasier33);
    expect(stock_paloxs).toEqual(stockPalox);
  });
});
