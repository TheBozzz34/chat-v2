/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#BB86FC",
      secondary: "#03DAC6",
      background: "#121212",
      surface: "#121212",
      error: "#CF6679",
      onPrimary: "#000000",
      onSecondary: "#000000",
      onBackground: "#FFFFFF",
      onSurface: "#FFFFFF",
      onError: "#000000",
      text: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
        disabled: "#FFFFFF",
        hint: "#FFFFFF",
      },
    },
  },
  plugins: [],
}