import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Notification {
  id: string
  user_id: string
  trip_request_id: string
  type: string
  message: string
  data: any
  read: boolean
  created_at: string
}

export function useNotifications() {
  const { data, error, isLoading } = useQuery<Notification[], Error>(
    ['notifications'],
    async () => {
      const user = supabase.auth.user()
      if (!user) throw new Error('Not authenticated')

      const { data: notes, error } = await supabase
        .from<Notification>('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return notes
    }
  )

  return { data, error, isLoading }
}
