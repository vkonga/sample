"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Wand2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { generateStoryAction } from '@/app/actions';

const formSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Please enter a prompt of at least 10 characters.')
    .max(500, 'Your prompt can be up to 500 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateStoryForm() {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    error: '',
    generatedStory: '',
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setFormState({ ...formState, isSubmitting: true, error: '', generatedStory: '' });
    try {
      const result = await generateStoryAction({
        prompt: values.prompt,
      });

      if (result.success && result.story) {
        setFormState({
          isSubmitting: false,
          error: '',
          generatedStory: result.story,
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      setFormState({
        isSubmitting: false,
        error: errorMessage,
        generatedStory: '',
      });
    }
  }

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary" />
                      Your Story Idea
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A brave squirrel who wants to fly to the moon in a rocket made of acorns."
                        {...field}
                        rows={5}
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formState.error && (
                <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  <p>{formState.error}</p>
                </div>
              )}
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" size="lg" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Writing your story...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Story
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {formState.generatedStory && (
        <div className="mt-8 animate-in fade-in-50 duration-500">
          <h3 className="text-2xl font-bold font-headline mb-4 text-center">Your Story!</h3>
          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {formState.generatedStory}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
