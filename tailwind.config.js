/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        sidebar: '#0D1220',
        card: '#121A2A',
        surface: '#172235',
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA',
        },
        cyan: {
          DEFAULT: '#22D3EE',
          light: '#67E8F9',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        textMain: '#F8FAFC',
        textSecondary: '#94A3B8',
        borderSubtle: 'rgba(255,255,255,0.08)',
        borderElevated: 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(59, 130, 246, 0.25)',
        'glow-md': '0 0 25px -4px rgba(34, 211, 238, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
