"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = "https://example.supabase.co";
  const supabaseAnonKey = "example-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
