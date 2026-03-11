'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 60%)', position: 'fixed', inset: 0, pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>RetainHQ</Link>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: 8 }}>Content de vous revoir</p>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="vous@agence.fr"
                style={{ width: '100%', background: '#0d1220', border: '1px solid #1e2d45', borderRadius: 8, padding: '11px 14px', fontSize: '0.9rem', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{ width: '100%', background: '#0d1220', border: '1px solid #1e2d45', borderRadius: 8, padding: '11px 14px', fontSize: '0.9rem', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#1e2d45' : 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', border: 'none', borderRadius: 9, padding: '13px', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, boxShadow: loading ? 'none' : '0 0 20px rgba(59,130,246,0.3)', fontFamily: 'inherit' }}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.82rem', marginTop: 20 }}>
          Pas encore de compte ?{' '}
          <Link href="/auth/signup" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
