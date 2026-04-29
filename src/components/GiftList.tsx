import { useState } from 'react'
import { ConsultMyGift } from './ConsultMyGift'
import { GiftCard } from './GiftCard'
import { ReserveModal } from './ReserveModal'
import { BookModal } from './BookModal'
import { Toast } from './Toast'
import { useGifts } from '@/hooks/useGifts'
import { useGiftBooks, isRomanceBookGift } from '@/hooks/useGiftBooks'
import type { GiftWithChoices } from '@/types/gift'

export function GiftList() {
  const { gifts, loading, error, chooseGift } = useGifts()
  const [selectedGift, setSelectedGift] = useState<GiftWithChoices | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const romanceGift = gifts.find((g) => isRomanceBookGift(g.name))
  const { books: romanceBooks } = useGiftBooks(romanceGift?.id ?? null)

  const isRomanceBook = selectedGift ? isRomanceBookGift(selectedGift.name) : false

  const handleChooseClick = (gift: GiftWithChoices) => {
    setSelectedGift(gift)
  }

  const showToast = () => {
    setToast({ message: 'Escolha registrada! Obrigada!', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const handleConfirmChoose = async (giftId: string, name: string) => {
    const result = await chooseGift(giftId, name)

    if (result.success) {
      setSelectedGift(null)
      showToast()
    }

    return result
  }

  const handleBookSuccess = () => {
    setSelectedGift(null)
    showToast()
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
        <p className="font-cormorant text-rose-light text-center mb-10">
          Escolha uma sugestão abaixo e registre sua escolha!
        </p>

        <ConsultMyGift />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onChoose={handleChooseClick}
              booksChosenCount={
                isRomanceBookGift(gift.name)
                  ? romanceBooks.filter((b) => b.choice).length
                  : undefined
              }
              booksTotalCount={
                isRomanceBookGift(gift.name) ? romanceBooks.length : undefined
              }
            />
          ))}
        </div>

        {gifts.length === 0 && (
          <p className="font-cormorant text-rose-light text-center py-12 text-lg">
            Nenhuma sugestão no momento.
          </p>
        )}
      </div>

      {isRomanceBook ? (
        <BookModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
          onSuccess={handleBookSuccess}
        />
      ) : (
        <ReserveModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
          onConfirm={handleConfirmChoose}
        />
      )}

      <Toast
        message={toast?.message ?? ''}
        visible={!!toast}
        type={toast?.type}
      />
    </section>
  )
}
