import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ilikeContainsPattern } from '@/lib/escapeIlike'

type GiftLookupRow = {
  id: string
  name: string
  created_at: string
  gifts: { name: string; emoji: string } | null
}

type BookLookupRow = {
  id: string
  name: string
  created_at: string
  gift_books: {
    title: string
    gifts: { name: string; emoji: string } | null
  } | null
}

export function ConsultMyGift() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [giftRows, setGiftRows] = useState<GiftLookupRow[]>([])
  const [bookRows, setBookRows] = useState<BookLookupRow[]>([])
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Informe seu nome.')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    const pattern = ilikeContainsPattern(trimmed)

    const [giftRes, bookRes] = await Promise.all([
      supabase
        .from('gift_choices')
        .select('id, name, created_at, gifts(name, emoji)')
        .ilike('name', pattern),
      supabase
        .from('gift_book_choices')
        .select('id, name, created_at, gift_books(title, gifts(name, emoji))')
        .ilike('name', pattern),
    ])

    setLoading(false)

    if (giftRes.error) {
      setError(giftRes.error.message)
      setGiftRows([])
      setBookRows([])
      return
    }
    if (bookRes.error) {
      setError(bookRes.error.message)
      setGiftRows([])
      setBookRows([])
      return
    }

    setGiftRows((giftRes.data ?? []) as GiftLookupRow[])
    setBookRows((bookRes.data ?? []) as BookLookupRow[])
  }

  const hasResults = giftRows.length > 0 || bookRows.length > 0

  return (
    <div
      id="consultar-minha-escolha"
      className="mb-12 p-6 md:p-8 bg-white/80 backdrop-blur-sm border border-rose-pale/60 rounded-card shadow-soft max-w-xl mx-auto"
    >
      <h3 className="font-playfair text-rose-deep text-lg md:text-xl text-center mb-2 font-medium">
        Consultar minha escolha
      </h3>
      <p className="font-cormorant text-rose-light text-sm text-center mb-5">
        Você pode buscar por parte do nome: primeiro nome, sobrenome ou nome completo — não
        precisa ser igual ao cadastro, desde que o trecho apareça no nome registrado.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="consult-gift-name">
          Seu nome
        </label>
        <input
          id="consult-gift-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome ou sobrenome"
          autoComplete="name"
          className="flex-1 min-w-0 px-4 py-3 rounded-elegant border border-rose-pale/70 bg-white/90 font-cormorant text-rose-deep placeholder:text-rose-light/60 focus:outline-none focus:ring-2 focus:ring-rose/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 py-3 px-6 font-cormorant text-sm font-medium bg-rose-deep text-white rounded-elegant hover:bg-rose transition disabled:opacity-60"
        >
          {loading ? 'Buscando…' : 'Consultar'}
        </button>
      </form>

      {error && (
        <p className="mt-4 font-cormorant text-sm text-red-700 text-center" role="alert">
          {error}
        </p>
      )}

      {searched && !loading && !error && !hasResults && (
        <p className="mt-4 font-cormorant text-rose-light text-center text-sm">
          Nenhuma escolha encontrada para esse nome. Confira a grafia ou tente outra variação do
          nome.
        </p>
      )}

      {hasResults && (
        <ul className="mt-6 space-y-3 text-left">
          {giftRows.map((row) => (
            <li
              key={row.id}
              className="font-cormorant text-rose-deep flex gap-3 items-start border-b border-rose-pale/40 pb-3 last:border-0"
            >
              <span className="text-2xl shrink-0" aria-hidden>
                {row.gifts?.emoji ?? '🎁'}
              </span>
              <span>
                <span className="text-xs text-rose-light uppercase tracking-wide">
                  Nome no cadastro
                </span>
                <span className="block font-medium text-rose-deep">{row.name}</span>
                <span className="block mt-1">
                  <span className="font-medium">{row.gifts?.name ?? 'Presente'}</span>
                </span>
                <span className="block text-xs text-rose-light mt-0.5">
                  Registrado em{' '}
                  {new Date(row.created_at).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </span>
            </li>
          ))}
          {bookRows.map((row) => {
            const g = row.gift_books?.gifts
            const emoji = g?.emoji ?? '📖'
            const giftName = g?.name ?? 'Livros'
            return (
              <li
                key={row.id}
                className="font-cormorant text-rose-deep flex gap-3 items-start border-b border-rose-pale/40 pb-3 last:border-0"
              >
                <span className="text-2xl shrink-0" aria-hidden>
                  {emoji}
                </span>
                <span>
                  <span className="text-xs text-rose-light uppercase tracking-wide">
                    Nome no cadastro
                  </span>
                  <span className="block font-medium text-rose-deep">{row.name}</span>
                  <span className="block mt-1">
                    <span className="font-medium">{giftName}</span>
                  </span>
                  <span className="block text-sm text-rose-light mt-0.5">
                    Livro: {row.gift_books?.title ?? '—'}
                  </span>
                  <span className="block text-xs text-rose-light mt-0.5">
                    Registrado em{' '}
                    {new Date(row.created_at).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
