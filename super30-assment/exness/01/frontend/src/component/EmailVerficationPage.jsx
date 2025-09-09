import React, { useState } from 'react'

const EmailVerficationPage = () => {
    const [email, setEmail] = useState('')

    const handleSendLink=async()=>{
        try {
            const res=
        } catch (error) {
              console.error('Error:', error);            
        }
    }
  return (
    <div>
        <h1>Email Verification Page</h1>
        <label htmlFor='email'>Enter your email to get magic link</label>
        <input type='email' placeholder='Enter email here' value={email} onChange={()=>setEmail(e.target.value)}/>
        <button>send otp</button>

    </div>
  )
}

export default EmailVerficationPage