'use client';

import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// This component will wrap our protected layout.
// It ensures that the user state is fetched and set before the children are rendered.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

   interface User {
      user: {
        id: string;
        name: string;
        email: string;
      };
      message: string;
    }
  useEffect(() => {
    const fetchUser = async () => {
      // If we already have a user and we're just navigating client-side, don't refetch.
      if (user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // The cookie is sent automatically by the browser.
         const response = await axios.post<User>(
        "http://localhost:8080/api/v0/user/me",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,      
        }
      );
      console.log(response)

      const data = response.data

        const userData = await data.user
        setUser(userData); // Populate the store with the user data.
      } catch (error) {
        // If the /api/me call fails, it means the cookie is invalid or expired.
        // Clear any lingering user data in the store.
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, user, pathname]); // Re-check on path change if needed, though often just once is enough.

  // While we're checking the session, we can show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* You can replace this with a nice shadcn/ui spinner later */}
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}