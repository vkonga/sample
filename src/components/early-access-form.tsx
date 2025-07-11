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
  userName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  storyPreferences: z
    .string()
    .min(10, "Tell us a bit more about what you'd like to create (min 10 characters).")
    .max(500, "Preferences can be up to 500 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function EarlyAccessForm() {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: "",
    successMessage: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      storyPreferences: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setFormState({ ...formState, isSubmitting: true, error: "" });
    try {
      const result = await requestEarlyAccess(values);

      if (result.success) {
        setFormState({
          isSubmitting: false,
          isSubmitted: true,
          error: "",
          successMessage: result.message,
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
        successMessage: "",
      });
    }
  }

  if (formState.isSubmitted) {
    return (
        <div
          className="animate-in fade-in-50 duration-500"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="text-center">
              <div className="mx-auto">
                <PartyPopper className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline mt-4">You're on the list!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{formState.successMessage}</p>
              <p className="text-sm text-muted-foreground pt-4">We'll be in touch soon. You can now close this page.</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userName"
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
                  <Input placeholder="e.g., jane@example.com" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storyPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What kind of stories do you want to create?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Adventure stories for my 5-year-old son about friendly dragons.'"
                    {...field}
                    rows={3}
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
          
          <Button type="submit" className="w-full font-bold" size="lg" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting Access...
              </>
            ) : "Request Early Access"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
              Be among the first to experience SalistleAI.
          </p>
        </form>
      </Form>
    </div>
  );
}
