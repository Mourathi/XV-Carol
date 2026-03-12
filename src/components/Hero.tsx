import { HeroAmbient } from './HeroAmbient'

const FloralCorner = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-20 h-20 md:w-28 md:h-28 opacity-[0.12]"
    fill="currentColor"
  >
    <circle cx="50" cy="50" r="6" />
    <circle cx="30" cy="35" r="4" />
    <circle cx="70" cy="35" r="4" />
    <circle cx="35" cy="65" r="4" />
    <circle cx="65" cy="65" r="4" />
    <path d="M50 44 Q55 50 50 56 Q45 50 50 44" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
)

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16"
      style={{
        background: `
          radial-gradient(ellipse 100% 60% at 50% 0%, var(--rose-blush) 0%, transparent 60%),
          radial-gradient(ellipse 80% 50% at 20% 100%, var(--rose-pale) 0%, transparent 50%),
          radial-gradient(ellipse 80% 50% at 80% 100%, var(--rose-pale) 0%, transparent 50%),
          var(--cream)
        `,
      }}
    >
      {/* Animação ambiente - shimmer e sparkles */}
      <div className="absolute inset-0 z-0">
        <HeroAmbient />
      </div>

      {/* Decorações florais nos cantos */}
      <div className="absolute top-0 left-0 text-rose p-6 md:p-10 z-[1]" aria-hidden>
        <FloralCorner />
      </div>
      <div className="absolute top-0 right-0 text-rose p-6 md:p-10 scale-x-[-1] z-[1]" aria-hidden>
        <FloralCorner />
      </div>
      <div className="absolute bottom-0 left-0 text-rose p-6 md:p-10 scale-y-[-1] z-[1]" aria-hidden>
        <FloralCorner />
      </div>
      <div className="absolute bottom-0 right-0 text-rose p-6 md:p-10 scale-[-1] z-[1]" aria-hidden>
        <FloralCorner />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        <div
          className="animate-scale-in opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <img
            src="/Moura-xv-logo.svg"
            alt="Caroline Moura - Quinze Anos"
            className="w-[min(95vw,840px)] h-auto object-contain drop-shadow-[0_8px_32px_rgba(160,48,96,0.12)] animate-fade-up"
          />
        </div>

        {/* Divider decorativo — linha curva com detalhe */}
        <div
          className="flex items-center gap-4 mt-12 mb-8 animate-fade-up opacity-0"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <span className="w-20 h-px bg-gradient-to-r from-transparent to-rose-pale" />
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-pale" fill="currentColor">
            <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8Z" />
          </svg>
          <span className="w-20 h-px bg-gradient-to-l from-transparent to-rose-pale" />
        </div>

        <p
          className="font-cormorant text-rose-deep text-lg md:text-xl animate-fade-up opacity-0"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          <span className="font-playfair font-medium">Data:</span> 15 de março de 2026
        </p>
        <p
          className="font-cormorant text-rose-deep text-lg md:text-xl mt-1 animate-fade-up opacity-0"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <span className="font-playfair font-medium">Local:</span> Salão de festas
        </p>
      </div>

      {/* Indicador de scroll */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50"
        aria-hidden
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-rose-deep"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
