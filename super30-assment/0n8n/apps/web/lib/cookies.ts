'use server';
import api from "@lib/api";
import { cookies } from "next/headers";

interface User {
    id: string;
    userName: string;
    email: string;
  }
export async function getUser(): Promise<User | null> {
    const cookieStore= await cookies()
    const token = cookieStore.get("token")?.value;
  
    console.log(token)
  
    
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


    // export async function userCheck(){
    //     const user=  getUser()
    //       if(!user) return redirect('/login')
    //         return user
    //   }
       