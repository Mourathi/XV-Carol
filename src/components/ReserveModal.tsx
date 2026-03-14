import { useState, useRef, useEffect } from 'react'
import type { GiftWithChoices } from '@/types/gift'

interface ChooseModalProps {
  gift: GiftWithChoices | null
  onClose: () => void
  onConfirm: (giftId: string, name: string) => Promise<{ success: boolean; error?: string }>
}

export function ReserveModal({ gift, onClose, onConfirm }: ChooseModalProps) {
  const [name, setName] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gift) {
      setName('')
      setError(null)
      setShowCancelConfirm(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [gift])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gift || !name.trim()) return

    setLoading(true)
    setError(null)

    const result = await onConfirm(gift.id, name.trim())

    setLoading(false)

    if (result.success) {
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
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => (showCancelConfirm ? setShowCancelConfirm(false) : onClose())}
        onKeyDown={(e) => e.key === 'Escape' && (showCancelConfirm ? setShowCancelConfirm(false) : onClose())}
        role="button"
        tabIndex={0}
        aria-label="Fechar modal"
      />

      <div className="relative bg-white border-2 border-rose-pale/80 p-6 md:p-8 max-w-md w-full rounded-soft shadow-2xl">
        <h2 id="modal-title" className="font-playfair text-rose-deep text-xl mb-2">
          Vou dar este presente
        </h2>
        <p className="font-cormorant text-rose-light mb-6">
          {gift.emoji} {gift.name}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="choose-name" className="block font-cormorant text-rose-deep text-sm mb-2">
            Seu nome
          </label>
          <input
            ref={inputRef}
            id="choose-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome completo"
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant font-cormorant text-rose-deep placeholder:text-rose-light/70 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose-pale disabled:opacity-60 transition-all"
          />

          {error && (
            <p className="mt-2 font-cormorant text-rose-deep/80 text-sm">{error}</p>
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
              disabled={loading || !name.trim()}
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
