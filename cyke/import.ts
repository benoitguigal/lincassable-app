import * as fs from "fs";
import csvParser from "csv-parser";
import dayjs from "dayjs";
import { createClient } from "@refinedev/supabase";

interface CsvRecord {
  Statut: "delivered" | "cancelled" | "failed";
  "Prix facturé": string;
  Direction: "outbound" | "inbound";
  "Nombre de colis": string;
  "Ramasse - Effectuée le": string;
  "Ramasse – Entreprise": string;
  "Dépose – Entreprise": string;
  Contenant: string;
}

interface Tournee {
  date: string;
  point_de_massification_id: number;
  transporteur_id: number;
  zone_de_collecte_id: number;
  statut: string;
  prix: number;
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
      .pipe(csvParser({ separator: ";" })) // Définir le séparateur comme point-virgule
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

  const collecteByDate: { [date: string]: CsvRecord[] } = data.reduce(
    (acc, record) => {
      const dateCollecte = dayjs(record["Ramasse - Effectuée le"]).format(
        "YYYY-MM-DD"
      );
      if (record.Statut === "cancelled" || record.Statut === "failed") {
        return acc;
      }
      if (record.Contenant.includes("Palette")) {
        // correspond à une ouverture du hub pour une
        // livraison / collecte de palettes de casiers
        return acc;
      }
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
      statut: "Validé",
      prix,
    };

    // const { data, error } = await supabase
    //   .from("tournée")
    //   .insert([tournee])
    //   .select();

    // const tournee_id = data![0].id as number;

    const tournee_id = 1;

    const collectesByPoint: { [key: number]: Collecte } = collectes.reduce(
      (acc, c) => {
        if (c.Direction === "outbound") {
          // Trajet du dépôt vers le point de collecte
          // Le point de collecte correspond au champ "Dépose - Entreprise"
          const pointDeCollecte = c["Dépose – Entreprise"];
          const point_de_collecte_id = pointDeCollectesIds[pointDeCollecte];
          const colisage = {
            livraison_nb_casier_75_vide: parseInt(c["Nombre de colis"]),
          };
          if (!point_de_collecte_id) {
            return acc;
          }
          if (acc[point_de_collecte_id]) {
            return {
              ...acc,
              [point_de_collecte_id]: {
                ...acc[point_de_collecte_id],
                ...colisage,
              },
            };
          } else {
            return {
              ...acc,
              [point_de_collecte_id]: {
                point_de_collecte_id,
                tournee_id,
                ...colisage,
              },
            };
          }
        } else {
          // inbound - Trajet du point de collecte vers le dépôt
          // Le point de collecte correspond au champ "Ramasse - Entreprise"
          const pointDeCollecte = c["Ramasse – Entreprise"];
          const point_de_collecte_id = pointDeCollectesIds[pointDeCollecte];
          const nbCasiers = parseInt(c["Nombre de colis"]);
          const colisage = {
            collecte_nb_casier_75_plein: nbCasiers,
            collecte_nb_bouteilles: nbCasiers * 12,
          };

          if (!point_de_collecte_id) {
            return acc;
          }

          if (acc[point_de_collecte_id]) {
            return {
              ...acc,
              [point_de_collecte_id]: {
                ...acc[point_de_collecte_id],
                ...colisage,
              },
            };
          } else {
            return {
              ...acc,
              [point_de_collecte_id]: {
                point_de_collecte_id,
                tournee_id,
                ...colisage,
              },
            };
          }
        }
      },
      {}
    );

    //await supabase.from("collecte").insert(Object.values(collectesByPoint));
  }
})().then(() => process.exit());
