import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deep_blue: "#001233",
        light_coral_red: "#FF595A",
        voiletBlue: "#3639e4",
        websiteBase: "#f5f4fd",
        cream: "#feffff",
      },
      boxShadow: {
        cardShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), nextui()],
};
