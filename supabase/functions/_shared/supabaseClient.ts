import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "./types/supabase.ts";

export default function supabaseClient(opts?: { authorization: string }) {
  return createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    opts?.authorization
      ? {
          global: {
            headers: { Authorization: opts.authorization },
          },
        }
      : {}
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
  );
}
