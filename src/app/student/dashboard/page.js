"use client";
import { useAuth } from '@/context/AuthContext';
import { useRoleProtection } from '@/hooks/useRoleProtection';
import { learningModules } from '@/data/modules';
import Link from 'next/link';
import ChatBot from '@/components/ChatBot';

export default function StudentDashboard() {
    const { userData } = useAuth();
    const { loading } = useRoleProtection(['student']);
    const grade = userData?.grade || '5';
    const modules = learningModules[grade] || [];

    if (loading) {
        return (
            <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="animate-spin" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-lg">
            <header className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>Welcome back, {userData?.name || 'Student'}!</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Ready to learn something new today?</p>
                </div>
                <div className="flex gap-md">
                    <div className="card flex items-center gap-sm" style={{ padding: '0.5rem 1rem' }}>
                        <span>🔥</span>
                        <strong>12 Day Streak</strong>
                    </div>
                    <div className="card flex items-center gap-sm" style={{ padding: '0.5rem 1rem' }}>
                        <span>⭐</span>
                        <strong>450 Points</strong>
                    </div>
                </div>
            </header>

            <section>
                <h2 style={{ marginBottom: '1rem' }}>Your Learning Path - Grade {grade}</h2>
                <div className="flex flex-col gap-md">
                    {modules.map((module, index) => (
                        <div key={module.id} className="card flex items-center justify-between">
                            <div className="flex items-center gap-md">
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.5rem'
                                }}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3>{module.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{module.subject} • {module.difficulty}</p>
                                </div>
                            </div>
                            <Link href={`/student/module?id=${module.id}`} className="btn btn-primary">
                                Start Learning
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
            <ChatBot />
        </div>
    );
}
