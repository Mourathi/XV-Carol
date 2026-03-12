import { useState } from 'react'
import { GiftCard } from './GiftCard'
import { ReserveModal } from './ReserveModal'
import { Toast } from './Toast'
import { useGifts } from '@/hooks/useGifts'
import type { Gift } from '@/types/gift'

export function GiftList() {
  const { gifts, loading, error, reserveGift } = useGifts()
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleReserveClick = (gift: Gift) => {
    setSelectedGift(gift)
  }

  const handleConfirmReserve = async (giftId: string, name: string, phone: string) => {
    const result = await reserveGift(giftId, name, phone)

    if (result.success) {
      setSelectedGift(null)
      setToast({ message: 'Presente reservado com sucesso!', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    }

    return result
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-rose-blush/50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-cormorant text-rose-light text-lg">Carregando lista de presentes...</p>
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
        <h2 className="font-playfair text-rose-deep text-2xl md:text-3xl text-center mb-14 font-medium tracking-wide">
          Lista de Presentes
        </h2>

        <div
          className="grid gap-5 md:gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}
        >
          {gifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onReserve={handleReserveClick} />
          ))}
        </div>

        {gifts.length === 0 && (
          <p className="font-cormorant text-rose-light text-center py-12 text-lg">
            Nenhum presente na lista no momento.
          </p>
        )}
      </div>

      <ReserveModal
        gift={selectedGift}
        onClose={() => setSelectedGift(null)}
        onConfirm={handleConfirmReserve}
      />

      <Toast
        message={toast?.message ?? ''}
        visible={!!toast}
        type={toast?.type}
      />
    </section>
  )
}
