"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function TelegramCredentialForm() {
    const [name,setName]=useState('')
    const [token, setToken]=useState('')
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data={
            name:name,
            data:token,
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
          placeholder="e.g., My Telegram Bot"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="botToken">Bot Token</Label>
        <Input type="password" id="botToken" placeholder="Enter your bot token" 
        value={token}
        onChange={(e)=>setToken(e.target.value)}
        />
      </div>
      <Button type="submit">Save Credential</Button>
    </form>
  );
}