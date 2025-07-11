"use server";

import { z } from "zod";
import { generatePersonalizedBlurb } from "@/ai/flows/generate-personalized-blurb";
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const parsedInput = requestAccessSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }
  
  if (!supabase) {
    return { success: false, error: "Could not connect to the database. Please check your Supabase credentials in the .env file." };
  }

  try {
    const { error } = await supabase.from('early_access_requests').insert({ 
      name: parsedInput.data.userName,
      email: parsedInput.data.email,
      preferences: parsedInput.data.storyPreferences
    });

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === '42501') { // permission denied
        return { success: false, error: "Database security policy error. Please ensure your Supabase table allows public inserts." };
      }
      return { success: false, error: "Could not save your request. Please try again." };
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
    console.error("Error requesting early access:", error);
    return { success: false, error: "Something went wrong on our end. Please try again later." };
  }
}
