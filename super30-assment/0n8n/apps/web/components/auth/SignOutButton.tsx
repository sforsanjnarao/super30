"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await axios.post("http://localhost:YOUR_BACKEND_PORT/api/auth/signout", {
    });

    if (response.status==200) {
      router.push("/signin");
      router.refresh(); 
    } else {
      alert("Sign out failed.");
    }
  };

  return <Button onClick={handleSignOut} variant="outline">Sign Out</Button>;
}