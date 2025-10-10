//this is th raper of the next in ssg
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SignOutButton from "@/components/auth/SignOutButton";

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
        const response = await axios.get<User>(
          "http://localhost:8080/api/v0/user/me",
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


// async function getUser(){
//     const token= (await cookies()).get("token")?.value;
//     if(!token) return null;

//     const response= await axios.get<User>("http://localhost:8080/api/v0/user/me",{
//         headers:{
//             Cookie: `token=${token}`
//         },
//         cache: 'no-store'
//     });
//     if(!response) return null;
//     const user: User= await response.json();
//     return user;
// }