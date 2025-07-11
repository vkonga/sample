"use server";

import { z } from "zod";
import { generatePersonalizedBlurb } from "@/ai/flows/generate-personalized-blurb";
import { generateStory } from "@/ai/flows/generate-story";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const requestAccessSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  storyPreferences: z.string(),
});

type RequestAccessInput = z.infer<typeof requestAccessSchema>;

function getSupabaseClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials missing in .env file.");
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (_) {
          // Server Component: Ignore set
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (_) {
          // Server Component: Ignore remove
        }
      },
    },
  });
}

export async function requestEarlyAccess(
  input: RequestAccessInput
): Promise<{ success: boolean; blurb?: string; error?: string }> {
  const parsedInput = requestAccessSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: "Database client could not be initialized. Check server logs." };
    }

    const dataToInsert = {
      name: parsedInput.data.userName,
      email: parsedInput.data.email,
      preferences: parsedInput.data.storyPreferences,
    };

    const { error } = await supabase
      .from("early_access_requests")
      .insert(dataToInsert);

    if (error) {
      console.error("Supabase insert error:", error);
      let friendlyError = "Could not save your request. Please try again.";

      if (error.code === "42501") {
        friendlyError =
          "Database security policy error. Please check Supabase RLS policies.";
      } else if (error.code === "23505") {
        friendlyError = "This email has already requested access.";
      } else {
        friendlyError = `Database error: ${error.message}`;
      }

      return { success: false, error: friendlyError };
    }

    const result = await generatePersonalizedBlurb({
      userName: parsedInput.data.userName,
      storyPreferences: parsedInput.data.storyPreferences,
    });

    if (result.personalizedBlurb) {
      return { success: true, blurb: result.personalizedBlurb };
    } else {
      return {
        success: true,
        blurb: `Thank you, ${parsedInput.data.userName}! We're excited to have you on board.`,
      };
    }
  } catch (error) {
    console.error("Error in requestEarlyAccess:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error.";
    return { success: false, error: `An error occurred: ${errorMessage}` };
  }
}

const generateStorySchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters."),
});

type GenerateStoryInput = z.infer<typeof generateStorySchema>;

export async function generateStoryAction(
  input: GenerateStoryInput
): Promise<{ success: boolean; story?: string; error?: string }> {
  const parsedInput = generateStorySchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const result = await generateStory({
      prompt: parsedInput.data.prompt,
    });

    if (result.story) {
      return { success: true, story: result.story };
    } else {
      return {
        success: false,
        error: "Could not generate a story. Please try again.",
      };
    }
  } catch (error) {
    console.error("Error generating story:", error);
    return {
      success: false,
      error: "Unexpected error. Please try again later.",
    };
  }
}

export async function getEarlyAccessCount(): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Error fetching count: Supabase client is null.");
      return 0;
    }
    const { count, error } = await supabase
      .from("early_access_requests")
      .select("", { count: "exact", head: true });

    if (error) throw error;

    return count ?? 0;
  } catch (error) {
    console.error("Error fetching count:", error);
    return 0;
  }
}
