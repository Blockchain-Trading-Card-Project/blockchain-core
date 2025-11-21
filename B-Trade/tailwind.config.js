/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind will scan all your source files
  ],
  theme: {
    extend: {}, // You can add custom colors, spacing, etc. here
  },
  plugins: [], // Add plugins if needed (like forms, typography)
}
