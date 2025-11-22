import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <div className="hero flex flex-col items-center justify-center mt-lg gap-lg" style={{ minHeight: '80vh' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', textAlign: 'center' }}>
          SikshaSetu
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }} className="text-center">
          Bridging the gap in foundational learning. Personalized, AI-powered education for every student.
        </p>

        <div className="flex gap-lg justify-center flex-wrap" style={{ marginTop: '3rem', width: '100%' }}>
          <Link href="/student/onboarding" className="card flex flex-col items-center gap-md" style={{ textDecoration: 'none', width: '280px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '3rem' }}>🎓</div>
            <h2 style={{ color: 'var(--text-primary)' }}>Student</h2>
            <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Start your learning journey</p>
            <span className="btn btn-primary" style={{ width: '100%' }}>Get Started</span>
          </Link>

          <Link href="/teacher/dashboard" className="card flex flex-col items-center gap-md" style={{ textDecoration: 'none', width: '280px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '3rem' }}>👩‍🏫</div>
            <h2 style={{ color: 'var(--text-primary)' }}>Teacher</h2>
            <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Track class progress</p>
            <span className="btn btn-secondary" style={{ width: '100%' }}>Login</span>
          </Link>

          <Link href="/parent/dashboard" className="card flex flex-col items-center gap-md" style={{ textDecoration: 'none', width: '280px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '3rem' }}>👨‍👩‍👧</div>
            <h2 style={{ color: 'var(--text-primary)' }}>Parent</h2>
            <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Monitor your child</p>
            <span className="btn btn-primary" style={{ width: '100%', backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }}>Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
