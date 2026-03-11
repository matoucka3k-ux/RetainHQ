'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { formatDate, getScoreLabel } from '@/lib/utils'
import Papa from 'papaparse'

type Client = { id: string; name: string; email: string; company?: string; contract_value?: number; active: boolean; created_at: string; surveys?: any[] }
type Props = { clients: Client[]; userId: string; plan: string }

export default function ClientsClient({ clients: initial, userId, plan }: Props) {
  const supabase = createClient()
  const [clients, setClients] = useState<Client[]>(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', contract_value: '' })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const maxClients = plan === 'pro' ? Infinity : plan === 'starter' ? 25 : 5
  const canAdd = clients.filter(c => c.active).length < maxClients

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAdd) { toast.error(`Limite atteinte. Passez en Pro pour ajouter plus de clients.`); return }
    setLoading(true)
    const { data, error } = await supabase.from('clients').insert({
      user_id: userId,
      name: form.name,
      email: form.email,
      company: form.company || null,
      contract_value: form.contract_value ? parseFloat(form.contract_value) : 0,
    }).select().single()
    if (error) { toast.error('Erreur lors de l\'ajout'); setLoading(false); return }
    setClients(c => [data, ...c])
    setForm({ name: '', email: '', company: '', contract_value: '' })
    setShowAdd(false)
    setLoading(false)
    toast.success('Client ajouté ✓')
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('clients').update({ active: !active }).eq('id', id)
    setClients(c => c.map(cl => cl.id === id ? { ...cl, active: !active } : cl))
    toast.success(active ? 'Client désactivé' : 'Client réactivé')
  }

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const rows = results.data as any[]
        let added = 0
        for (const row of rows) {
          if (!row.email || !row.name) continue
          if (!canAdd) break
          const { data } = await supabase.from('clients').insert({ user_id: userId, name: row.name, email: row.email, company: row.company || null, contract_value: row.contract_value ? parseFloat(row.contract_value) : 0 }).select().single()
          if (data) { setClients(c => [data, ...c]); added++ }
        }
        toast.success(`${added} client${added > 1 ? 's' : ''} importé${added > 1 ? 's' : ''} ✓`)
      }
    })
  }

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || (c.company || '').toLowerCase().includes(search.toLowerCase()))

  const avgScore = (c: Client) => {
    const answered = (c.surveys || []).filter(s => s.score !== null)
    if (!answered.length) return null
    return (answered.reduce((a: number, s: any) => a + s.score, 0) / answered.length).toFixed(1)
  }

  const inputStyle: React.CSSProperties = { background: '#0d1220', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px', fontSize: '0.875rem', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Clients</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>{clients.filter(c => c.active).length} actif{clients.filter(c => c.active).length > 1 ? 's' : ''} {plan !== 'pro' ? `/ ${maxClients} max` : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'transparent', border: '1px solid #1e2d45', color: '#94a3b8', borderRadius: 8, padding: '9px 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            ↑ Importer CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} style={{ display: 'none' }} />
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 16px rgba(59,130,246,0.25)' }}>
            + Ajouter un client
          </button>
        </div>
      </div>

      {/* CSV hint */}
      <div style={{ background: '#0d1220', border: '1px dashed #1e2d45', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: '0.75rem', color: '#374151' }}>
        Format CSV attendu : <code style={{ color: '#60a5fa' }}>name, email, company, contract_value</code>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Nouveau client</p>
          <form onSubmit={addClient} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div><label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Nom *</label><input style={inputStyle} value={form.name} onChange={update('name')} required placeholder="Jean Dupont" /></div>
            <div><label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Email *</label><input style={inputStyle} type="email" value={form.email} onChange={update('email')} required placeholder="jean@client.fr" /></div>
            <div><label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Société</label><input style={inputStyle} value={form.company} onChange={update('company')} placeholder="ACME Corp" /></div>
            <div><label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Valeur contrat (€)</label><input style={inputStyle} type="number" value={form.contract_value} onChange={update('contract_value')} placeholder="1200" /></div>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
              {loading ? '...' : 'Ajouter'}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..." style={{ ...inputStyle, marginBottom: 16, maxWidth: 340 }} />

      {/* Table */}
      <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e2d45', background: '#0d1220' }}>
              {['Client', 'Email', 'Société', 'Contrat', 'Score moyen', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#374151', fontSize: '0.875rem' }}>Aucun client trouvé</td></tr>
            ) : filtered.map(c => {
              const score = avgScore(c)
              const scoreColor = score ? (parseFloat(score) >= 4 ? '#4ade80' : parseFloat(score) >= 3 ? '#fbbf24' : '#f87171') : '#374151'
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #111827', opacity: c.active ? 1 : 0.45 }}>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{c.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#64748b' }}>{c.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#64748b' }}>{c.company || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#94a3b8' }}>{c.contract_value ? `${c.contract_value.toLocaleString('fr-FR')} €` : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {score ? <span style={{ color: scoreColor, fontWeight: 700, fontSize: '0.875rem' }}>{score}/5</span> : <span style={{ color: '#374151', fontSize: '0.78rem' }}>Pas encore</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, background: c.active ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: c.active ? '#10b981' : '#64748b', border: `1px solid ${c.active ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.15)'}` }}>
                      {c.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => toggleActive(c.id, c.active)} style={{ background: 'transparent', border: '1px solid #1e2d45', color: '#64748b', borderRadius: 6, padding: '5px 12px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {c.active ? 'Désactiver' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
