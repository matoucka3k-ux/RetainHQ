import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendAlertEmail } from '@/lib/resend'

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const supabase = createAdminClient()
  const { data: survey, error } = await supabase
    .from('surveys')
    .select('*, clients(name, email), profiles(full_name, company_name, email)')
    .eq('token', params.token)
    .single()

  if (error || !survey) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    status: survey.status,
    company_name: (survey.profiles as any)?.company_name || (survey.profiles as any)?.full_name,
    client_name: (survey.clients as any)?.name,
  })
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const supabase = createAdminClient()
  const { score, comment } = await req.json()

  if (!score || score < 1 || score > 5) return NextResponse.json({ error: 'Invalid score' }, { status: 400 })

  const { data: survey, error } = await supabase
    .from('surveys')
    .select('*, clients(name, email), profiles(email, company_name)')
    .eq('token', params.token)
    .single()

  if (error || !survey) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (survey.status === 'responded') return NextResponse.json({ error: 'Already responded' }, { status: 409 })

  await supabase.from('surveys').update({
    score,
    comment: comment || null,
    status: 'responded',
    responded_at: new Date().toISOString(),
  }).eq('token', params.token)

  // Create alert if score <= 2
  if (score <= 2) {
    await supabase.from('alerts').insert({
      user_id: survey.user_id,
      survey_id: survey.id,
      client_id: survey.client_id,
      score,
    })

    const profileEmail = (survey.profiles as any)?.email
    const clientName = (survey.clients as any)?.name
    const clientEmail = (survey.clients as any)?.email

    if (profileEmail && clientName) {
      await sendAlertEmail({ to: profileEmail, clientName, clientEmail, score, comment }).catch(console.error)
    }
  }

  return NextResponse.json({ ok: true })
}
