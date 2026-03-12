import type { Gift } from '@/types/gift'

interface GiftCardProps {
  gift: Gift
  onReserve: (gift: Gift) => void
}

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  const isReserved = gift.reserved

  return (
    <div
      className={`
        group relative p-6 bg-white/90 backdrop-blur-sm border border-rose-pale/60
        rounded-card shadow-soft transition-all duration-300
        ${isReserved
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:-translate-y-2 hover:shadow-card-hover hover:border-rose-pale cursor-pointer'
        }
      `}
    >
      {isReserved && (
        <span className="absolute -top-1 right-4 px-3 py-1 text-xs font-cormorant uppercase tracking-wider bg-rose-pale/80 text-rose-deep rounded-pill shadow-soft">
          Reservado
        </span>
      )}

      <span
        className="inline-flex items-center justify-center w-14 h-14 rounded-soft bg-rose-blush/70 text-3xl mb-3"
        aria-hidden
      >
        {gift.emoji}
      </span>
      <h3 className="font-playfair text-rose-deep text-lg mb-1">{gift.name}</h3>
      {isReserved && gift.reserved_by && (
        <p className="font-cormorant italic text-rose-light text-sm mb-4">
          por {gift.reserved_by}
        </p>
      )}

      <button
        type="button"
        onClick={() => !isReserved && onReserve(gift)}
        disabled={isReserved}
        className="mt-4 w-full py-3 px-4 font-cormorant text-sm font-medium bg-rose text-white rounded-elegant hover:bg-rose-deep disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose transition-all duration-300"
      >
        {isReserved ? 'Já reservado' : 'Reservar este presente'}
      </button>
    </div>
  )
}
