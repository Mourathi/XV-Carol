import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Gift } from '@/types/gift'

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGifts() {
      try {
        const { data, error: fetchError } = await supabase
          .from('gifts')
          .select('*')
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setGifts(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar presentes')
      } finally {
        setLoading(false)
      }
    }

    fetchGifts()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('gifts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gifts' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setGifts((prev) =>
              prev.map((g) => (g.id === payload.new.id ? (payload.new as Gift) : g))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const reserveGift = async (
    giftId: string,
    name: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error: updateError } = await supabase
        .from('gifts')
        .update({
          reserved: true,
          reserved_by: name.trim(),
          reserved_phone: phone.trim(),
          reserved_at: new Date().toISOString(),
        })
        .eq('id', giftId)
        .eq('reserved', false)
        .select()

      if (updateError) {
        if (updateError.code === 'PGRST116') {
          return { success: false, error: 'Este presente já foi reservado por outra pessoa.' }
        }
        throw updateError
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'Este presente já foi reservado por outra pessoa.' }
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro ao reservar presente.',
      }
    }
  }

  return { gifts, loading, error, reserveGift }
}
