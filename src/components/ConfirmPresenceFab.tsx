const RSVP_ANCHOR = 'confirmacao-presenca'

export function ConfirmPresenceFab() {
  const goToRsvp = () => {
    document.getElementById(RSVP_ANCHOR)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <button
      type="button"
      onClick={goToRsvp}
      className="fixed z-50 left-1/2 -translate-x-1/2 bottom-[max(1rem,env(safe-area-inset-bottom,0px))] inline-flex items-center justify-center gap-2 py-3 pl-4 pr-5 rounded-pill bg-white text-rose-deep border-2 border-rose-deep font-cormorant text-sm font-semibold shadow-[0_4px_24px_-2px_rgba(160,48,96,0.35),0_2px_8px_-2px_rgba(0,0,0,0.12)] hover:bg-rose-blush transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      aria-label="Ir para a ficha de confirmação de presença"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 shrink-0 text-rose-deep"
        aria-hidden
      >
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      <span className="whitespace-nowrap">Confirmar presença</span>
    </button>
  )
}
