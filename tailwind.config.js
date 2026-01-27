// /** @type {import {  } from "module";('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './app/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         cyberBlack: '#0b0f14',
//         neonCyan: '#00f6ff',
//         matrixGreen: '#00ff88',
//         cyberRed: '#ff4d4d',
//         softWhite: '#d0d6e0',
//       },
//       boxShadow: {
//         'neon-glow': '0 0 10px #00f6ff, 0 0 20px #00ff88, 0 0 30px #00f6ff',
//       },
//       backdropBlur: {
//         glass: '10px',
//       },
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberBlack: '#0b0f14',
        neonCyan: '#00f6ff',
        matrixGreen: '#00ff88',
        cyberRed: '#ff4d4d',
        softWhite: '#d0d6e0',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 246, 255, 0.5), 0 0 20px rgba(0, 246, 255, 0.2)',
        'neon-green': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.2)',
      },
    },
  },
  plugins: [],
};