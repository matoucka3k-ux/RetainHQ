'use client'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

export default function SurveyPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = params.token as string
  const preScore = searchParams.get('score')

  const [step, setStep] = useState<'loading' | 'rate' | 'comment' | 'done' | 'already' | 'error'>('loading')
  const [score, setScore] = useState<number | null>(preScore ? parseInt(preScore) : null)
  const [comment, setComment] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/surveys/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStep('error'); return }
        if (data.status === 'responded') { setStep('already'); return }
        setCompanyName(data.company_name || 'Votre prestataire')
        setStep(preScore ? 'comment' : 'rate')
        if (preScore) setScore(parseInt(preScore))
      })
      .catch(() => setStep('error'))
  }, [token, preScore])

  const submit = async () => {
    if (!score) return
    setSubmitting(true)
    const res = await fetch(`/api/surveys/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, comment }),
    })
    if (res.ok) setStep('done')
    else setStep('error')
    setSubmitting(false)
  }

  const stars = [1, 2, 3, 4, 5]
  const labels: Record<number, string> = { 1: 'Très insatisfait', 2: 'Insatisfait', 3: 'Neutre', 4: 'Satisfait', 5: 'Très satisfait' }
  const colors: Record<number, string> = { 1: '#ef4444', 2: '#f87171', 3: '#fbbf24', 4: '#34d399', 5: '#10b981' }

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      <div style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.1) 0%, transparent 60%)', position: 'fixed', inset: 0 }} />
      <div style={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>{companyName || 'RetainHQ'}</div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 20, padding: 40 }}>
          {step === 'loading' && <p style={{ textAlign: 'center', color: '#475569' }}>Chargement...</p>}

          {step === 'rate' && (
            <>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.03em', textAlign: 'center' }}>Comment se passe votre collaboration ?</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', margin: '0 0 36px' }}>Votre avis nous aide à mieux vous servir. 30 secondes maximum.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
                {stars.map(s => (
                  <button key={s} onClick={() => setScore(s)} style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${score === s ? colors[s] : '#1e2d45'}`, background: score === s ? `${colors[s]}18` : '#0d1220', cursor: 'pointer', fontSize: '1.5rem', transition: 'all 0.15s', transform: score === s ? 'scale(1.1)' : 'scale(1)' }}>
                    ⭐
                  </button>
                ))}
              </div>
              {score && (
                <p style={{ textAlign: 'center', color: colors[score], fontWeight: 700, fontSize: '0.9rem', margin: '0 0 24px' }}>
                  {labels[score]}
                </p>
              )}
              <button onClick={() => score && setStep('comment')} disabled={!score} style={{ width: '100%', background: score ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : '#1e2d45', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: '0.9rem', cursor: score ? 'pointer' : 'not-allowed', fontFamily: 'inherit', boxShadow: score ? '0 0 20px rgba(59,130,246,0.3)' : 'none' }}>
                Continuer →
              </button>
            </>
          )}

          {step === 'comment' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{'⭐'.repeat(score || 0)}</div>
                <p style={{ color: score ? colors[score] : '#94a3b8', fontWeight: 700, margin: 0 }}>{score ? labels[score] : ''}</p>
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Un mot à ajouter ? (facultatif)</h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 16px' }}>Qu'est-ce qui s'est bien passé, ou qu'est-ce que vous aimeriez qu'on améliore ?</p>
              <textarea
                value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Votre commentaire..."
                style={{ width: '100%', background: '#0d1220', border: '1px solid #1e2d45', borderRadius: 10, padding: '12px 14px', fontSize: '0.875rem', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', height: 100, resize: 'vertical', boxSizing: 'border-box', marginBottom: 20 } as any}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('rate')} style={{ background: 'transparent', border: '1px solid #1e2d45', color: '#64748b', borderRadius: 10, padding: '12px 20px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>← Retour</button>
                <button onClick={submit} disabled={submitting} style={{ flex: 1, background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                  {submitting ? 'Envoi...' : 'Envoyer mon avis →'}
                </button>
              </div>
            </>
          )}

          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🙏</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Merci pour votre retour !</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>Votre avis a bien été enregistré. Il va nous aider à améliorer notre collaboration.</p>
            </div>
          )}

          {step === 'already' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>Déjà répondu</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Vous avez déjà répondu à ce sondage. Merci !</p>
            </div>
          )}

          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔗</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Lien invalide ou expiré</h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>Ce lien de sondage n'est plus valide.</p>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#253550', marginTop: 20 }}>
          Propulsé par <span style={{ color: '#374151' }}>RetainHQ</span>
        </p>
      </div>
    </div>
  )
}
