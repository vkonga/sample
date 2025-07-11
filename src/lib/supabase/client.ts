"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    // This will be caught by the action and a user-friendly error will be shown.
    throw new Error("Supabase URL or Anon Key is missing from .env file.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
