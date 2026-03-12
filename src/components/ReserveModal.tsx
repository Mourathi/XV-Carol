import { useState, useRef, useEffect } from 'react'
import type { GiftWithChoices } from '@/types/gift'

interface ChooseModalProps {
  gift: GiftWithChoices | null
  onClose: () => void
  onConfirm: (giftId: string, name: string, phone: string) => Promise<{ success: boolean; error?: string }>
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function ReserveModal({ gift, onClose, onConfirm }: ChooseModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gift) {
      setName('')
      setPhone('')
      setError(null)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [gift])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gift || !name.trim() || !phone.trim()) return

    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setError('Informe um número de telefone válido.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await onConfirm(gift.id, name.trim(), phoneDigits)

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
        className="absolute inset-0 bg-rose-deep/20 backdrop-blur-md"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Fechar modal"
      />

      <div className="relative bg-cream/95 backdrop-blur-sm border border-rose-pale/60 p-6 md:p-8 max-w-md w-full rounded-soft shadow-card">
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
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant font-cormorant text-rose-deep placeholder:text-rose-light/70 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose-pale disabled:opacity-60 transition-all mb-4"
          />

          <label htmlFor="choose-phone" className="block font-cormorant text-rose-deep text-sm mb-2">
            Seu telefone
          </label>
          <input
            id="choose-phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant font-cormorant text-rose-deep placeholder:text-rose-light/70 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose-pale disabled:opacity-60 transition-all"
          />

          {error && (
            <p className="mt-2 font-cormorant text-rose-deep/80 text-sm">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 font-cormorant border border-rose-pale/60 text-rose-deep rounded-elegant hover:bg-rose-blush/50 transition-all disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !phone.trim()}
              className="flex-1 py-3 px-4 font-cormorant bg-rose text-white rounded-elegant hover:bg-rose-deep disabled:opacity-60 transition-all"
            >
              {loading ? 'Registrando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
