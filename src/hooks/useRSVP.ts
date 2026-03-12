import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRSVP() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirmPresence = async (
    name: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      const { error: insertError } = await supabase.from('rsvps').insert({
        name: name.trim(),
        phone: phone.trim(),
      })

      if (insertError) throw insertError

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao confirmar presença.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  return { confirmPresence, loading, error }
}
