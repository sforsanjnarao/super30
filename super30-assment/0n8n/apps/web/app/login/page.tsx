"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/user/signin", form);
      const {token}=res.data
      Cookies.set("token", token);
      router.push("/workflow");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-3 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>
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
      <button className="bg-green-600 text-white p-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
