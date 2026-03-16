interface ToastProps {
  message: string
  visible: boolean
  type?: 'success' | 'error'
}

export function Toast({ message, visible, type = 'success' }: ToastProps) {
  if (!visible) return null

  const isSuccess = type === 'success'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up"
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          w-full max-w-md py-5 px-6 font-cormorant text-center rounded-soft shadow-card
          border backdrop-blur-sm
          ${isSuccess
            ? 'bg-rose-deep/95 text-white border-rose-deep/50'
            : 'bg-white/95 text-rose-deep border-rose-pale shadow-[0_8px_32px_-8px_rgb(160_48_96_/_25%)]'
          }
        `}
      >
        <span className="block text-2xl mb-2" aria-hidden>
          {isSuccess ? '💕' : '✨'}
        </span>
        <p className="text-lg leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
