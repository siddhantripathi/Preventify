
import { useState } from "react";
import { Session } from "@supabase/supabase-js";

export function useSupabaseSession(initialSession: Session | null = null) {
  const [session, setSession] = useState<Session | null>(initialSession);

  return { session, setSession };
}
