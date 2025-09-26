module.exports = {
  content: [
    "./views/*.{html,ejs}", // scan all HTML/EJS in views
    "./public/*.html",
    "./**/*.js" // if you have classes in JS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
