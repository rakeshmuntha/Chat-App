/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        englishColor: "#F1E0AC", // custom color
        brandGreen: "#22C55E",
                customDark: '#181616',
      },
    },
  },
  plugins: [],
}