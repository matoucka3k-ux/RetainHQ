'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Mot de passe trop court (8 caractères min.)'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, company_name: form.company } }
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Compte créé ! Bienvenue.')
      router.push('/dashboard')
      router.refresh()
    }
  }

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0d1220', border: '1px solid #1e2d45', borderRadius: 8, padding: '11px 14px', fontSize: '0.9rem', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 60%)', position: 'fixed', inset: 0, pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>RetainHQ</Link>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: 8 }}>30 jours gratuits — aucune carte requise</p>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Prénom & Nom</label>
                <input type="text" value={form.name} onChange={update('name')} required placeholder="Marie Dupont" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nom de l'agence</label>
                <input type="text" value={form.company} onChange={update('company')} required placeholder="Agence Nova" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email professionnel</label>
              <input type="email" value={form.email} onChange={update('email')} required placeholder="vous@agence.fr" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" value={form.password} onChange={update('password')} required placeholder="8 caractères minimum" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#1e2d45' : 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', border: 'none', borderRadius: 9, padding: '13px', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, boxShadow: loading ? 'none' : '0 0 20px rgba(59,130,246,0.3)', fontFamily: 'inherit' }}>
              {loading ? 'Création...' : 'Créer mon compte →'}
            </button>
            <p style={{ fontSize: '0.72rem', color: '#475569', textAlign: 'center', margin: 0 }}>
              En créant un compte, vous acceptez nos{' '}
              <Link href="/legal/cgv" style={{ color: '#60a5fa' }}>CGV</Link> et notre{' '}
              <Link href="/legal/mentions" style={{ color: '#60a5fa' }}>politique de confidentialité</Link>.
            </p>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.82rem', marginTop: 20 }}>
          Déjà un compte ?{' '}
          <Link href="/auth/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
