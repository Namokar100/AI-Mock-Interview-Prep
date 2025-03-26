"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import FormField from './FormField'
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/client'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { signUp, signIn } from '@/lib/actions/auth.action'

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({ type } : {type: FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        if(type === 'sign-up'){

            const {name, email, password} = values;
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

            const results = await signUp({
                uid: userCredentials.user.uid,
                name: name!,
                email,
                password
            });

            if(!results?.success) {
                toast.error(results?.message);
                return;
            }
            
            toast.success("Signed up successfully");
            router.push("/sign-in");
        }else{

            const { email, password } = values;
            
            // Create userCredentials by signing in with Firebase first
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);

            const idToken = await userCredentials.user.getIdToken();

            if(!idToken) {
                toast.error("Sign in failed, Please try again");
                return;
            }

            const results = await signIn({
                email,
                idToken
            });
            
            if(!results?.success) {
                toast.error(results?.message);
                return;
            }

            toast.success("Signed in successfully");
            router.push("/");
        }
    }catch(e){
        console.log(e);
        toast.error(`There was an error: ${e}`);
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div className='card-border lg:min-w-[566px]'>
        <div className='flex flex-col gap-6 card py-14 px-10'>
            <div className='flex flex-row gap-2 justify-center'>
                <Image src="/logo.svg" alt="logo" width={32} height={38} />
                <h2 className='text-primary-100'>AI Mock Interview</h2>
            </div>

            <h3 className='text-center text-primary-100'>Practice job Inteviews with AI</h3>
        
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIn && (
                        <FormField 
                            name="name" 
                            control={form.control} 
                            label="Name" 
                            placeholder="Your name" 
                            type="text" 
                        />
                    )}
                    <FormField 
                        name="email" 
                        control={form.control} 
                        label="Email" 
                        placeholder="Your email address" 
                        type="email" 
                    />
                    <FormField 
                        name="password" 
                        control={form.control} 
                        label="Password" 
                        placeholder="Enter your password" 
                        type="password" 
                    />
                    <Button className='btn' type="submit"> {isSignIn ? "Sign In" : "Create Account"}</Button>
                </form>
            </Form>

            <p className='text-center'>
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className='font-bold text-user-primary ml-1'>
                    {isSignIn ? "Sign Up" : "Sign In"}
                </Link>
            </p>
        </div>
    </div>
  )
}

export default AuthForm