'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().optional(), // Optional for signin
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Define the component's props
interface AuthFormProps {
  isSignUp: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  // We'll add a loading state later
  // isLoading: boolean;
}

export function AuthForm({ isSignUp, onSubmit }: AuthFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const title = isSignUp ? "Create an Account" : "Welcome Back";
  const description = isSignUp ? "Enter your details to get started." : "Sign in to access your dashboard.";
  const buttonText = isSignUp ? "Sign Up" : "Sign In";
  const linkText = isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up";
  const linkHref = isSignUp ? "/signin" : "/signup";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <Link href={linkHref} className="underline">
            {linkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}