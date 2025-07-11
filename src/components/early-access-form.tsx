"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PartyPopper, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestEarlyAccess } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  preferences: z
    .string()
    .min(10, "Tell us a bit more about your preferences (min 10 characters).")
    .max(500, "Preferences can be up to 500 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function EarlyAccessForm() {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: "",
    personalizedBlurb: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      preferences: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setFormState({ ...formState, isSubmitting: true, error: "" });
    try {
      const result = await requestEarlyAccess({
        userName: values.name,
        email: values.email,
        storyPreferences: values.preferences,
      });

      if (result.success && result.blurb) {
        setFormState({
          isSubmitting: false,
          isSubmitted: true,
          error: "",
          personalizedBlurb: result.blurb,
        });
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: errorMessage,
        personalizedBlurb: "",
      });
    }
  }

  if (formState.isSubmitted) {
    return (
        <div
          className="animate-in fade-in-50 duration-500"
        >
          <Card className="bg-gradient-to-br from-background to-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto">
                <PartyPopper className="h-12 w-12 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-headline mt-4">You're on the list!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">Thank you for your interest! We've received your request.</p>
              <div className="text-left bg-background/50 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground">Here's a little something just for you:</p>
                <blockquote className="mt-2 italic text-muted-foreground border-l-2 border-accent pl-4">
                  {formState.personalizedBlurb}
                </blockquote>
              </div>
              <p className="text-sm text-muted-foreground pt-4">We'll send you an email with your access key as soon as a spot opens up. Keep an eye on your inbox!</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What kind of stories do you want to create?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Adventure stories for my 5-year-old son about friendly dragons.'"
                    {...field}
                    rows={4}
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
                Requesting...
              </>
            ) : "Get My Early Access"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
              We respect your privacy. No spam, we promise.
          </p>
        </form>
      </Form>
    </div>
  );
}
