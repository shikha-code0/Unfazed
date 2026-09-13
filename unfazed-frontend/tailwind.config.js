/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C536F', // Mulberry Confidence
          hover: '#654154',
          light: '#E8B9A7', // Reusing peach for some light primary accents, or maybe a muted mauve. Let's use a light mauve for primary-light if needed, but the prompt says use peach only for attention. Let's use a very light version or just rely on the new bg tokens. We'll set primary-light to a light mauve, e.g., #EEDFE8. Actually, the prompt gives specific tokens:
        },
        'bg-main': '#CDE2F2',
        'bg-card': '#DDECF7',
        'bg-card-elevated': '#EAF3F9',
        'bg-dark-card': '#29445E',
        'bg-dark-sidebar': '#1E3145',
        
        text: {
          primary: '#1E3145',
          secondary: '#52677D',
        },
        border: '#B4CFDF',
        sage: {
          DEFAULT: '#89A996',
          soft: '#DCEBE1',
        },
        ivory: '#FAF9F6', // Keep for fallback if needed, but try to avoid
        surface: '#EAF3F9', // Update surface to elevated card bg
        ink: '#1E3145',     // Ink maps to text-primary
        slate: '#52677D',   // Slate maps to text-secondary
        warning: {
          DEFAULT: '#C9863A',
          bg: '#FEF3C7',
        },
        error: {
          DEFAULT: '#B95B68',
          bg: '#FEE2E2',
        },
        success: {
          DEFAULT: '#89A996',
          bg: '#DCEBE1',
        },
        peach: {
          DEFAULT: '#E8B9A7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(31, 41, 55, 0.06)',
      }
    },
  },
  plugins: [],
}
