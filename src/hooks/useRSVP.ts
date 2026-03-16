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

      const phoneDigits = phone.replace(/\D/g, '')
      const phoneNorm = phoneDigits.length === 13 && phoneDigits.startsWith('55')
        ? phoneDigits.slice(2)
        : phoneDigits

      const { data: existing } = await supabase
        .from('rsvps')
        .select('id')
        .or(`phone.eq.${phoneNorm},phone.eq.55${phoneNorm}`)
        .limit(1)

      if (existing && existing.length > 0) {
        return {
          success: false,
          error: 'Sei que está ansioso(a), mas você já confirmou! 💕',
        }
      }

      const { error: insertError } = await supabase.from('rsvps').insert({
        name: name.trim(),
        phone: phoneNorm,
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
