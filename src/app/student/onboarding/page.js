"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateQuiz, evaluateQuiz } from '@/lib/gemini';
import { Brain, CheckCircle, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Onboarding() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        name: '',
        grade: '5',
        language: 'English',
        subject: 'Mathematics',
        parentEmail: ''
    });
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [currentSpeaking, setCurrentSpeaking] = useState(null);

    useEffect(() => {
        if (user && user.displayName) {
            setProfile(p => ({ ...p, name: user.displayName }));
        }
    }, [user]);

    // Auto-enable audio for grades 1-2
    useEffect(() => {
        if (step === 3 && parseInt(profile.grade) <= 2) {
            setAudioEnabled(true);
        }
    }, [step, profile.grade]);

    const speakText = (text, questionId) => {
        if (!audioEnabled) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = profile.language === 'Hindi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        utterance.onstart = () => setCurrentSpeaking(questionId);
        utterance.onend = () => setCurrentSpeaking(null);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setCurrentSpeaking(null);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setStep(2);
        const data = await generateQuiz(profile);
        setQuizData(data);
        setStep(3);
    };

    const handleQuizSubmit = async () => {
        stopSpeaking();
        setStep(2);
        const res = await evaluateQuiz(answers, quizData.questions);
        setResult(res);

        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    ...profile,
                    role: 'student',
                    initialAssessment: {
                        score: res.score,
                        level: res.level,
                        date: new Date().toISOString()
                    },
                    createdAt: new Date().toISOString()
                });
            } catch (error) {
                console.error("Error saving profile:", error);
            }
        }

        setStep(4);
    };

    return (
        <div className="container flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>

            {/* Step 1: Profile Setup */}
            {step === 1 && (
                <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                    <h1 className="text-center" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Let's get to know you!</h1>
                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-md">
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>My Name</label>
                            <input
                                type="text"
                                className="input"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                required
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>I am in Grade</label>
                            <select
                                className="input"
                                value={profile.grade}
                                onChange={e => setProfile({ ...profile, grade: e.target.value })}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(g => <option key={g} value={g}>Grade {g}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Preferred Language</label>
                            <select
                                className="input"
                                value={profile.language}
                                onChange={e => setProfile({ ...profile, language: e.target.value })}
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Parent's Email</label>
                            <input
                                type="email"
                                className="input"
                                value={profile.parentEmail}
                                onChange={e => setProfile({ ...profile, parentEmail: e.target.value })}
                                required
                                placeholder="parent@example.com"
                            />
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                Your parent can track your progress using this email
                            </p>
                        </div>

                        <button type="submit" className="btn btn-primary mt-lg">
                            Start Assessment
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: AI Processing */}
            {step === 2 && (
                <div className="flex flex-col items-center gap-lg">
                    <div className="relative">
                        <Brain size={80} className="text-primary animate-pulse" style={{ color: 'var(--primary)' }} />
                        <div style={{ position: 'absolute', top: -10, right: -10 }}>
                            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)' }} />
                        </div>
                    </div>
                    <h2 className="text-center">AI is analyzing your profile...</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Generating personalized questions just for you.</p>
                </div>
            )}

            {/* Step 3: Quiz */}
            {step === 3 && quizData && (
                <div className="card" style={{ maxWidth: '700px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: 0 }}>Quick Assessment</h2>
                        <button
                            onClick={() => {
                                setAudioEnabled(!audioEnabled);
                                if (audioEnabled) stopSpeaking();
                            }}
                            className={`btn ${audioEnabled ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            title={audioEnabled ? 'Disable audio' : 'Enable audio'}
                        >
                            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            <span style={{ marginLeft: '0.5rem' }}>
                                {audioEnabled ? 'Audio On' : 'Audio Off'}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-lg">
                        {quizData.questions.map((q, idx) => (
                            <div key={q.id} className="card" style={{ backgroundColor: 'var(--surface-highlight)', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <p style={{ fontWeight: '600', fontSize: '1.1rem', flex: 1 }}>
                                        {idx + 1}. {q.question}
                                    </p>
                                    {audioEnabled && (
                                        <button
                                            onClick={() => speakText(q.question, q.id)}
                                            className="btn btn-ghost"
                                            style={{ padding: '0.25rem', marginLeft: '0.5rem' }}
                                            title="Read question aloud"
                                        >
                                            {currentSpeaking === q.id ? (
                                                <Loader2 size={20} className="animate-spin" style={{ color: 'var(--primary)' }} />
                                            ) : (
                                                <Volume2 size={20} style={{ color: 'var(--primary)' }} />
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="grid" style={{ gridTemplateColumns: parseInt(profile.grade) <= 2 ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
                                    {q.options.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setAnswers({ ...answers, [q.id]: opt });
                                                if (audioEnabled && parseInt(profile.grade) <= 2) {
                                                    speakText(opt, `${q.id}-${opt}`);
                                                }
                                            }}
                                            className={`btn ${answers[q.id] === opt ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{
                                                justifyContent: 'flex-start',
                                                padding: '1rem',
                                                fontSize: parseInt(profile.grade) <= 2 ? '1.2rem' : '1rem'
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleQuizSubmit}
                        className="btn btn-primary mt-lg"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        disabled={Object.keys(answers).length < quizData.questions.length}
                    >
                        Submit Answers
                    </button>
                </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && result && (
                <div className="card flex flex-col items-center gap-md" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                    <CheckCircle size={64} style={{ color: 'var(--success)' }} />
                    <h1>Assessment Complete!</h1>

                    <div style={{
                        backgroundColor: 'var(--surface-highlight)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        marginTop: '1rem'
                    }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Your Initial Level</p>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{result.level}</h2>
                        <p>Score: {result.score}/{quizData.questions.length}</p>
                    </div>

                    <p style={{ color: 'var(--text-secondary)' }}>
                        We have customized your learning path based on these results.
                    </p>

                    <button onClick={() => router.push('/student/dashboard')} className="btn btn-primary mt-md" style={{ width: '100%' }}>
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
