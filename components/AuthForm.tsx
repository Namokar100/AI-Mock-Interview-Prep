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
import { auth, googleProvider } from '@/firebase/client'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
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

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the user's ID token
    //   const idToken = await user.getIdToken();
      
      if (type === 'sign-up') {
        // For sign up, create the user in your database
        const results = await signUp({
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email!,
          password: '' // Password not needed for OAuth
        });
        
        if (!results?.success) {
          toast.error(results?.message);
          return;
        }
        
        toast.success("User created successfully");
      }
      
      // For both sign-up and sign-in, create a session
      const idToken = await user.getIdToken();
      const signInResult = await signIn({
        email: user.email!,
        idToken
      });
      
      if (!signInResult?.success) {
        toast.error(signInResult?.message);
        return;
      }
      
      toast.success("Signed in with Google successfully");
      router.push("/");
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error(`Google sign in failed: ${error}`);
    }
  };

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
                    <Button className='btn w-full' type="submit"> {isSignIn ? "Sign In" : "Create Account"}</Button>
                </form>
            </Form>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-center gap-2" 
              onClick={handleGoogleSignIn}
            >
              <Image src="/google.svg" alt="Google" width={16} height={16} />
              {isSignIn ? "Sign in with Google" : "Sign up with Google"}
            </Button>

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