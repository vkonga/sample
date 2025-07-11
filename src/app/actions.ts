"use server";

import { z } from "zod";
import { generatePersonalizedBlurb } from "@/ai/flows/generate-personalized-blurb";

const requestAccessSchema = z.object({
  userName: z.string(),
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

  try {
    // In a real application, you would save the user's request to a database here.
    // e.g., await db.collection('earlyAccess').add({ ...parsedInput.data, createdAt: new Date() });

    // Simulate a short delay to make the loading state visible
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await generatePersonalizedBlurb(parsedInput.data);
    
    if (result.personalizedBlurb) {
      return { success: true, blurb: result.personalizedBlurb };
    } else {
      // Fallback if AI generation fails but we still want to confirm signup
      return { success: true, blurb: `Thank you, ${parsedInput.data.userName}! We're excited to have you on board and will tailor your experience based on your interest in your story ideas. Get ready for some amazing stories!` };
    }
    
  } catch (error) {
    console.error("Error requesting early access:", error);
    // In a real app, you would log this error to a monitoring service.
    return { success: false, error: "Something went wrong on our end. Please try again later." };
  }
}
