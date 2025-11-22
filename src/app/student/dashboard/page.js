import ChatBot from '@/components/ChatBot';

export default function StudentDashboard() {
    return (
        <div className="container mt-lg">
            <header className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>Welcome back, Student!</h1>
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
                <h2 style={{ marginBottom: '1rem' }}>Your Learning Path</h2>
                <div className="flex flex-col gap-md">
                    {/* Mock Modules */}
                    <div className="card flex items-center justify-between">
                        <div className="flex items-center gap-md">
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>1</div>
                            <div>
                                <h3>Basic Numeracy: Addition</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Master adding two-digit numbers</p>
                            </div>
                        </div>
                        <button className="btn btn-primary">Continue</button>
                    </div>

                    <div className="card flex items-center justify-between" style={{ opacity: 0.7 }}>
                        <div className="flex items-center gap-md">
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>2</div>
                            <div>
                                <h3>Basic Numeracy: Subtraction</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Locked • Complete previous module</p>
                            </div>
                        </div>
                        <button className="btn btn-secondary" disabled style={{ cursor: 'not-allowed', opacity: 0.5 }}>Locked</button>
                    </div>
                </div>
            </section>
            <ChatBot />
        </div>
    );
}
