import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientsClient from './ClientsClient'

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: clients } = await supabase.from('clients').select('*, surveys(score,responded_at)').eq('user_id', user.id).order('created_at', { ascending: false })
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  return <ClientsClient clients={clients || []} userId={user.id} plan={profile?.plan || 'free'} />
}
