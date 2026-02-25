import { createClient, SupabaseClient } from "@supabase/supabase-js";

function makeClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "[job] Missing NEXT_PUBLIC_SUPABASE_URL — copy .env.example → .env.local"
    );
  }
  if (!key) {
    throw new Error(
      "[job] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY — copy .env.example → .env.local"
    );
  }

  return createClient(url, key);
}

// Singleton — created on first access, not at module load time.
let _client: SupabaseClient | undefined;

export function getClient(): SupabaseClient {
  if (!_client) _client = makeClient();
  return _client;
}

// Lazy proxy so callers can import `supabase` directly without
// triggering env-var validation until the client is actually used.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});
