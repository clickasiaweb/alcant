// Server-side signup handler using a Supabase service key.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Disabled sign up (temporary)
  return res
    .status(503)
    .json({ error: "Signup is temporarily disabled. Please try again later." });
}
