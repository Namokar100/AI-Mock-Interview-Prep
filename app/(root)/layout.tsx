import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

const RootLayout = async ({children}: {children: React.ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated) {
    redirect('/sign-in');
  }

  return (
    <div className='root-layout'>
        <nav className='flex justify-between items-center'>
            <Link href="/" className='flex items-center gap-2'>
                <Image src="/logo.svg" alt="logo" width={38} height={32} />
                <h2 className='text-primary-100'>AI Interview Prep</h2>
            </Link>
            <LogoutButton />
        </nav>
        
        {children}
    </div>
  )
}

export default RootLayout