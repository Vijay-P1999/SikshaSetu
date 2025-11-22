"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GraduationCap, Users, BookOpen, Loader2 } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const { user, login, loading } = useAuth();
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const [savingRole, setSavingRole] = useState(false);
    const [checkedRole, setCheckedRole] = useState(false);

    const redirectToRoleDashboard = useCallback((role) => {
        switch (role) {
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
    }, [router]);

    useEffect(() => {
        const checkUserRole = async () => {
            if (user && !loading && !checkedRole) {
                setCheckedRole(true);
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));

                    if (userDoc.exists() && userDoc.data().role) {
                        redirectToRoleDashboard(userDoc.data().role);
                    } else {
                        setShowRoleSelection(true);
                    }
                } catch (error) {
                    console.error("Error checking user role:", error);
                    setShowRoleSelection(true);
                }
            }
        };

        checkUserRole();
    }, [user, loading, checkedRole, redirectToRoleDashboard]);

    const handleSignIn = async () => {
        setSigningIn(true);
        setCheckedRole(false);
        try {
            await login();
        } catch (error) {
            console.error("Sign in failed:", error);
            setSigningIn(false);
            setCheckedRole(false);
        }
    };

    const handleRoleSelection = async (role) => {
        if (!user) return;

        setSavingRole(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: role,
                createdAt: new Date().toISOString()
            });

            if (role === 'student') {
                router.push('/student/onboarding');
            } else {
                redirectToRoleDashboard(role);
            }
        } catch (error) {
            console.error("Error saving role:", error);
            setSavingRole(false);
        }
    };

    if (loading || signingIn) {
        return (
            <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="animate-spin" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {signingIn ? 'Signing you in...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (showRoleSelection && user) {
        return (
            <div className="container flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
                <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        overflow: 'hidden'
                    }}>
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>
                                {user.displayName?.[0] || 'U'}
                            </span>
                        )}
                    </div>

                    <h1 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                        Welcome, {user.displayName || 'User'}!
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        Choose your role to continue
                    </p>

                    {savingRole ? (
                        <div className="text-center">
                            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--text-secondary)' }}>Setting up your account...</p>
                        </div>
                    ) : (
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                            <button
                                onClick={() => handleRoleSelection('student')}
                                className="card"
                                style={{
                                    padding: '2rem 1rem',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center'
                                }}
                            >
                                <GraduationCap size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Student</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Learn and grow
                                </p>
                            </button>

                            <button
                                onClick={() => handleRoleSelection('teacher')}
                                className="card"
                                style={{
                                    padding: '2rem 1rem',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center'
                                }}
                            >
                                <BookOpen size={48} style={{ color: 'var(--secondary)', margin: '0 auto 1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Teacher</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Guide students
                                </p>
                            </button>

                            <button
                                onClick={() => handleRoleSelection('parent')}
                                className="card"
                                style={{
                                    padding: '2rem 1rem',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center'
                                }}
                            >
                                <Users size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Parent</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Track progress
                                </p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
            <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    Welcome to SikshaSetu
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    AI-powered learning platform for foundational education
                </p>

                <div className="card" style={{ padding: '3rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎓</div>
                    <h2 style={{ marginBottom: '1rem' }}>Get Started</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Sign in with your Google account to access personalized learning
                    </p>
                    <button
                        onClick={handleSignIn}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
