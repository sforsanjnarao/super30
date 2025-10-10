//this is th raper of the next in ssg
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SignOutButton from "@/components/auth/SignOutButton";
import api from "@lib/api";

interface User {
  id: string;
  userName: string;
  email: string;
}

async function getUser(): Promise<User | null> {
    const cookieStore= await cookies()
  const token = cookieStore.get("token")?.value;
    
    if (!token) return null;
    try {
        const response = await api.get<User>( "/user/me",
          {
            headers: {
              Cookie: `token=${token}`,
            },
          }
        );
    
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return null;
      }
    }
    
 export default async function DashboardLayout({children}:{children: ReactNode}) {
        const user = await getUser();
        
        if (!user) redirect("/signin");
        
        return (
            <div>
      <header className="flex justify-between p-4 border-b">
        <p>Welcome, {user.userName}!</p>
        <SignOutButton />
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}

