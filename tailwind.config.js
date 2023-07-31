/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./layout/*.liquid",
    "./templates/*.liquid",
    "./templates/customers/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
  ],
  safelist: [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-7xl",
    "text-8xl",
    "text-9xl",
    "font-thin",
    "font-extralight",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    "font-extrabold",
    "font-black",
    "list-decimal",
    "list-disc",
    "list-steps",
    "rotate-180",
    "md:block",
    "md:hidden",
  ],
  theme: {
    fontFamily: {
      sans: ["Proxima Nova", "ui-sans-serif", "system-ui"],
      // slab: ["Museo Slab", "ui-serif", "Georgia"],
      // mono: ["Inconsolata", "SFMono-Regular"],
      // display: ["Sun Valley", "SFMono-Regular"],
    },
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "1560px",
        },
      },
      colors: {
        primary: {
          light: "#84a7e3",
          dark: "#14015b",
        },
        accent: {
          DEFAULT: "#509d8c",
        },
        neutral: {
          DEFAULT: "#393939",
        },
      },
      transitionTimingFunction: {
        "in-quint": "cubic-bezier(0.76,0.05,0.86,0.06)",
        "out-quint": "cubic-bezier(0.23,1,0.32,1)",
        "in-expo": "cubic-bezier(0.95,0.05,0.8,0.04)",
        "out-expo": "cubic-bezier(0.19,1,0.22,1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    // plugin(function({ addBase }) {
    //   addBase({
    //      'html': { fontSize: "16px" },
    //    })
    //  }),
    plugin(function groupPeer({ addVariant }) {
      let pseudoVariants = [
        //... Any other pseudo variants you want to support. See https://github.com/tailwindlabs/tailwindcss/blob/6729524185b48c9e25af62fc2372911d66e7d1f0/src/corePlugins.js#L78
        "checked",
      ].map((variant) =>
        Array.isArray(variant) ? variant : [variant, `&:${variant}`]
      );

      for (let [variantName, state] of pseudoVariants) {
        addVariant(`group-peer-${variantName}`, (ctx) => {
          let result = typeof state === "function" ? state(ctx) : state;
          return result.replace(/&(\S+)/, ":merge(.peer)$1 ~ .group &");
        });
      }
    }),
  ],
};
