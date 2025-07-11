"use server";

import { z } from "zod";
import { generatePersonalizedBlurb } from "@/ai/flows/generate-personalized-blurb";
import { generateStory } from "@/ai/flows/generate-story";
import { createClient } from "@supabase/supabase-js";

// Helper function to create a Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are not configured.");
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

const requestAccessSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  storyPreferences: z
    .string()
    .min(10, "Tell us a bit more (min 10 characters)."),
});

type RequestAccessInput = z.infer<typeof requestAccessSchema>;

export async function requestEarlyAccess(
  input: RequestAccessInput
): Promise<{ success: boolean; blurb?: string; error?: string }> {
  const parsedInput = requestAccessSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  const { userName, email, storyPreferences } = parsedInput.data;

  try {
    // 1. Save to Supabase
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error("Database client could not be initialized.");
    }

    const { error: dbError } = await supabase
      .from("early_access_requests")
      .insert({ name: userName, email, preferences: storyPreferences });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 2. Generate personalized blurb
    const result = await generatePersonalizedBlurb({
      userName: userName,
      storyPreferences: storyPreferences,
    });

    if (result.personalizedBlurb) {
      return { success: true, blurb: result.personalizedBlurb };
    } else {
      return {
        success: true,
        blurb: `Thank you, ${userName}! We've received your request and will be in touch soon.`,
      };
    }
  } catch (error) {
    console.error("Error in requestEarlyAccess:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown server error.";
    return { success: false, error: `An error occurred: ${errorMessage}` };
  }
}

export async function getEarlyAccessCount(): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error("Database client could not be initialized.");
    }
    const { count, error } = await supabase
      .from("early_access_requests")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }
    
    return count ?? 0;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error fetching count:", errorMessage);
    return 0;
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
