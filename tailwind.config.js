/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      //Adding Custom Fonts
      fontFamily: {
        sacremento: ["Sacramento", "cursive"],
        "alegreya-sans": ["Alegreya Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
