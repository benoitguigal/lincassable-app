// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Database } from "../_shared/types/supabase.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";
import cykeClient, {
  CykeDelivery,
  CykePackage,
  CykePlace,
} from "../_shared/cyke.ts";
import moment from "npm:moment-timezone";

type Collecte = Database["public"]["Tables"]["collecte"]["Row"];
type PointDeCollecte = Database["public"]["Tables"]["point_de_collecte"]["Row"];

type InsertPayload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: Collecte;
  old_record: null;
};
type UpdatePayload = {
  type: "UPDATE";
  table: string;
  schema: string;
  record: Collecte;
  old_record: Collecte;
};
type DeletePayload = {
  type: "DELETE";
  table: string;
  schema: string;
  record: null;
  old_record: Collecte;
};

const casier: Pick<CykePackage, "name" | "volume_dm3" | "weight_kg"> = {
  name: "Caisses à bouteille (max 16)",
  volume_dm3: 30,
  weight_kg: 8,
};

function getPlace(pointDeCollecte: PointDeCollecte): CykePlace {
  return {
    company_name: pointDeCollecte.nom ?? "",
    recipient_name: pointDeCollecte.contacts[0] ?? "",
    recipient_phone: pointDeCollecte.telephones[0] ?? "",
    address: [pointDeCollecte.adresse_numero, pointDeCollecte.adresse_rue].join(
      " "
    ),
    city: pointDeCollecte.adresse_ville ?? "",
    postal_code: pointDeCollecte.adresse_code_postal ?? "",
  };
}

function getPackaging(collecte: Collecte): CykePackage {
  return {
    ...casier,
    amount:
      // FIXME comment faire si deux chiffres différents
      collecte.collecte_nb_casier_75_plein ??
      collecte.livraison_nb_casier_75_vide,
  };
}

async function getFullCollecte(collecte: Collecte) {
  // Récupère les objets liés
  const { data: collecteData, error: collecteError } = await supabaseAdmin
    .from("collecte")
    .select("*,tournee(*,transporteur(*)),point_de_collecte(*)")
    .eq("id", collecte.id);

  if (collecteError) {
    throw collecteError;
  }

  const fullCollecte = collecteData[0];

  const pointDeCollecte = fullCollecte.point_de_collecte;

  if (!pointDeCollecte) {
    throw new Error("Aucun point de collecte correspondant");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { ...fullCollecte, pointDeCollecte: pointDeCollecte! };
}

function getDelivery(
  collecte: Awaited<ReturnType<typeof getFullCollecte>>
): CykeDelivery {
  const { pointDeCollecte, tournee } = collecte;
  const slotStartingAt = moment.tz(
    `${tournee?.date ?? collecte.date}T${
      collecte.creneau_horaire_debut ?? "08:00:00"
    }`,
    "Europe/Paris"
  );
  const slotEndingAt = moment.tz(
    `${tournee?.date ?? collecte.date}T${
      collecte.creneau_horaire_fin ?? "18:00:00"
    }`,
    "Europe/Paris"
  );

  // Met à jour les informations de la collecte
  const delivery: CykeDelivery = {
    dropoff: {
      slot_starting_at: slotStartingAt.toISOString(),
      slot_ending_at: slotEndingAt.toISOString(),
      place: getPlace(pointDeCollecte),
    },
    packages: [getPackaging(collecte)],
  };
  return delivery;
}

Deno.serve(async (req) => {
  // Database trigger
  const { type, record, old_record } = (await req.json()) as
    | InsertPayload
    | UpdatePayload
    | DeletePayload;

  try {
    if (type === "DELETE" && old_record.cyke_id) {
      // Annule la livraison cyke
      const canceled = await cykeClient.delivery.cancel(old_record.cyke_id);
      return new Response(JSON.stringify(canceled), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (type === "UPDATE" && record.cyke_id) {
      const collecte = await getFullCollecte(record);
      // Met à jour les informations de la collecte
      const data = getDelivery(collecte);
      // Met à jour la livraison cyke
      const updated = await cykeClient.delivery.update(record.cyke_id, data);
      return new Response(JSON.stringify(updated), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (type === "INSERT" && !record.cyke_id) {
      const collecte = await getFullCollecte(record);
      const cykeConnexion = collecte?.tournee?.transporteur?.cyke_connexion;
      if (cykeConnexion) {
        // Crée une livraison Cyke par API
        const data = getDelivery(collecte);
        const created = await cykeClient.delivery.create(data);
        const { id } = created;

        // Ajoute l'identifiant de la livraison Cyke à la collecte L'INCASSABLE
        const { data: collecteUpdateData, error: collecteUpdateError } =
          await supabaseAdmin
            .from("collecte")
            .update({ cyke_id: id })
            .eq("id", record.id);

        if (collecteUpdateError) {
          throw collecteUpdateError;
        }

        return new Response(JSON.stringify(collecteUpdateData), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/collecte_trigger' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
