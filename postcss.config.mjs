/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // Opt-in to future-facing features
      future: {},
      // PostCSS-specific options
      // ...
      // Tailwind CSS options
      content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {},
      },
      // ...
    },
  },
}

export default config
