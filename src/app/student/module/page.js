"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { learningModules } from '@/data/modules';
import { generateModuleQuiz, reassessWithPeers } from '@/lib/gemini';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Volume2, VolumeX, CheckCircle, Loader2, BookOpen } from 'lucide-react';

export default function ModulePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, userData } = useAuth();

    const moduleId = searchParams.get('id');
    const grade = userData?.grade || '5';

    const [module, setModule] = useState(null);
    const [step, setStep] = useState('content'); // content, quiz, result
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (grade && learningModules[grade]) {
            const foundModule = learningModules[grade].find(m => m.id === moduleId);
            setModule(foundModule);
        }
    }, [moduleId, grade]);

    const speakContent = () => {
        if (!module) return;

        window.speechSynthesis.cancel();

        if (isSpeaking) {
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(module.content);
        utterance.lang = userData?.language === 'Hindi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleStartQuiz = async () => {
        setLoading(true);
        window.speechSynthesis.cancel();
        setIsSpeaking(false);

        const quiz = await generateModuleQuiz(module.content, grade, userData?.language || 'English');
        setQuizData(quiz);
        setStep('quiz');
        setLoading(false);
    };

    const handleSubmitQuiz = async () => {
        setLoading(true);

        // Calculate initial score
        let score = 0;
        quizData.questions.forEach(q => {
            if (q.type === 'multiple-choice' && answers[q.id] === q.correctAnswer) {
                score++;
            }
        });

        // Get classmates' data for peer comparison
        try {
            const q = query(
                collection(db, "users"),
                where("role", "==", "student"),
                where("grade", "==", grade)
            );
            const querySnapshot = await getDocs(q);
            const classmatesData = querySnapshot.docs.map(doc => ({
                score: doc.data().moduleScores?.[moduleId] || 0
            }));

            // Reassess with AI
            const reassessment = await reassessWithPeers(
                { score, answers, moduleId },
                classmatesData,
                moduleId
            );

            // Save to Firestore
            if (user) {
                await updateDoc(doc(db, "users", user.uid), {
                    [`moduleScores.${moduleId}`]: reassessment.reassessedScore,
                    completedModules: arrayUnion(moduleId)
                });
            }

            setResult(reassessment);
            setStep('result');
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }

        setLoading(false);
    };

    if (!module) {
        return (
            <div className="container mt-lg flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <p>Module not found</p>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ paddingBottom: '3rem' }}>
            {/* Content Step */}
            {step === 'content' && (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <div className="flex items-center gap-md">
                            <BookOpen size={32} style={{ color: 'var(--primary)' }} />
                            <div>
                                <h1 style={{ margin: 0, color: 'var(--primary)' }}>{module.title}</h1>
                                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{module.subject} • {module.difficulty}</p>
                            </div>
                        </div>
                        <button
                            onClick={speakContent}
                            className={`btn ${isSpeaking ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.75rem 1.25rem' }}
                        >
                            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            <span style={{ marginLeft: '0.5rem' }}>
                                {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                            </span>
                        </button>
                    </div>

                    <div style={{
                        fontSize: parseInt(grade) <= 2 ? '1.3rem' : '1.1rem',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        padding: '2rem',
                        backgroundColor: 'var(--surface-highlight)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        {module.content}
                    </div>

                    <button
                        onClick={handleStartQuiz}
                        className="btn btn-primary mt-lg"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Generating Quiz...' : 'Start Quiz'}
                    </button>
                </div>
            )}

            {/* Quiz Step */}
            {step === 'quiz' && quizData && (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        Module Quiz
                    </h2>

                    <div className="flex flex-col gap-lg">
                        {quizData.questions.map((q, idx) => (
                            <div key={q.id} className="card" style={{ backgroundColor: 'var(--surface-highlight)', padding: '1.5rem' }}>
                                <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '1rem' }}>
                                    {idx + 1}. {q.question}
                                </p>

                                {q.type === 'multiple-choice' && (
                                    <div className="grid" style={{ gridTemplateColumns: parseInt(grade) <= 2 ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
                                        {q.options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                                className={`btn ${answers[q.id] === opt ? 'btn-primary' : 'btn-secondary'}`}
                                                style={{
                                                    justifyContent: 'flex-start',
                                                    padding: '1rem',
                                                    fontSize: parseInt(grade) <= 2 ? '1.2rem' : '1rem'
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {(q.type === 'short-answer' || q.type === 'paragraph') && (
                                    <textarea
                                        className="input"
                                        value={answers[q.id] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                        placeholder="Type your answer here..."
                                        rows={q.type === 'paragraph' ? 6 : 3}
                                        style={{ width: '100%', resize: 'vertical' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmitQuiz}
                        className="btn btn-primary mt-lg"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        disabled={loading || Object.keys(answers).length < quizData.questions.length}
                    >
                        {loading ? 'Evaluating...' : 'Submit Quiz'}
                    </button>
                </div>
            )}

            {/* Result Step */}
            {step === 'result' && result && (
                <div className="card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                    <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
                    <h1>Quiz Complete!</h1>

                    <div style={{
                        backgroundColor: 'var(--surface-highlight)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        marginTop: '2rem'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your Score</p>
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', margin: '0.5rem 0' }}>
                            {result.reassessedScore}%
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            (AI-assessed based on peer comparison)
                        </p>
                    </div>

                    <div style={{ textAlign: 'left', marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>AI Assessment Report</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Justification</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>{result.justification}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Strengths</h4>
                            <ul style={{ paddingLeft: '1.5rem' }}>
                                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>Areas for Improvement</h4>
                            <ul style={{ paddingLeft: '1.5rem' }}>
                                {result.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Recommendations</h4>
                            <ul style={{ paddingLeft: '1.5rem' }}>
                                {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/student/dashboard')}
                        className="btn btn-primary mt-lg"
                        style={{ width: '100%' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
