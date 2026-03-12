const cards = [
  {
    emoji: '📅',
    label: 'Data',
    value: '17 de Maio de 2026',
  },
  {
    emoji: '🕐',
    label: 'Horário',
    value: '19h',
  },
  {
    emoji: '📍',
    label: 'Local',
    value: 'Salão de festas',
  },
  {
    emoji: '👗',
    label: 'Traje',
    value: 'Esporte fino (Não usar rosa)',
  },
]

export function EventDetails() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair text-rose-deep text-2xl md:text-3xl text-center mb-12 font-medium tracking-wide">
          Informações do Evento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col p-6 md:p-8 bg-white/85 backdrop-blur-sm border border-rose-pale/50 rounded-[1.5rem] shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-0.5 min-h-[140px]"
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-blush/70 text-2xl mb-4 shrink-0"
                aria-hidden
              >
                {card.emoji}
              </span>
              <p className="font-cormorant text-rose-light text-xs uppercase tracking-[0.2em] mb-2">
                {card.label}
              </p>
              <p className="font-playfair text-rose-deep text-lg md:text-xl">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
