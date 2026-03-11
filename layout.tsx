import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendSurveyEmail } from '@/lib/resend'

// Appelé par Vercel Cron ou Trigger.dev chaque jour
// Vercel cron config dans vercel.json :
// "crons": [{"path": "/api/surveys/auto-send", "schedule": "0 9 * * *"}]

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()

  // Trouver les campagnes actives dont la date d'envoi est dépassée
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, profiles(email, company_name, full_name)')
    .eq('active', true)
    .lte('next_send_at', now)

  if (!campaigns || campaigns.length === 0) return NextResponse.json({ sent: 0 })

  let totalSent = 0

  for (const campaign of campaigns) {
    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', campaign.user_id)
      .eq('active', true)

    if (!clients || clients.length === 0) continue

    const profile = campaign.profiles as any

    for (const client of clients) {
      const { data: survey } = await supabase.from('surveys').insert({
        campaign_id: campaign.id,
        client_id: client.id,
        user_id: campaign.user_id,
      }).select().single()

      if (!survey) continue

      try {
        await sendSurveyEmail({
          to: client.email,
          clientName: client.name,
          companyName: profile?.company_name || profile?.full_name || 'Votre prestataire',
          surveyToken: survey.token,
          customMessage: campaign.message || undefined,
        })
        totalSent++
      } catch (err) {
        console.error('Auto-send email error:', err)
      }
    }

    const frequencyMs = campaign.frequency === 'weekly' ? 7 : campaign.frequency === 'quarterly' ? 90 : 30
    const nextSend = new Date(Date.now() + frequencyMs * 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('campaigns').update({
      last_sent_at: now,
      next_send_at: nextSend,
    }).eq('id', campaign.id)
  }

  return NextResponse.json({ sent: totalSent, campaigns: campaigns.length })
}
