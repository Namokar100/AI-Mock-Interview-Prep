import { isAuthenticated } from '@/lib/actions/auth.action';
import React from 'react'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation';

const AuthLayout = async ({children}: {children: React.ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();

  if(isUserAuthenticated) {
    redirect('/');
  }

  return (
    <div className='auth-layout'>
        {children}
    </div>
  )
}

export default AuthLayout