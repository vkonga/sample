"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Use hardcoded placeholders to prevent app from crashing
  // USER: Replace with your actual Supabase credentials or use environment variables
  const supabaseUrl = "https://your-project-url.supabase.co";
  const supabaseAnonKey = "your-anon-key-goes-here";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Returning a null client.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
