/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "sans-serif"],
      },
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          "primary-alt": "var(--color-brand-primary-alt)",
          accent: "var(--color-brand-accent)",
          dark: "var(--color-brand-dark)",
          store: "var(--color-brand-store-header)",
        },
        page: "var(--color-page-background)",
        "home-top": "var(--color-home-top-background)",
        snap: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          heading: "var(--color-text-heading)",
          title: "var(--color-text-title)",
          body: "var(--color-text-body)",
          subtle: "var(--color-text-subtle)",
        },
        snapborder: {
          DEFAULT: "var(--color-border-default)",
          light: "var(--color-border-light)",
          muted: "var(--color-border-muted)",
          input: "var(--color-border-input)",
        },
        snaplink: {
          DEFAULT: "var(--color-link)",
          hover: "var(--color-link-hover)",
        },
        snapui: {
          dark: "var(--color-ui-dark)",
          "dark-hover": "var(--color-ui-dark-hover)",
        },
        account: {
          highlight: "var(--color-account-highlight-bg)",
          "highlight-border": "var(--color-account-highlight-border)",
          input: "var(--color-account-input-bg)",
        },
        filter: {
          active: "var(--color-filter-active-bg)",
        },
        category: {
          active: "var(--color-category-active-bg)",
        },
      },
      maxWidth: {
        page: "var(--layout-page-max-width)",
        "home-content": "var(--layout-home-content-max-width)",
        "product-detail": "var(--layout-product-detail-max-width)",
      },
    },
  },
  plugins: [],
};
