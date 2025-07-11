"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = "http://localhost:54321";
  const supabaseAnonKey = "your-anon-key";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Returning a null client.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
