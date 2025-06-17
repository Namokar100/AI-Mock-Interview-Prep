"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import FormField from './FormField'
import { useRouter } from 'next/navigation'
import { sendPasswordResetEmail } from '@/lib/actions/auth.action'

const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

const ForgotPasswordForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        try {
            const result = await sendPasswordResetEmail(values.email);
            console.log(result)
            
            if (result.success) {
                toast.success(result.message);
                router.push("/sign-in");
            } else {
                toast.error(result.message);
            }
        } catch (e) {
            console.error(e);
            toast.error(`There was an error: ${e}`);
        }
    }

    return (
        <div className='card-border lg:min-w-[566px]'>
            <div className='flex flex-col gap-6 card py-14 px-10'>
                <div className='flex flex-row gap-2 justify-center'>
                    <Image src="/logo.svg" alt="logo" width={32} height={38} />
                    <h2 className='text-primary-100'>AI Mock Interview</h2>
                </div>

                <h3 className='text-center text-primary-100'>Reset Your Password</h3>
                <p className='text-center text-light-100'>Enter your email address and we'll send you a link to reset your password.</p>
            
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        <FormField 
                            name="email" 
                            control={form.control} 
                            label="Email" 
                            placeholder="Your email address" 
                            type="email" 
                        />
                        <Button className='btn w-full' type="submit">Send Reset Link</Button>
                    </form>
                </Form>

                <p className='text-center'>
                    Remember your password?
                    <Link href="/sign-in" className='font-bold text-user-primary ml-1'>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordForm 