/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");


export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003366", // Navy Blue
        secondary: "#66B2FF", // Sky Blue
        success: "#28A745", // Green
        warning: "#FFCC00", // Golden Yellow
        disabled: "#F2F2F2", // Light Gray
        darkText: "#333333", // Dark Gray for text
        lightText: "#FFFFFF", // White for text
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), nextui()],
};
