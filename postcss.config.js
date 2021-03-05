const autoprefixer = require('autoprefixer')
const tailwindcss = require('./tailwind.config')

module.exports = {
  plugins: { tailwindcss, autoprefixer }
}
