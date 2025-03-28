import { isAxiosError } from "npm:axios";
import { corsHeaders } from "./cors.ts";
import * as Sentry from "npm:@sentry/deno";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN"),
  tracesSampleRate: 1.0,
});

/**
 * Wrapper autour des instructions qui s'exécutent dans les "edge functions".
 * - récupère le payload depuis la requête
 * - gère les erreurs et notifie Sentry
 * - gère les headers cors (en cas de requête depuis un navigateur)
 */
export function handle<T>(
  fn: (payload: T, headers: Headers) => Promise<any>,
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
      Sentry.captureException(error);
      if (isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      } else if (error instanceof Error) {
        console.log(error.message);
      }
      return new Response(
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Something went wrong",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...(cors ? corsHeaders : {}),
          },
          status: 500,
        }
      );
    }
  };
}
