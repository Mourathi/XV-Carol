/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: 'var(--rose)',
        'rose-light': 'var(--rose-light)',
        'rose-pale': 'var(--rose-pale)',
        'rose-blush': 'var(--rose-blush)',
        'rose-deep': 'var(--rose-deep)',
        cream: 'var(--cream)',
      },
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        'elegant': '1rem',
        'card': '1.25rem',
        'soft': '1.5rem',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgb(192 84 122 / 12%)',
        'card': '0 8px 32px -8px rgb(160 48 96 / 15%)',
        'card-hover': '0 12px 40px -8px rgb(160 48 96 / 20%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
