'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDate, getScoreBg, getScoreLabel } from '@/lib/utils'
import Link from 'next/link'

type Props = { profile: any; clients: any[]; surveys: any[]; alerts: any[] }

export default function DashboardClient({ profile, clients, surveys, alerts }: Props) {
  const responded = surveys.filter(s => s.score !== null)
  const avgScore = responded.length ? (responded.reduce((a, s) => a + s.score, 0) / responded.length).toFixed(1) : '–'
  const atRisk = responded.filter(s => s.score <= 2).length
  const responseRate = surveys.length ? Math.round((responded.length / surveys.length) * 100) : 0

  // Chart data — last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleString('fr-FR', { month: 'short' })
    const monthSurveys = responded.filter(s => {
      const sd = new Date(s.responded_at || s.sent_at)
      return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear()
    })
    const avg = monthSurveys.length ? +(monthSurveys.reduce((a, s) => a + s.score, 0) / monthSurveys.length).toFixed(1) : null
    return { month, avg }
  })

  const statBox = (label: string, value: string | number, sub?: string, color?: string) => (
    <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 14, padding: '24px 24px 20px' }}>
      <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>{label}</p>
      <p style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', color: color || '#fff', margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>{sub}</p>}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Bonjour{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Voici l'état de satisfaction de vos clients.</p>
        </div>
        <Link href="/campaigns" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 0 16px rgba(59,130,246,0.3)' }}>
          + Nouvelle campagne
        </Link>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '0.875rem', color: '#f87171' }}>🔴 {alerts.length} alerte{alerts.length > 1 ? 's' : ''} à traiter</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.slice(0, 3).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: '#94a3b8' }}>
                <span style={{ background: '#ef4444', color: '#fff', borderRadius: 5, padding: '2px 7px', fontWeight: 700, fontSize: '0.75rem' }}>{a.score}/5</span>
                <span><strong style={{ color: '#e2e8f0' }}>{a.clients?.name}</strong> vient de répondre à votre sondage</span>
                <span style={{ color: '#374151', fontSize: '0.72rem' }}>{formatDate(a.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {statBox('Score moyen', avgScore + (avgScore !== '–' ? '/5' : ''), `Sur ${responded.length} réponse${responded.length > 1 ? 's' : ''}`)}
        {statBox('Clients actifs', clients.length, profile?.plan === 'starter' ? `/ 25 max` : 'Illimité')}
        {statBox('Taux de réponse', responseRate + '%', `${responded.length} / ${surveys.length} sondages`)}
        {statBox('À risque', atRisk, 'Score ≤ 2/5', atRisk > 0 ? '#f87171' : '#10b981')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Chart */}
        <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 14, padding: 24 }}>
          <p style={{ margin: '0 0 20px', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>Score moyen — 6 derniers mois</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" stroke="#374151" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} stroke="#374151" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 8, fontSize: '0.82rem' }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#60a5fa' }} />
              <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution */}
        <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 14, padding: 24 }}>
          <p style={{ margin: '0 0 20px', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>Distribution des scores</p>
          {[5, 4, 3, 2, 1].map(score => {
            const count = responded.filter(s => s.score === score).length
            const pct = responded.length ? Math.round((count / responded.length) * 100) : 0
            const colors: Record<number, string> = { 5: '#10b981', 4: '#34d399', 3: '#fbbf24', 2: '#f87171', 1: '#ef4444' }
            return (
              <div key={score} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 16, fontSize: '0.75rem', color: '#475569', textAlign: 'right' }}>{score}</span>
                <div style={{ flex: 1, height: 8, background: '#1e2d45', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: colors[score], borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
                <span style={{ width: 28, fontSize: '0.72rem', color: '#475569', textAlign: 'right' }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent responses */}
      <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 14, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>Dernières réponses</p>
          <Link href="/clients" style={{ fontSize: '0.78rem', color: '#60a5fa', textDecoration: 'none' }}>Voir tous les clients →</Link>
        </div>
        {responded.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#374151' }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Aucune réponse pour l'instant.</p>
            <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#253550' }}>Créez une campagne et envoyez votre premier sondage.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                {['Client', 'Score', 'Commentaire', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0 0 12px', fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responded.slice(0, 8).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #111827' }}>
                  <td style={{ padding: '12px 0', fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>{s.clients?.name || '—'}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ ...Object.fromEntries(getScoreBg(s.score).split(' ').map(c => [c, ''])), display: 'inline-block', padding: '3px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700 } as any}>
                      <span style={{ color: s.score >= 4 ? '#4ade80' : s.score >= 3 ? '#fbbf24' : '#f87171' }}>{s.score}/5 — {getScoreLabel(s.score)}</span>
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', fontSize: '0.82rem', color: '#64748b', maxWidth: 280 }}>{s.comment ? `"${s.comment.slice(0, 80)}${s.comment.length > 80 ? '…' : ''}"` : <span style={{ color: '#253550' }}>—</span>}</td>
                  <td style={{ padding: '12px 0', fontSize: '0.78rem', color: '#475569', whiteSpace: 'nowrap' }}>{formatDate(s.responded_at || s.sent_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
