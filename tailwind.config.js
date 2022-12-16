/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./public/**/*.{html,js}`],
  theme: {

    extend: {

      fontFamily:{
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },

  ],
}