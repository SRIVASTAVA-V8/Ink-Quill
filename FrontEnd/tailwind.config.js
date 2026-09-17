/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
  extend: {
    colors: {

        // Brand
        primary: "#243048",
        secondary: "#86A584",

        // Backgrounds
        background: "#FCF9ED",
        surface: "#FFFFFF",

        // Neutral
        heading: "#252A34",
        body: "#667085",
        muted: "#98A0AA",
        border: "#D2CBC3",

        // Accent
        accent: "#D4A017",
        // Feedback
        success: "#6F9B7A",
        danger: "#C96B6B",
      },
  },
},
  plugins: [],
};