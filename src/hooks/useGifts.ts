import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { GiftWithChoices } from '@/types/gift'

export function useGifts() {
  const [gifts, setGifts] = useState<GiftWithChoices[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGifts() {
      try {
        const { data, error: fetchError } = await supabase
          .from('gifts')
          .select(`
            *,
            gift_choices (id, name, gift_id, created_at)
          `)
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setGifts(
          (data ?? []).map((g) => ({
            ...g,
            gift_choices: Array.isArray(g.gift_choices) ? g.gift_choices : [],
          }))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar sugestões')
      } finally {
        setLoading(false)
      }
    }

    fetchGifts()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('gift_choices')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gift_choices' },
        async (payload) => {
          const newChoice = payload.new as { id: string; gift_id: string; name: string; created_at: string }
          setGifts((prev) =>
            prev.map((g) =>
              g.id === newChoice.gift_id
                ? { ...g, gift_choices: [...(g.gift_choices ?? []), { id: newChoice.id, name: newChoice.name, gift_id: newChoice.gift_id, phone: '', created_at: newChoice.created_at }] }
                : g
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const chooseGift = async (
    giftId: string,
    name: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: insertError } = await supabase.from('gift_choices').insert({
        gift_id: giftId,
        name: name.trim(),
        phone: phone.trim(),
      })

      if (insertError) throw insertError

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro ao registrar escolha.',
      }
    }
  }

  return { gifts, loading, error, chooseGift }
}
