'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

const SignupPage = () => {

    const router=useRouter()

  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')
  const [name, setName]=useState('')

  type Event= React.FormEvent<HTMLFormElement>
  const handelFormSubmit= async (e:Event)=>{
    e.preventDefault();
    const res=await axios.post("http://localhost:8080/api/v0/user/signup",{name:name,email:email, password: password},{
      withCredentials: true
    })
    setName('')
    setEmail('')
    setPassword('')
    if (res.status === 200) {
        router.push('/home');
      } else {
        console.log("Login failed:", res.data);
      }
  }
  return (
    <div>
      <form onSubmit={handelFormSubmit}>
      <label htmlFor="email">name</label>
      <input type="text" placeholder='sanjana' id='name' onChange={(e)=>setName(e.target.value)} value={name}/>
        <label htmlFor="email">Email</label>
        <input type="text" placeholder='sanjna@gmail.com' id='email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <label htmlFor="email">password</label>
        <input type="text" placeholder='sanjna@gmail.com' id='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        <button type='submit'>submit</button>
      </form>
    </div>
  )
}

export default SignupPage