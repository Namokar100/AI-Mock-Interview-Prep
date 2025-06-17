'use server'

import { db, auth as adminAuth } from "@/firebase/admin";
import { auth } from "@/firebase/client";
import { cookies } from "next/headers";
import { sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";


const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists'
            };
        }

        await db.collection('users').doc(uid).set({
           name, email
        }); 

        return {
            success: true,
            message: 'User created successfully'
        }
        
    }catch(e: any) {
        
        console.log( 'Error creating user', e );

        if(e.code === 'auth/email-already-exists') {
            return { 
                success: false,
                message: 'Email already exists'
             };
        }

        return { 
            success: false,
            message: 'Error creating user'
         };
    }

}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await adminAuth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist, Create an account'
            }
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Signed in successfully'
        }
    } catch (e: any) {
        console.log('Error signing in', e);

        return {
            success: false,
            message: 'Failed to sign in'
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;
    } catch (e: any) {
        console.log('Error getting current user', e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

export async function signOut() {
    const cookieStore = await cookies();
    
    // Clear the session cookie
    cookieStore.delete('session');
    
    return {
        success: true,
        message: 'Signed out successfully'
    };
}

export async function sendPasswordResetEmail(email: string) {
    try {
        // First check if user exists in our database
        const userRecord = await adminAuth.getUserByEmail(email);
        
        if (!userRecord) {
            return {
                success: false,
                message: 'No account found with this email address'
            };
        }

        // If user exists, send password reset email
        await firebaseSendPasswordResetEmail(auth, email);
        
        return {
            success: true,
            message: 'Password reset email sent successfully'
        };
    } catch (e: any) {
        console.log('Error sending password reset email:', e);
        
        if (e.code === 'auth/user-not-found') {
            return {
                success: false,
                message: 'No account found with this email address'
            };
        }
        
        return {
            success: false,
            message: 'Failed to send password reset email'
        };
    }
}

