"use server";

import { z } from "zod";
import { generatePersonalizedBlurb } from "@/ai/flows/generate-personalized-blurb";
import { generateStory } from "@/ai/flows/generate-story";

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
