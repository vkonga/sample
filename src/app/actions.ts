"use server";

import { z } from "zod";
import { generatePersonalizedBlurb } from "@/ai/flows/generate-personalized-blurb";
import { generateStory } from "@/ai/flows/generate-story";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const requestAccessSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  storyPreferences: z.string(),
});

type RequestAccessInput = z.infer<typeof requestAccessSchema>;

export async function requestEarlyAccess(
  input: RequestAccessInput
): Promise<{ success: boolean; blurb?: string; error?: string }> {
  const parsedInput = requestAccessSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { success: false, error: "Database credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file." };
  }
  
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const errorMessage = "Supabase client could not be created. Please check your credentials.";
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  try {
    const dataToInsert = { 
      name: parsedInput.data.userName,
      email: parsedInput.data.email,
      preferences: parsedInput.data.storyPreferences
    };

    console.log("Data being sent to Supabase:", dataToInsert);
    console.log("Data types:", {
      name: typeof dataToInsert.name,
      email: typeof dataToInsert.email,
      preferences: typeof dataToInsert.preferences,
    });

    const { error } = await supabase.from('early_access_requests').insert(dataToInsert);

    if (error) {
      console.error("Supabase insert error:", error);
      let friendlyError = "Could not save your request. Please try again.";
      if (error.code === '42501') { 
        friendlyError = "Database security policy error. Please ensure your Supabase table allows public inserts.";
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
      return { success: true, blurb: `Thank you, ${parsedInput.data.userName}! We're excited to have you on board and will tailor your experience based on your interest in your story ideas. Get ready for some amazing stories!` };
    }
    
  } catch (error) {
    console.error("Error in requestEarlyAccess function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `An unexpected error occurred: ${errorMessage}` };
  }
}


const generateStorySchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
});

type GenerateStoryInput = z.infer<typeof generateStorySchema>;

export async function generateStoryAction(
  input: GenerateStoryInput
): Promise<{ success: boolean; story?: string; error?: string }> {
  const parsedInput = generateStorySchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await generateStory({
      prompt: parsedInput.data.prompt,
    });

    if (result.story) {
      return { success: true, story: result.story };
    } else {
      return { success: false, error: 'Could not generate a story from your prompt. Please try again.' };
    }
  } catch (error) {
    console.error('Error generating story:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
