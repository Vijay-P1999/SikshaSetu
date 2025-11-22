"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useRoleProtection(allowedRoles) {
    const router = useRouter();
    const { user, userData, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not signed in, redirect to sign-in page
                router.push('/signin');
                return;
            }

            if (!userData || !userData.role) {
                // Signed in but no role set, redirect to sign-in to select role
                router.push('/signin');
                return;
            }

            if (!allowedRoles.includes(userData.role)) {
                // User doesn't have permission for this page
                // Redirect to their appropriate dashboard
                switch (userData.role) {
                    case 'student':
                        router.push('/student/dashboard');
                        break;
                    case 'teacher':
                        router.push('/teacher/dashboard');
                        break;
                    case 'parent':
                        router.push('/parent/dashboard');
                        break;
                    default:
                        router.push('/');
                }
            }
        }
    }, [user, userData, loading, allowedRoles, router]);

    return { user, userData, loading };
}
