/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // All JS/TS/MDX in src
    './content/**/*.{md,mdx}',        // All markdown content
    './public/**/*.html',             // Any static HTML
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            strong: {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
              background: '#f3f4f6',
              padding: '2px 4px',
              borderRadius: '4px',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
