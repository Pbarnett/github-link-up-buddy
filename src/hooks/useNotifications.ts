
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Notification {
  id: string
  user_id: string
  trip_request_id: string
  type: string
  message: string
  data: any
  is_read: boolean
  created_at: string
}

export function useNotifications() {

  const { data, error, isPending } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: notes, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      return notes
    }
  })

  return { data, error, isLoading: isPending }
}
