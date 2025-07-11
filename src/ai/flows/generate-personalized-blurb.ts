'use server';

/**
 * @fileOverview Generates a personalized blurb for users after they submit the early access request form.
 *
 * - generatePersonalizedBlurb - A function that generates a personalized blurb.
 * - GeneratePersonalizedBlurbInput - The input type for the generatePersonalizedBlurb function.
 * - GeneratePersonalizedBlurbOutput - The return type for the generatePersonalizedBlurb function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedBlurbInputSchema = z.object({
  userName: z.string().describe('The name of the user requesting early access.'),
  storyPreferences: z.string().describe('The user\u2019s preferences for the storybook content.'),
});
export type GeneratePersonalizedBlurbInput = z.infer<typeof GeneratePersonalizedBlurbInputSchema>;

const GeneratePersonalizedBlurbOutputSchema = z.object({
  personalizedBlurb: z.string().describe('A personalized blurb tailored to the user\u2019s name and story preferences.'),
});
export type GeneratePersonalizedBlurbOutput = z.infer<typeof GeneratePersonalizedBlurbOutputSchema>;

export async function generatePersonalizedBlurb(input: GeneratePersonalizedBlurbInput): Promise<GeneratePersonalizedBlurbOutput> {
  return generatePersonalizedBlurbFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedBlurbPrompt',
  input: {schema: GeneratePersonalizedBlurbInputSchema},
  output: {schema: GeneratePersonalizedBlurbOutputSchema},
  prompt: `You are an expert at creating personalized blurbs for users who have requested early access to a storybook generation tool.

  Based on the user's name and their story preferences, create a short, engaging blurb that makes them feel acknowledged and provides a glimpse of how the storybook generator will tailor content to their needs.

  User Name: {{{userName}}}
  Story Preferences: {{{storyPreferences}}}

  Personalized Blurb:`,
});

const generatePersonalizedBlurbFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedBlurbFlow',
    inputSchema: GeneratePersonalizedBlurbInputSchema,
    outputSchema: GeneratePersonalizedBlurbOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
