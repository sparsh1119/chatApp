/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        ChatBg : 'url("/src/assets/chatbg.jpg")',
      }
    },
  },
  plugins: [],
}

