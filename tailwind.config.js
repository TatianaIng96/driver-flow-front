/** @type {import('tailwindcss').Config} */
import lineClamp from '@tailwindcss/line-clamp';
import iosFullHeight from '@rvxlab/tailwind-plugin-ios-full-height';
export default {
  content: [],
  theme: {
    extend: {
      zIndex: {
        50: '50',
        100: '100',
        999: '999',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        'custom-lg': '1500px', // Define un nuevo breakpoint a 1500px
        'custom-xl': '1700px',  // Define otro breakpoint a 1700px
        'sm-1024x600': {'raw': '(max-width: 1024px) and (max-height: 600px)'},
      },
    },
  },
  plugins: [
    lineClamp,
    iosFullHeight
  ],
};

