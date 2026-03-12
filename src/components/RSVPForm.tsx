import { useState } from 'react'
import { useRSVP } from '@/hooks/useRSVP'
import { Toast } from './Toast'

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function RSVPForm() {
  const { confirmPresence, loading } = useRSVP()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setToast({ message: 'Informe um número de telefone válido.', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    const result = await confirmPresence(name.trim(), phoneDigits)

    if (result.success) {
      setName('')
      setPhone('')
      setConfirmed(true)
    } else {
      setToast({ message: result.error ?? 'Erro ao confirmar.', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (confirmed) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <div className="bg-white/85 backdrop-blur-sm border border-rose-pale/50 rounded-[1.5rem] p-8 md:p-12 shadow-soft text-center animate-fade-in">
            <span className="text-4xl mb-4 block" aria-hidden>💕</span>
            <p className="font-great-vibes text-rose-deep text-3xl md:text-4xl mb-3">
              Obrigada!
            </p>
            <p className="font-cormorant text-rose-light text-lg leading-relaxed">
              Sua presença é um presente. Estamos ansiosos para celebrar com você!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-md mx-auto">
        <h2 className="font-playfair text-rose-deep text-2xl md:text-3xl text-center mb-4 font-medium tracking-wide">
          Confirme sua presença
        </h2>
        <p className="font-cormorant text-rose-light mb-8 text-lg text-center">
          Por favor, confirme sua presença até o dia 7 de Maio de 2026.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/85 backdrop-blur-sm border border-rose-pale/50 rounded-[1.5rem] p-6 md:p-8 shadow-soft"
        >
          <label htmlFor="rsvp-name" className="block font-cormorant text-rose-deep text-sm mb-2">
            Nome completo
          </label>
          <input
            id="rsvp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant font-cormorant text-rose-deep placeholder:text-rose-light/70 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose-pale disabled:opacity-60 transition-all mb-4"
          />

          <label htmlFor="rsvp-phone" className="block font-cormorant text-rose-deep text-sm mb-2">
            Telefone
          </label>
          <input
            id="rsvp-phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant font-cormorant text-rose-deep placeholder:text-rose-light/70 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose-pale disabled:opacity-60 transition-all mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 font-cormorant font-medium bg-rose text-white rounded-elegant hover:bg-rose-deep transition-all duration-300 shadow-soft hover:shadow-card disabled:opacity-60"
          >
            {loading ? 'Confirmando...' : 'Confirmar presença'}
          </button>
        </form>
      </div>

      <Toast message={toast?.message ?? ''} visible={!!toast} type={toast?.type} />
    </section>
  )
}
