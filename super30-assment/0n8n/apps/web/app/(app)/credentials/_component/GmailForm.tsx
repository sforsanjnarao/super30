"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function GmailCredentialForm() {
    const [name, setName]=useState('')
    const [senderEmail, setSenderEmail]=useState('')
    const [password, setPassword]=useState('')


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data={
            name:name,
            data:{
                senderEmail: senderEmail,
                password: password
            },
            type:"Telegram"
        }
        axios.post("http://localhost:3000/credentials/",data)
        .then(()=>{
            console.log("credential stores successfully")
        }).catch((err)=>{console.error("Error:", err)})
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="credentialName">Credential Name</Label>
        <Input
          type="text"
          id="credentialName"
          placeholder="e.g., My Personal Gmail"
          value={name}
          onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Gmail Address</Label>
        <Input type="email" id="email" placeholder="example@gmail.com" 
        value={senderEmail}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSenderEmail(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="appPassword">App Password</Label>
        <Input type="password" id="appPassword" placeholder="••••••••••••••••"
        value={password}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Save Credential</Button>
    </form>
  );
}