"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await api.post("/user/signup", form);
      Cookies.set("token", res.data.token);
      router.push("/workflow");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-3 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Signup</h1>
      <input
        placeholder="Name"
        className="border p-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-blue-600 text-white p-2" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
}
