//this is th raper of the next in ssg
import { ReactNode } from "react";
import SignOutButton from "@/components/auth/SignOutButton";
import { getUser } from "@lib/cookies";
import { redirect } from "next/navigation";



export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
   const user = await getUser();
    if (!user) redirect("/login");
  return (
    <div>
      <header className="flex justify-between p-4 border-b">
        <p>Welcome, {user?.userName}!</p>
        <SignOutButton />
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
