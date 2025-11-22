"use client";
import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Award, Clock } from 'lucide-react';
import { useRoleProtection } from '@/hooks/useRoleProtection';

export default function TeacherDashboard() {
    const { loading } = useRoleProtection(['teacher']);
    const [selectedClass, setSelectedClass] = useState("Grade 5 - Section A");
    const [availableClasses] = useState([
        "Grade 5 - Section A",
        "Grade 5 - Section B",
        "Grade 6 - Section A",
        "Grade 4 - Section A"
    ]);

    const [classData] = useState({
        className: "Grade 5 - Section A",
        totalStudents: 28,
        averageScore: 72,
        studentsAtRisk: 5
    });

    const [students] = useState([
        {
            id: 1,
            name: "Aarav Kumar",
            grade: 5,
            currentLevel: "Intermediate",
            score: 85,
            pace: "Fast",
            paceRating: 4.5,
            lastActive: "2 hours ago",
            modulesCompleted: 12,
            trend: "up"
        },
        {
            id: 2,
            name: "Priya Sharma",
            grade: 5,
            currentLevel: "Advanced",
            score: 92,
            pace: "Fast",
            paceRating: 4.8,
            lastActive: "1 hour ago",
            modulesCompleted: 15,
            trend: "up"
        },
        {
            id: 3,
            name: "Rohan Patel",
            grade: 5,
            currentLevel: "Beginner",
            score: 58,
            pace: "Slow",
            paceRating: 2.3,
            lastActive: "1 day ago",
            modulesCompleted: 6,
            trend: "down"
        },
        {
            id: 4,
            name: "Ananya Singh",
            grade: 5,
            currentLevel: "Intermediate",
            score: 76,
            pace: "Moderate",
            paceRating: 3.5,
            lastActive: "5 hours ago",
            modulesCompleted: 10,
            trend: "stable"
        },
        {
            id: 5,
            name: "Arjun Reddy",
            grade: 5,
            currentLevel: "Advanced",
            score: 88,
            pace: "Fast",
            paceRating: 4.2,
            lastActive: "30 min ago",
            modulesCompleted: 14,
            trend: "up"
        },
        {
            id: 6,
            name: "Diya Gupta",
            grade: 5,
            currentLevel: "Beginner",
            score: 62,
            pace: "Slow",
            paceRating: 2.8,
            lastActive: "3 hours ago",
            modulesCompleted: 7,
            trend: "up"
        }
    ]);

    const getPaceColor = (pace) => {
        if (pace === "Fast") return "var(--success)";
        if (pace === "Slow") return "var(--error)";
        return "var(--warning)";
    };

    const getTrendIcon = (trend) => {
        if (trend === "up") return <TrendingUp size={18} style={{ color: 'var(--success)' }} />;
        if (trend === "down") return <TrendingDown size={18} style={{ color: 'var(--error)' }} />;
        return <Minus size={18} style={{ color: 'var(--text-secondary)' }} />;
    };

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
        <div className="container mt-lg" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Teacher Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{selectedClass}</p>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                            Select Class
                        </label>
                        <select
                            className="input"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            style={{ minWidth: '200px' }}
                        >
                            {availableClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <Users size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }} />
                    <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{classData.totalStudents}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Total Students</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <Award size={32} style={{ color: 'var(--secondary)', margin: '0 auto 0.5rem' }} />
                    <h3 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>{classData.averageScore}%</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Average Score</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <Clock size={32} style={{ color: 'var(--error)', margin: '0 auto 0.5rem' }} />
                    <h3 style={{ fontSize: '2rem', color: 'var(--error)' }}>{classData.studentsAtRisk}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Students At Risk</p>
                </div>
            </div>

            {/* Students Table */}
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    Student Progress Overview
                </h2>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Level</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Score</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Pace</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Rating</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Modules</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Trend</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: 'var(--primary-light)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>
                                                {student.name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{student.name}</div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Grade {student.grade}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: student.currentLevel === 'Advanced' ? 'var(--success)' : student.currentLevel === 'Intermediate' ? 'var(--warning)' : 'var(--error)',
                                            color: 'white',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>
                                            {student.currentLevel}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '1.1rem' }}>
                                        {student.score}%
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{ color: getPaceColor(student.pace), fontWeight: '600' }}>
                                            {student.pace}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                            <span style={{ fontWeight: '600' }}>{student.paceRating}</span>
                                            <span style={{ color: 'var(--secondary)' }}>★</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                        {student.modulesCompleted}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {getTrendIcon(student.trend)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {student.lastActive}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
