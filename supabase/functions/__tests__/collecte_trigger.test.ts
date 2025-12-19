import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect/expect";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/types/supabase.ts";
import { waitFor } from "./helpers.ts";

const supabaseAdmin = createClient<Database>(
  Deno.env.get("API_URL") ?? "",
  Deno.env.get("SERVICE_ROLE_KEY") ?? ""
);

describe("collecte_trigger", () => {
  beforeEach(async () => {
    await supabaseAdmin.rpc("truncate_tables");
  });

  it("should set date and point_de_massification_id from tournee", async () => {
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
          contenant_collecte_types: [
            "casier_x12",
          ] as Database["public"]["Enums"]["contenant_collecte_type"][],
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
          contacts: ["Benoit Guigal"],
          telephones: [],
          contenant_collecte_types: [
            "casier_x12",
          ] as Database["public"]["Enums"]["contenant_collecte_type"][],
          stock_casiers_75: 200,
          stock_casiers_33: 0,
          stock_paloxs: 0,
        })
        .select("*");

    expect(pointDeMassificationError).toBeNull();
    const pointDeMassification = pointDeMassificationData![0];

    // Crée un transporteur
    const { data: transporteurData, error: transporteurError } =
      await supabaseAdmin
        .from("transporteur")
        .insert({ nom: "Transporteur" })
        .select("*");

    expect(transporteurError).toBeNull();

    const transporteur = transporteurData![0];

    // Crée une zone de collecte
    const { data: zoneDeCollecteData, error: zoneDeCollecteError } =
      await supabaseAdmin
        .from("zone_de_collecte")
        .insert({ nom: "La Zone" })
        .select("*");

    expect(zoneDeCollecteError).toBeNull();

    const zoneDeCollecte = zoneDeCollecteData![0];

    const tourneeDate = "2025-01-01";

    // Crée une tournée
    const { data: tourneeData, error: tourneeError } = await supabaseAdmin
      .from("tournee")
      .insert({
        zone_de_collecte_id: zoneDeCollecte.id,
        transporteur_id: transporteur.id,
        point_de_massification_id: pointDeMassification.id,
        date: tourneeDate,
      })
      .select("*");

    expect(tourneeError).toBeNull();

    const tournee = tourneeData![0];

    // Crée une collecte associée à cette tournée
    const { data: collecteData, error: collecteError } = await supabaseAdmin
      .from("collecte")
      .insert({
        tournee_id: tournee.id,
        point_de_collecte_id: pointDeCollecte.id,
        collecte_nb_casier_75_plein: 10,
        livraison_nb_casier_75_vide: 10,
      })
      .select("*");

    expect(collecteError).toBeNull();

    const collecte = collecteData![0];

    await waitFor(async () => {
      const {
        data: collecteAfterTriggerData,
        error: collecteAfterTriggerError,
      } = await supabaseAdmin
        .from("collecte")
        .select("*")
        .eq("id", collecte.id);
      expect(collecteAfterTriggerError).toBeNull();
      const collecteAfterTrigger = collecteAfterTriggerData![0];
      expect(collecteAfterTrigger.date).toEqual(tourneeDate);
      expect(collecteAfterTrigger.point_de_massification_id).toEqual(
        pointDeMassification.id
      );
    });
  });
});
