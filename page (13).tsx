import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as any
      const supabaseId = sub.metadata?.supabase_id
      if (!supabaseId) break
      const plan = sub.metadata?.plan || 'starter'
      await supabase.from('profiles').update({
        plan,
        stripe_subscription_id: sub.id,
        subscription_status: sub.status,
      }).eq('id', supabaseId)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      const supabaseId = sub.metadata?.supabase_id
      if (!supabaseId) break
      await supabase.from('profiles').update({ plan: 'free', subscription_status: 'inactive' }).eq('id', supabaseId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
