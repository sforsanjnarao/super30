// // components/auth/SignUpForm.tsx
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { TSignUpSchema, signUpSchema } from "../../lib/validators";
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

// export function SignUpForm() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<TSignUpSchema>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: TSignUpSchema) => {
//     const response = await api.post("/user/signup", {
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
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your Name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
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
//           {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
//         </Button>
//       </form>
//     </Form>
//   );
// }