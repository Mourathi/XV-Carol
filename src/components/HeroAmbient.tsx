const CrownIcon = ({
  delay,
  duration,
  top,
  reverse,
}: {
  delay: number
  duration: number
  top: string
  reverse?: boolean
}) => {
  return (
    <div
      className="absolute w-6 h-6 hero-sparkle"
      style={{
        left: reverse ? 'calc(100% + 24px)' : '-24px',
        top,
        opacity: 0.32,
        animation: `sparkle-drift-${reverse ? 'rev' : 'ltr'} ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="#e8b8c4" className="w-full h-full">
        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
      </svg>
    </div>
  )
}

const DURATION = 20

export function HeroAmbient() {
  const sparkles = [
    { delay: 0, duration: DURATION, top: '15%' },
    { delay: 2.5, duration: DURATION, top: '28%', reverse: true },
    { delay: 5, duration: DURATION, top: '42%' },
    { delay: 7.5, duration: DURATION, top: '55%', reverse: true },
    { delay: 10, duration: DURATION, top: '68%' },
    { delay: 12.5, duration: DURATION, top: '82%', reverse: true },
    { delay: 15, duration: DURATION, top: '22%' },
    { delay: 17.5, duration: DURATION, top: '48%', reverse: true },
    { delay: 1.25, duration: DURATION, top: '75%' },
    { delay: 3.75, duration: DURATION, top: '35%', reverse: true },
    { delay: 6.25, duration: DURATION, top: '90%' },
    { delay: 8.75, duration: DURATION, top: '58%', reverse: true },
    { delay: 11.25, duration: DURATION, top: '12%' },
    { delay: 13.75, duration: DURATION, top: '38%', reverse: true },
    { delay: 16.25, duration: DURATION, top: '65%' },
    { delay: 18.75, duration: DURATION, top: '95%', reverse: true },
  ]

  return (
    <>
      {sparkles.map((s, i) => (
        <CrownIcon key={i} {...s} />
      ))}
    </>
  )
}
