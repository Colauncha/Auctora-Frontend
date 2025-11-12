/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: '#800000',
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { color: '#111827', fontWeight: '700' },
            h2: { color: '#1f2937', fontWeight: '600' },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '2px 4px',
              borderRadius: '4px',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         maroon: '#800000',
//       },
//     },
//   },
//   plugins: [],
// };
