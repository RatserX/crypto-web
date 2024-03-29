/** @type {import('tailwindcss').Config}*/
const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],

  theme: {
    extend: {
      height: {
        100: '25rem' /* 400px */,
        120: '30rem' /* 480px */,
      },
    },
  },

  plugins: [require('flowbite/plugin')],

  darkMode: 'media',
};

module.exports = config;
