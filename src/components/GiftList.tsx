import { useState } from 'react'
import { GiftCard } from './GiftCard'
import { ReserveModal } from './ReserveModal'
import { Toast } from './Toast'
import { useGifts } from '@/hooks/useGifts'
import type { GiftWithChoices } from '@/types/gift'

export function GiftList() {
  const { gifts, loading, error, chooseGift } = useGifts()
  const [selectedGift, setSelectedGift] = useState<GiftWithChoices | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleChooseClick = (gift: GiftWithChoices) => {
    setSelectedGift(gift)
  }

  const handleConfirmChoose = async (giftId: string, name: string, phone: string) => {
    const result = await chooseGift(giftId, name, phone)

    if (result.success) {
      setSelectedGift(null)
      setToast({ message: 'Escolha registrada! Obrigada!', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    }

    return result
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-rose-blush/50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-cormorant text-rose-light text-lg">Carregando sugestões...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-rose-blush/50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-cormorant text-rose-deep">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-rose-blush/50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-playfair text-rose-deep text-2xl md:text-3xl text-center mb-4 font-medium tracking-wide">
          Sugestões de Presentes
        </h2>
        <p className="font-cormorant text-rose-light text-center mb-14">
          Escolha uma sugestão abaixo e registre sua escolha!
        </p>

        <div
          className="grid gap-5 md:gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}
        >
          {gifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onChoose={handleChooseClick} />
          ))}
        </div>

        {gifts.length === 0 && (
          <p className="font-cormorant text-rose-light text-center py-12 text-lg">
            Nenhuma sugestão no momento.
          </p>
        )}
      </div>

      <ReserveModal
        gift={selectedGift}
        onClose={() => setSelectedGift(null)}
        onConfirm={handleConfirmChoose}
      />

      <Toast
        message={toast?.message ?? ''}
        visible={!!toast}
        type={toast?.type}
      />
    </section>
  )
}
