interface ToastProps {
  message: string
  visible: boolean
  type?: 'success' | 'error'
}

export function Toast({ message, visible, type = 'success' }: ToastProps) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 left-4 right-4 z-50 md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-md animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          py-4 px-6 font-cormorant text-center rounded-soft shadow-card
          ${type === 'success' ? 'bg-rose-deep/95 text-white' : 'bg-red-600/95 text-white'}
        `}
      >
        {message}
      </div>
    </div>
  )
}
