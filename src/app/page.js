import Link from 'next/link';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>
          SikshaSetu
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          AI-powered learning platform for foundational education in Indian government schools
        </p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
          <Link href="/signin" className="card" style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <GraduationCap size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h3>Student</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Start your learning journey
            </p>
          </Link>

          <Link href="/signin" className="card" style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <BookOpen size={48} style={{ color: 'var(--secondary)', margin: '0 auto 1rem' }} />
            <h3>Teacher</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Monitor student progress
            </p>
          </Link>

          <Link href="/signin" className="card" style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Users size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
            <h3>Parent</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Track your child's growth
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
