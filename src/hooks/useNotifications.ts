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
  const {
    data,
    error,
    isPending,
  } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: notes, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return notes as Notification[]
    },
  })

  return { data, error, isLoading: isPending }
}
