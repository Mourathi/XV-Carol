import { useState, useRef, useEffect } from 'react'
import type { GiftWithChoices } from '@/types/gift'
import { useGiftBooks } from '@/hooks/useGiftBooks'

interface BookModalProps {
  gift: GiftWithChoices | null
  onClose: () => void
  onSuccess: () => void
}

export function BookModal({ gift, onClose, onSuccess }: BookModalProps) {
  const { books, loading: booksLoading, chooseBooks } = useGiftBooks(gift?.id ?? null)
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gift) {
      setName('')
      setSelectedIds(new Set())
      setError(null)
      setShowCancelConfirm(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [gift])

  const toggleBook = (id: string, hasChoice: boolean) => {
    if (hasChoice) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gift || !name.trim() || selectedIds.size === 0) return

    setLoading(true)
    setError(null)

    const result = await chooseBooks(Array.from(selectedIds), name.trim())

    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error ?? 'Erro ao registrar.')
    }
  }

  if (!gift) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => (showCancelConfirm ? setShowCancelConfirm(false) : onClose())}
        onKeyDown={(e) => e.key === 'Escape' && (showCancelConfirm ? setShowCancelConfirm(false) : onClose())}
        role="button"
        tabIndex={0}
        aria-label="Fechar modal"
      />

      <div className="relative bg-white border-2 border-rose-pale/80 p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-soft shadow-2xl">
        <h2 id="book-modal-title" className="font-playfair text-rose-deep text-xl mb-2">
          Vou dar este presente
        </h2>
        <p className="font-cormorant text-rose-light mb-6">
          {gift.emoji} {gift.name}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="book-name" className="block font-cormorant text-rose-deep text-sm mb-2">
            Seu nome
          </label>
          <input
            ref={inputRef}
            id="book-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome completo"
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant font-cormorant text-rose-deep placeholder:text-rose-light/70 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose-pale disabled:opacity-60 transition-all mb-6"
          />

          <label className="block font-cormorant text-rose-deep text-sm mb-3">
            Selecione um ou mais livros
          </label>

          {booksLoading ? (
            <p className="font-cormorant text-rose-light text-sm mb-6">Carregando lista...</p>
          ) : (
            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {books.map((book) => {
                const hasChoice = !!book.choice
                const isSelected = selectedIds.has(book.id)

                return (
                  <label
                    key={book.id}
                    className={`flex items-center gap-3 p-3 rounded-elegant border cursor-pointer transition-all ${
                      hasChoice
                        ? 'border-rose-pale/40 bg-rose-blush/20 cursor-not-allowed'
                        : isSelected
                          ? 'border-rose bg-rose-blush/50'
                          : 'border-rose-pale/60 hover:bg-rose-blush/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={hasChoice || isSelected}
                      disabled={hasChoice}
                      onChange={() => toggleBook(book.id, hasChoice)}
                      className="rounded border-rose-pale/60 text-rose focus:ring-rose/40"
                    />
                    <span
                      className={`font-cormorant text-sm ${
                        hasChoice ? 'line-through text-rose-light' : 'text-rose-deep'
                      }`}
                    >
                      {book.title}
                    </span>
                    {hasChoice && (
                      <span className="ml-auto font-cormorant text-xs text-rose-light italic">
                        escolhido
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          )}

          {error && (
            <p className="mt-2 font-cormorant text-rose-deep/80 text-sm mb-4">{error}</p>
          )}

          {showCancelConfirm ? (
            <div className="mt-6 p-4 bg-rose-blush/80 rounded-elegant border border-rose-pale/60">
              <p className="font-cormorant text-rose-deep text-sm mb-3">Tem certeza que deseja cancelar?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 px-4 font-cormorant text-sm border border-rose-pale/60 text-rose-deep rounded-elegant hover:bg-rose-blush/50 transition-all"
                >
                  Não, continuar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 font-cormorant text-sm bg-rose text-white rounded-elegant hover:bg-rose-deep transition-all"
                >
                  Sim, cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                disabled={loading}
                className="flex-1 py-3 px-4 font-cormorant border border-rose-pale/60 text-rose-deep rounded-elegant hover:bg-rose-blush/50 transition-all disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim() || selectedIds.size === 0}
                className="flex-1 py-3 px-4 font-cormorant bg-rose text-white rounded-elegant hover:bg-rose-deep disabled:opacity-60 transition-all"
              >
                {loading ? 'Registrando...' : 'Confirmar'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
