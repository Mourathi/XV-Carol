import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface RsvpRow {
  id: string
  name: string
  phone: string
  created_at: string
}

export interface GiftChoiceRow {
  id: string
  gift_id: string
  name: string
  gift_name: string
  gift_emoji: string
  created_at: string
}

export interface BookChoiceRow {
  id: string
  book_id: string
  book_title: string
  name: string
  created_at: string
}

export function useAdmin() {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([])
  const [giftChoices, setGiftChoices] = useState<GiftChoiceRow[]>([])
  const [bookChoices, setBookChoices] = useState<BookChoiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true)
        setError(null)

        const [rsvpRes, giftChoiceRes, bookChoiceRes] = await Promise.all([
          supabase.from('rsvps').select('id, name, phone, created_at').order('created_at', { ascending: false }),
          supabase
            .from('gift_choices')
            .select(`
              id, gift_id, name, created_at,
              gifts (name, emoji)
            `)
            .order('created_at', { ascending: false }),
          supabase
            .from('gift_book_choices')
            .select(`
              id, book_id, name, created_at,
              gift_books (title)
            `)
            .order('created_at', { ascending: false }),
        ])

        if (rsvpRes.error) throw rsvpRes.error
        if (giftChoiceRes.error) throw giftChoiceRes.error
        if (bookChoiceRes.error) throw bookChoiceRes.error

        setRsvps((rsvpRes.data ?? []) as RsvpRow[])

        setGiftChoices(
          (giftChoiceRes.data ?? []).map((row: Record<string, unknown>) => {
            const gifts = row.gifts as { name: string; emoji: string } | null
            return {
              id: row.id,
              gift_id: row.gift_id,
              name: row.name,
              gift_name: gifts?.name ?? '-',
              gift_emoji: gifts?.emoji ?? '',
              created_at: row.created_at,
            }
          })
        )

        setBookChoices(
          (bookChoiceRes.data ?? []).map((row: Record<string, unknown>) => {
            const books = row.gift_books as { title: string } | null
            return {
              id: row.id,
              book_id: row.book_id,
              book_title: books?.title ?? '-',
              name: row.name,
              created_at: row.created_at,
            }
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return { rsvps, giftChoices, bookChoices, loading, error }
}
