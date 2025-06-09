/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slate Studio color palette
        bg: '#0f172a',         // slate-900
        surface: '#1e293b',    // slate-800
        primary: '#475569',    // slate-600
        'primary-hov': '#64748b', // slate-500
        text: '#f8fafc',       // slate-50
        'text-muted': '#cbd5e1',  // slate-300
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xl': '1.5rem',    // 24px
        'xl': '1.25rem',    // 20px
        'lg': '1.125rem',   // 18px
        'base': '1rem',     // 16px
        'sm': '0.875rem',   // 14px
        'xs': '0.75rem',    // 12px
      },
    },
  },
  plugins: [],
}