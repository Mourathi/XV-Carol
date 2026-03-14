import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { GiftBookWithChoice } from '@/types/gift'

const LIVRO_ROMANCE_GIFT_NAME = 'Livro de Romance'

export function useGiftBooks(giftId: string | null) {
  const [books, setBooks] = useState<GiftBookWithChoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!giftId) {
      setBooks([])
      setLoading(false)
      return
    }

    async function fetchBooks() {
      try {
        const { data: booksData, error: booksError } = await supabase
          .from('gift_books')
          .select('*')
          .eq('gift_id', giftId)
          .order('sort_order', { ascending: true })

        if (booksError) throw booksError

        const bookIds = (booksData ?? []).map((b) => b.id)

        const { data: choicesData, error: choicesError } = await supabase
          .from('gift_book_choices')
          .select('*')
          .in('book_id', bookIds)

        if (choicesError) throw choicesError

        const choicesByBook = new Map(
          (choicesData ?? []).map((c) => [c.book_id, c])

        )

        setBooks(
          (booksData ?? []).map((b) => ({
            ...b,
            choice: choicesByBook.get(b.id) ?? null,
          }))
        )
      } catch (err) {
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [giftId])

  useEffect(() => {
    if (!giftId) return

    const channel = supabase
      .channel('gift_book_choices')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gift_book_choices' },
        async (payload) => {
          const newChoice = payload.new as {
            id: string
            book_id: string
            name: string
            created_at: string
          }
          setBooks((prev) =>
            prev.map((b) =>
              b.id === newChoice.book_id
                ? { ...b, choice: newChoice }
                : b
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [giftId])

  const chooseBooks = async (
    bookIds: string[],
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const inserts = bookIds.map((book_id) => ({
        book_id,
        name: name.trim(),
      }))

      const { error } = await supabase.from('gift_book_choices').insert(inserts)

      if (error) throw error

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro ao registrar escolha.',
      }
    }
  }

  return { books, loading, chooseBooks }
}

export function isRomanceBookGift(giftName: string): boolean {
  return giftName.toLowerCase().includes('livro de romance')
}
