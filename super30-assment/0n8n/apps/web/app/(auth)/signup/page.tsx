// 'use client'
// import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import api from '@lib/api'

// const SignupPage = () => {

//     const router=useRouter()

//   const [email, setEmail]=useState('')
//   const [password, setPassword]=useState('')
//   const [name, setName]=useState('')

//   type Event= React.FormEvent<HTMLFormElement>
//   const handelFormSubmit= async (e:Event)=>{
//     e.preventDefault();
//     const res=await api.post("/user/signup",{name:name,email:email, password: password},{
//       withCredentials: true
//     })
//     setName('')
//     setEmail('')
//     setPassword('')
//     if (res.status === 200) {
//         router.push('/home');
//       } else {
//         console.log("Login failed:", res.data);
//       }
//   }
//   return (
//     <div>
//       <form onSubmit={handelFormSubmit}>
//       <label htmlFor="email">name</label>
//       <input type="text" placeholder='your name' id='name' onChange={(e)=>setName(e.target.value)} value={name}/>
//         <label htmlFor="email">Email</label>
//         <input type="text" placeholder='sanjna@gmail.com' id='email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
//         <label htmlFor="email">password</label>
//         <input type="text" placeholder='sanjna@gmail.com' id='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
//         <button type='submit'>submit</button>
//       </form>
//     </div>
//   )
// }

// export default SignupPage









'use client';

import { AuthForm } from '@components/auth/AuthForm';
import { toast } from "sonner"; 
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios'; 

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore(); 

  interface SignUpResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
}
  const handleSignUp = async (values:any) => {
    try {
      const response = await axios.post<SignUpResponse>(
        "http://localhost:8080/api/v0/user/signup",values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,      
        }
      );
      console.log(response)

      const data = response.data

      console.log(data)

      // On success, update the global state with the user info
      setUser(data.user); 
      toast.success("Account created successfully!");
      router.push('/dashboard'); // Redirect to the protected dashboard
    } catch (error:any) {
      console.log(error)
      // toast.error(error.message);
    }
  };

  return <AuthForm isSignUp={true} onSubmit={handleSignUp} />;
}
