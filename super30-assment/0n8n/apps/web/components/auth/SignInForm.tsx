// //in this use zod and for form it's react-hook-form

// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { TSignInSchema, signInSchema } from "@/lib/validators";
// import { Button } from "@/components/ui/button";
// import api from "@lib/api";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export function SignInForm() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<TSignInSchema>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: TSignInSchema) => {
//     const response = await api.post("/user/signin", {
//       body: JSON.stringify(data),
//     });

//     if (response.status==200) {
//       router.push("/home");
//     } else {
//       setError("Something went wrong.");
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="email@example.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="••••••••" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         {error && <p className="text-sm font-medium text-destructive">{error}</p>}
//         <Button type="submit" disabled={form.formState.isSubmitting}>
//           {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
//         </Button>
//       </form>
//     </Form>
//   );
// }