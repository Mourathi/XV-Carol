import type { GiftWithChoices } from '@/types/gift'

interface GiftCardProps {
  gift: GiftWithChoices
  onChoose: (gift: GiftWithChoices) => void
}

export function GiftCard({ gift, onChoose }: GiftCardProps) {
  const count = (gift.gift_choices ?? []).length

  return (
    <div
      className="group relative h-full flex flex-col items-start text-left p-6 bg-white/90 backdrop-blur-sm border border-rose-pale/60 rounded-card shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover hover:border-rose-pale cursor-pointer"
      onClick={() => onChoose(gift)}
    >
      <span
        className="flex items-center justify-start w-14 h-14 shrink-0 rounded-soft bg-rose-blush/70 text-3xl mb-3"
        aria-hidden
      >
        {gift.emoji}
      </span>
      <h3 className="font-playfair text-rose-deep text-lg mb-1">{gift.name}</h3>
      {gift.description && (
        <p className="font-cormorant text-rose-light text-sm mb-2 italic">{gift.description}</p>
      )}
      {count >= 2 && (
        <p className="font-cormorant text-rose-light text-sm mb-3">
          {count} pessoas vão dar este presente
        </p>
      )}

      <div className="flex-1 min-h-6" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onChoose(gift)
        }}
        className="self-stretch mt-6 py-3 px-4 font-cormorant text-sm font-medium bg-rose text-white rounded-elegant hover:bg-rose-deep transition-all duration-300"
      >
        Vou dar este presente
      </button>
    </div>
  )
}
