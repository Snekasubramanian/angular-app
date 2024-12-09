/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        AvenirNext: ['AvenirNext'],
        BasierCircle: ['BasierCircle']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
