"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '../../utils/supabaseClient'
import { useRouter } from 'next/navigation'

const page = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function signUpWithEmail() {
        try {
            if(email && password) {
                const resp = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                if(resp.error) throw resp.error
                const userId = resp.data.user?.id;
                console.log("userId: ", userId);
                console.log("email", email);

                if(userId) {

                    await createUser(userId);
                }
                router.push('/')
            }
  
        } catch (error) {
            console.log("error: ", error);
        }
    }

    async function createUser(userId) { 
        try { 
            const { error } = await supabase
                    .from("users")
                    .insert({ id: userId })

            if(error) throw error
        } catch (error) {
            console.log("error")
        }
    }
    


  return (
    <div className="w-screen flex">
        <div className="justify-center w-full h-screen items-center flex">
            <div className="bg-white/25 px-12 rounded-md">
                <h1 className="mt-10 justify-center w-full pl-32 text-2xl text-white font-light  ">Sign up</h1> 

                <form >
                    <input 
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Email"
                        className="block w-80 pl-3 rounded-md mt-9 shadow text-lg py-1 border outline-none border-gray-300 "
                    />

                    <input 
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Password"
                        className="block w-80 pl-3 rounded-md shadow mt-2 text-lg py-1 border outline-none border-gray-300 "
                    />

                    <button
                        type="button"
                        onClick={signUpWithEmail} 
                        className="bg-black w-full py-2 rounded-md mt-5 text-gray-300">
                            Create Account
                    </button>

                    <p className="mt-3 mb-16 w-full justify-center text-gray-400 items-center flex">Have an account?<Link href="/login"><span className="underline underline-offset-4 decoration-gray-200 ml-1 text-black">Log in </span></Link> </p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default page