"use client";
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container flex items-center justify-between" style={{ height: '70px' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                    SikshaSetu
                </Link>

                <div className="flex items-center gap-md">
                    <button onClick={toggleTheme} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
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
                                    <span>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</span>
                                )}
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                {user.displayName || user.email?.split('@')[0] || 'User'}
                            </span>
                            <button onClick={logout} className="btn btn-ghost" style={{ padding: '0.5rem' }} title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => router.push('/signin')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
