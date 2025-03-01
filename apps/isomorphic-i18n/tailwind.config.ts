import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content" | "theme" |"plugins"> = {
  content: [
    "./src/**/*.tsx",
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
    '../../packages/isomorphic-core/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mainColor:"var(--main-color)",
        mainColorHover:"var(--main-color-hover)",
        navbarColorScroll:"var(--navbar-color-scroll)",
        ColorLitleHover:"var(--color-20)",
        Color30:"var(--color-30)",
        Color90:"var(--color-90)",
        Color50:"var(--color-50)",
      },
      fontFamily: {
        // rubik: ['Rubik', 'sans-serif'],
        // almarai: ['Almarai','sans-serif'],
        NotoSansArabic: ['var(--font-NotoSansArabic)', 'sans-serif'],
      },

    }
  },
  
  presets: [sharedConfig],

};

export default config;
