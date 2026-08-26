/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ead: {
          green: '#007749',
          blue: '#004B87',
          silver: '#898D8D',
          mangrove: '#74AA50',
          reef: '#009CA6',
          dune: '#D9C756',
          night: '#2C2A29',
          sand: '#FAFBFD',
          darkBlue: '#003666',
          deepNavy: '#002544',
        },
        navy: {
          950: '#030D17',
          900: '#071A2B',
          850: '#0B2238',
          800: '#0E2C48',
          700: '#143E65',
        },
        primary: {
          DEFAULT: '#0878C9',
          50: '#EAF6FC',
          100: '#D5EDF9',
          200: '#ABDDF3',
          300: '#6CC2EB',
          400: '#34A5DF',
          500: '#0878C9',
          600: '#0662A6',
          700: '#054D83',
          800: '#043860',
          900: '#02243D',
        },
        cyan: {
          brand: '#19B5D8',
          light: '#E6F8FB',
          glow: 'rgba(25, 181, 216, 0.4)',
        },
        teal: {
          brand: '#16A6A0',
          light: '#E7F7F6',
          glow: 'rgba(22, 166, 160, 0.35)',
        },
        mrv: {
          dark: '#132238',
          muted: '#667085',
          softBlue: '#EAF6FC',
          surface: '#F4F9FD',
          border: 'rgba(8, 120, 201, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        heavy: '24px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(7, 26, 43, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'glass-hover': '0 12px 40px 0 rgba(7, 26, 43, 0.14), 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'glass-glow': '0 0 25px rgba(25, 181, 216, 0.25)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
