import { corsHeaders } from "./cors.ts";

/**
 * Wrapper autour des instructions qui s'exécutent dans les "edge functions".
 * - récupère le payload depuis la requête
 * - gère les erreurs
 * - gère les headers cors (en cas de requête depuis un navigateur)
 */
export function handle<T>(
  fn: (payload: T, headers) => Promise<any>,
  cors = false
): Deno.ServeHandler {
  return async (req) => {
    // permet de faire des requêtes depuis le navigateur
    if (cors && req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    try {
      const data = (await req.json()) as T;
      const result = await fn(data, req.headers);
      const response = result ?? { status: "ok" };
      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
          ...(cors ? corsHeaders : {}),
        },
      });
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: {
          "Content-Type": "application/json",
          ...(cors ? corsHeaders : {}),
        },
        status: 500,
      });
    }
  };
}
