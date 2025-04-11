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
          nom: "Bureau INCASSABLE",
          adresse: "134 Boulevard Longchamp, 13001 Marseille, France",
          type: "Massification",
          setup_date: "2024-09-20",
          latitude: 43.3033002,
          longitude: 5.3926264,
          emails: ["benoit@lincassable.com"],
          contacts: ["Benoit Guigal"],
          telephones: [],
          contenant_collecte_type: "casier_x12",
          stock_casiers_75: 0,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(pointDeCollecteError).toBeNull();
    expect(pointDeCollecteData?.length).toEqual(1);

    const pointDeCollecte = pointDeCollecteData![0];

    // Crée un inventaire de stock
    const { data: inventaireData, error: inventaireError } = await supabaseAdmin
      .from("inventaire")
      .insert({
        date: new Date("2025-01-01").toISOString(),
        point_de_collecte_id: pointDeCollecte.id,
        stock_casiers_33: 10,
        stock_casiers_75: 15,
        stock_paloxs: 1,
      })
      .select("*");

    expect(inventaireError).toBeNull();

    const inventaire = inventaireData![0];

    // Attend que le trigger s'éxecute pour mettre à jour les stocks du point de collecte
    await waitFor(async () => {
      const { data: pointsDeCollecteAfterInventaire } = await supabaseAdmin
        .from("point_de_collecte")
        .select("*");
      expect(pointsDeCollecteAfterInventaire).toHaveLength(1);
      const pointDeCollecteAfterInventaire =
        pointsDeCollecteAfterInventaire![0];
      expect(pointDeCollecteAfterInventaire.stock_casiers_75).toEqual(
        inventaire.stock_casiers_75
      );
      expect(pointDeCollecteAfterInventaire.stock_paloxs).toEqual(
        inventaire.stock_paloxs
      );
      expect(pointDeCollecteAfterInventaire.stock_casiers_33).toEqual(
        inventaire.stock_casiers_33
      );
    });

    // Crée une collecte entre la date du dernier inventaire et aujourd'hui
    await supabaseAdmin
      .from("collecte")
      .insert([
        {
          date: new Date("2025-01-10").toISOString(),
          point_de_collecte_id: pointDeCollecte.id,
          collecte_nb_casier_75_plein: 10,
          livraison_nb_casier_75_vide: 12, // +2 casiers 75
          collecte_nb_casier_33_plein: 5,
          livraison_nb_casier_33_vide: 2, // -3 casiers 33,
          collecte_nb_palox_plein: 1,
          livraison_nb_palox_vide: 0, // -1 palox
        },
      ])
      .select("*");

    // Met à jour les stocks
    await supabaseAdmin.functions.invoke("compute_stocks", { body: {} });

    const {
      data: pointsDeCollecteAfterCollecte,
      error: pointDeCollecteAfterCollecteError,
    } = await supabaseAdmin.from("point_de_collecte").select("*");

    expect(pointDeCollecteAfterCollecteError).toBeNull();

    expect(pointsDeCollecteAfterCollecte).toHaveLength(1);

    const { stock_casiers_75, stock_casiers_33, stock_paloxs } =
      pointsDeCollecteAfterCollecte![0];

    expect(stock_casiers_75).toEqual(inventaire.stock_casiers_75 + 2);
    expect(stock_casiers_33).toEqual(inventaire.stock_casiers_33 - 3);
    expect(stock_paloxs).toEqual(inventaire.stock_paloxs - 1);
  });
});
