interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'floral'
  flip?: boolean
}

export function SectionDivider({ variant = 'wave', flip = false }: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 fill-rose-blush"
        >
          <path d="M0,64 C300,120 900,0 1200,64 L1200,120 L0,120 Z" opacity="0.6" />
          <path d="M0,80 C400,20 800,100 1200,80 L1200,120 L0,120 Z" opacity="0.4" />
        </svg>
      </div>
    )
  }

  if (variant === 'curve') {
    return (
      <div className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`}>
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="w-full h-8 md:h-12"
        >
          <path
            d="M0,80 Q300,0 600,80 T1200,80 L1200,120 L0,120 Z"
            fill="var(--rose-blush)"
            opacity="0.5"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-6">
      <svg viewBox="0 0 120 24" className="w-24 h-6 text-rose-pale opacity-60">
        <path
          d="M0,12 Q30,0 60,12 T120,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="30" cy="12" r="2" fill="currentColor" />
        <circle cx="60" cy="12" r="2" fill="currentColor" />
        <circle cx="90" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  )
}
