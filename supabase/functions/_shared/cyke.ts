import axios from "npm:axios";

export type CykePlace = {
  company_name: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  postal_code: string;
  city: string;
};

export type CykePackage = {
  volume_dm3: number;
  weight_kg: number;
  name: string;
  amount: number;
};

export type CykeDelivery = {
  dropoff: {
    slot_starting_at: string;
    slot_ending_at: string;
    place: CykePlace;
  };
  packages: CykePackage[];
};

export type CykeWebhookPayload = {
  event_type:
    | "delivery_saved"
    | "delivery_scheduled"
    | "delivery_picked_up"
    | "delivery_delivered"
    | "delivery_cancelled"
    | "delivery_failed";
  payload: {
    delivery: { id: string; dropoff: { tracking_url: string } };
  };
};

const CYKE_URL = "https://www.cyke.io";

const authHeaders = {
  "X-User-Email": Deno.env.get("CYKE_EMAIL"),
  "X-User-Token": Deno.env.get("CYKE_TOKEN"),
};

async function cancelDelivery(id: string) {
  const response = await axios({
    method: "PATCH",
    url: `${CYKE_URL}/api/v2/deliveries/${id}/cancel`,
    headers: authHeaders,
  });
  return response.data;
}

async function updateDelivery(id: string, data: CykeDelivery) {
  const response = await axios({
    method: "PUT",
    url: `${CYKE_URL}/api/v2/deliveries/${id}`,
    headers: authHeaders,
    data: {
      ...data,
      // Les données de pickup sont auto-complétées à la création
      // mais ne sont pas auto-complétées lors d'un update. Il faut
      // donc les mettre à jour manuellement
      pickup: {
        slot_starting_at: data.dropoff.slot_starting_at,
        slot_ending_at: data.dropoff.slot_ending_at,
      },
    },
  });
  return response.data;
}

async function createDelivery(data: CykeDelivery) {
  const response = await axios({
    method: "POST",
    url: `${CYKE_URL}/api/v2/deliveries`,
    headers: authHeaders,
    data,
  });
  return response.data;
}

const cykeClient = {
  delivery: {
    create: createDelivery,
    update: updateDelivery,
    cancel: cancelDelivery,
  },
};

export default cykeClient;
