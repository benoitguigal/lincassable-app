import * as fs from "fs";
import csvParser from "csv-parser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { createClient } from "@refinedev/supabase";

dayjs.extend(customParseFormat);

interface CsvRecord {
  "Identifiant livraison Cyke": string;
  "Livrer à partir de": string;
  Statut: "delivered" | "cancelled" | "failed";
  "Prix facturé": string;
  Direction: "outbound" | "inbound";
  "Nombre de colis": string;
  "Ramasse - Effectuée le": string;
  "Ramasse – Entreprise": string;
  "Dépose – Entreprise": string;
  Colis: string;
}

interface Tournee {
  date: string;
  point_de_massification_id: number;
  transporteur_id: number;
  zone_de_collecte_id: number;
  statut: string;
  prix: number;
  type_de_vehicule: "velo";
}

interface Collecte {
  point_de_collecte_id: number;
  tournee_id: number;
  collecte_nb_casier_75_plein: number;
  livraison_nb_casier_75_vide: number;
  collecte_nb_bouteilles: number;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const SUPABASE_AUTH_EMAIL = process.env.SUPABASE_AUTH_EMAIL;
const SUPABASE_AUTH_PASSWORD = process.env.SUPABASE_AUTH_PASSWORD;

if (
  !SUPABASE_URL ||
  !SUPABASE_API_KEY ||
  !SUPABASE_AUTH_EMAIL ||
  !SUPABASE_AUTH_PASSWORD
) {
  throw new Error("Missing env variables");
}

const pointDeCollectesIds = JSON.parse(
  fs.readFileSync("./cyke/mapping.json", "utf8")
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});

async function readCsv(path: string) {
  const results: CsvRecord[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csvParser({ separator: "," })) // Définir le séparateur comme point-virgule
      .on("data", (data: CsvRecord) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });

  return results;
}

(async () => {
  const csvPath = "cyke/export.csv";
  const data = await readCsv(csvPath);

  await supabase.auth.signInWithPassword({
    email: SUPABASE_AUTH_EMAIL,
    password: SUPABASE_AUTH_PASSWORD,
  });

  // Vérifie que tous les points de collectes sont inclus dans le mapping
  for (const record of data) {
    const pointDeCollecte = record["Dépose – Entreprise"];
    if (!pointDeCollectesIds[pointDeCollecte]) {
      throw new Error(
        `Il manque un mapping pour le point de collecte ${pointDeCollecte}`
      );
    }
  }

  const collecteByDate: { [date: string]: CsvRecord[] } = data.reduce(
    (acc, record) => {
      if (record.Statut !== "delivered") {
        return acc;
      }
      if (record.Colis.includes("Palette")) {
        // correspond à une ouverture du hub pour une
        // livraison / collecte de palettes de casiers
        return acc;
      }

      const dateCollecte = dayjs(
        record["Livrer à partir de"].slice(0, 10),
        "DD/MM/YYYY"
      ).format("YYYY-MM-DD");

      if (acc[dateCollecte]) {
        return { ...acc, [dateCollecte]: [...acc[dateCollecte], record] };
      }
      return { ...acc, [dateCollecte]: [record] };
    },
    {}
  );

  for (const date of Object.keys(collecteByDate)) {
    const collectes = collecteByDate[date];

    const prix = collectes.reduce(
      (acc, curr) => acc + parseFloat(curr["Prix facturé"]),
      0
    );
    const tournee: Tournee = {
      date,
      point_de_massification_id: 316,
      transporteur_id: 3, // Agile en Ville
      zone_de_collecte_id: 1, // Marseille Centre
      statut: "Clôturé",
      prix,
      type_de_vehicule: "velo",
    };

    const { data, error } = await supabase
      .from("tournee")
      .insert([tournee])
      .select();

    if (error) {
      console.log(error);
    }

    const tournee_id = data?.[0].id as number;

    if (tournee_id) {
      const collecteData: Collecte[] = collectes.map((collecte) => {
        const pointDeCollecte = collecte["Dépose – Entreprise"];
        const point_de_collecte_id = pointDeCollectesIds[pointDeCollecte];
        const nbCasiers = parseInt(collecte["Nombre de colis"]);
        return {
          tournee_id,
          cyke_id: collecte["Identifiant livraison Cyke"],
          point_de_collecte_id,
          livraison_nb_casier_75_vide: nbCasiers,
          collecte_nb_casier_75_plein: nbCasiers,
          collecte_nb_bouteilles: nbCasiers * 12,
        };
      });

      const { error: errorCollecte } = await supabase
        .from("collecte")
        .insert(collecteData);

      if (errorCollecte) {
        console.log(errorCollecte);
      }
    }
  }
})().then(() => process.exit());
