import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendSurveyEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { campaignId } = await req.json()

  const { data: campaign } = await admin
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .eq('user_id', user.id)
    .single()

  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single()
  const { data: clients } = await admin.from('clients').select('*').eq('user_id', user.id).eq('active', true)

  if (!clients || clients.length === 0) return NextResponse.json({ error: 'No active clients' }, { status: 400 })

  let sent = 0
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://retainhq.fr'

  for (const client of clients) {
    const { data: survey } = await admin.from('surveys').insert({
      campaign_id: campaign.id,
      client_id: client.id,
      user_id: user.id,
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
      sent++
    } catch (err) {
      console.error('Email send error:', err)
    }
  }

  await admin.from('campaigns').update({
    last_sent_at: new Date().toISOString(),
    next_send_at: new Date(Date.now() + getFrequencyMs(campaign.frequency)).toISOString(),
  }).eq('id', campaign.id)

  return NextResponse.json({ sent })
}

function getFrequencyMs(frequency: string) {
  switch (frequency) {
    case 'weekly': return 7 * 24 * 60 * 60 * 1000
    case 'quarterly': return 90 * 24 * 60 * 60 * 1000
    default: return 30 * 24 * 60 * 60 * 1000
  }
}
