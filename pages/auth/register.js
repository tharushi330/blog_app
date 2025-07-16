import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Register(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleRegister = async (e) =>{
        e.preventDefault()
        const { user, error } = await supabase.auth.signUp({email, password})
        if (error) alert(error.message)
            else {
              alert("Check your email to confirm registration.")  
              router.push('/auth/login')
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
