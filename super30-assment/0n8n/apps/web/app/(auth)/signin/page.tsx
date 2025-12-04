// 'use client'
// import React, { useState } from 'react'
// import {useRouter} from 'next/navigation'
// import api from '@lib/api'

// const LoginPage = () => {
//   const router= useRouter()

//   const [email, setEmail]=useState('')
//   const [password, setPassword]=useState('')

//   type Event= React.FormEvent<HTMLFormElement>
//   const handelFormSubmit= async (e:Event)=>{
//       e.preventDefault();
//       const res= await api.post("/user/signin",{email:email, password: password})
//       setEmail('')
//       setPassword('')
//       if (res.status === 201) {
//         router.push('/home');
//       } else {
//         console.log("Login failed:", res.data);
//       }
//   }
//   return (
//     <div>
//       <form onSubmit={handelFormSubmit}>
//         <label htmlFor="email">Email</label>
//         <input type="text" placeholder='sanjna@gmail.com' id='email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
//         <label htmlFor="email">password</label>
//         <input type="text" placeholder='sanjna@gmail.com' id='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
//         <button type='submit'>submit</button>
//       </form>
//     </div>
//   )
// }

// export default LoginPage


'use client';

import { AuthForm } from '@components/auth/AuthForm';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export default function SignInPage() {
  const router = useRouter();
    const { setUser } = useAuthStore(); 

    interface SignInResponse {
      user: {
        id: string;
        name: string;
        email: string;
      };
      message: string;
    }
 const handleSignIn = async (values:any) => {
    try {
      const response = await axios.post<SignInResponse>(
        "http://localhost:8080/api/v0/user/signin",values,
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

      setUser(data.user); 
      toast.success("LoggedIn succesfully");
      router.push('/dashboard'); // Redirect to the protected dashboard
    } catch (error:any) {
      toast.error(error.message);
    }
  };

  return <AuthForm isSignUp={false} onSubmit={handleSignIn} />;
}