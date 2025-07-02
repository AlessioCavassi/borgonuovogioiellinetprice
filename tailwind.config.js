/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B8860B', // Oro più scuro e intenso (Dark Goldenrod)
        secondary: '#0A0A0A', // Nero profondo per ambienti notturni
        accent: '#E0E0E0', // Bianco leggermente smorzato per un look più elegante
        darkgold: '#705104', // Oro scuro per dettagli
        nightblue: '#0B1425', // Blu notte per ambienti luxury
        highlight: '#DDA74F', // Oro chiaro per highlight
        charcoal: '#1A1A1A', // Grigio carbone per sfondi alternativi
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'rotate': 'rotate 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

