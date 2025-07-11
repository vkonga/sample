"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Replace with your actual Supabase URL and Anon Key
  const supabaseUrl = "https://your-supabase-url.supabase.co";
  const supabaseAnonKey = "your-supabase-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
