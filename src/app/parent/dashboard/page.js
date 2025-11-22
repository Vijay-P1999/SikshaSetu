"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRoleProtection } from '@/hooks/useRoleProtection';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrendingUp, Award, BookOpen, Clock, Brain, Target } from 'lucide-react';

export default function ParentDashboard() {
    const { user } = useAuth();
    const { loading: roleLoading } = useRoleProtection(['parent']);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildren = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "student"),
                    where("parentEmail", "==", user.email)
                );

                const querySnapshot = await getDocs(q);
                const childrenData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setChildren(childrenData);
            } catch (error) {
                console.error("Error fetching children:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, [user]);

    const dummyChild = {
        name: "Sample Student",
        grade: 5,
        initialAssessment: {
            level: "Intermediate",
            score: 4,
            date: new Date().toISOString()
        },
        stats: {
            modulesCompleted: 8,
            currentStreak: 5,
            totalPoints: 320,
            averageScore: 78,
            timeSpent: "12h 30m",
            lastActive: "2 hours ago"
        },
        recentActivity: [
            { module: "Addition & Subtraction", score: 85, date: "2 days ago", status: "completed" },
            { module: "Reading Comprehension", score: 72, date: "3 days ago", status: "completed" },
            { module: "Shapes & Patterns", score: 90, date: "5 days ago", status: "completed" }
        ],
        upcomingModules: [
            { name: "Multiplication Basics", difficulty: "Medium" },
            { name: "Sentence Formation", difficulty: "Easy" }
        ]
    };

    const displayChildren = children.length > 0 ? children : [dummyChild];

    if (roleLoading || loading) {
        return (
            <div className="container mt-lg flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="animate-spin" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading your child's progress...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Parent Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Monitor your child's learning journey
                </p>
            </header>

            {displayChildren.map((child, index) => (
                <div key={child.id || index} style={{ marginBottom: '3rem' }}>
                    {/* Child Header */}
                    <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-md">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold'
                                }}>
                                    {child.name?.[0] || 'S'}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{child.name || 'Student Name'}</h2>
                                    <p style={{ margin: '0.25rem 0', opacity: 0.9 }}>Grade {child.grade || 5}</p>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        marginTop: '0.5rem'
                                    }}>
                                        {child.initialAssessment?.level || 'Intermediate'} Level
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Last Active</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{child.stats?.lastActive || '2 hours ago'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <BookOpen size={28} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }} />
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '0.5rem 0' }}>
                                {child.stats?.modulesCompleted || 8}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Modules Completed</p>
                        </div>

                        <div className="card" style={{ textAlign: 'center' }}>
                            <Award size={28} style={{ color: 'var(--secondary)', margin: '0 auto 0.5rem' }} />
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--secondary)', margin: '0.5rem 0' }}>
                                {child.stats?.averageScore || 78}%
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Score</p>
                        </div>

                        <div className="card" style={{ textAlign: 'center' }}>
                            <Target size={28} style={{ color: 'var(--success)', margin: '0 auto 0.5rem' }} />
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', margin: '0.5rem 0' }}>
                                {child.stats?.currentStreak || 5} Days
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current Streak</p>
                        </div>

                        <div className="card" style={{ textAlign: 'center' }}>
                            <Clock size={28} style={{ color: 'var(--accent)', margin: '0 auto 0.5rem' }} />
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', margin: '0.5rem 0' }}>
                                {child.stats?.timeSpent || '12h 30m'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Time Spent</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                            Recent Activity
                        </h2>
                        <div className="flex flex-col gap-md">
                            {(child.recentActivity || dummyChild.recentActivity).map((activity, idx) => (
                                <div key={idx} className="flex items-center justify-between" style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--surface-highlight)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div className="flex items-center gap-md">
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                            {activity.score}%
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{activity.module}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{activity.date}</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--success)',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}>
                                        ✓ Completed
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Modules */}
                    <div className="card">
                        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                            Upcoming Modules
                        </h2>
                        <div className="flex flex-col gap-md">
                            {(child.upcomingModules || dummyChild.upcomingModules).map((module, idx) => (
                                <div key={idx} className="flex items-center justify-between" style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--surface-highlight)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div className="flex items-center gap-md">
                                        <Brain size={24} style={{ color: 'var(--primary)' }} />
                                        <div style={{ fontWeight: '600' }}>{module.name}</div>
                                    </div>
                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: module.difficulty === 'Easy' ? 'var(--success)' : 'var(--warning)',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}>
                                        {module.difficulty}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {children.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                        No children linked to your account yet.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        When your child signs up, make sure they enter your email address (<strong>{user?.email}</strong>) as their parent's email.
                    </p>
                </div>
            )}
        </div>
    );
}
