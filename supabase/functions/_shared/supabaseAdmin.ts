import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "./types/supabase.ts";

const supabaseAdmin = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

export default supabaseAdmin;
