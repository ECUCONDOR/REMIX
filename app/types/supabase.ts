import type { SupabaseClient, User } from "@supabase/supabase-js";

export interface SupabaseOutletContext {
  supabase: SupabaseClient;
  user: User;
}
