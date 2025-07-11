"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock or null client if credentials are not available.
    // This prevents the app from crashing during development or build if .env is not set up.
    console.warn("Supabase URL or Anon Key is missing. Returning a null client.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
