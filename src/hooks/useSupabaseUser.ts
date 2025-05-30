
import { useState } from "react";
import { User } from "@/types";

export function useSupabaseUser(initialUser: User | null = null) {
  const [user, setUser] = useState<User | null>(initialUser);

  return { user, setUser };
}
