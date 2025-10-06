// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // ⬇︎ put screens directly under `theme`
  theme: {
    screens: {
      sm: '300px',
      md: '480px',
      lg: '768px',
      xl: '1544px',
      // add 2xl only if you need it, otherwise it keeps Tailwind’s default
      // '2xl': '1920px',
    },

    // keep `extend` for colours, spacing, etc.
    extend: {},
  },

  plugins: [],
}
