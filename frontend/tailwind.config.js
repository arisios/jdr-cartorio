/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    fontFamily: { display: ['"Playfair Display"','Georgia','serif'], serif2: ['"IM Fell English"','serif'], sans: ['"DM Sans"','sans-serif'] },
    animation: { 'slide-up':'slideUp 0.3s ease-out', 'fade-in':'fadeIn 0.25s ease-out', 'float':'float 3s ease-in-out infinite', 'pop':'pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' },
    keyframes: {
      slideUp: { from:{opacity:0,transform:'translateY(20px)'}, to:{opacity:1,transform:'translateY(0)'} },
      fadeIn: { from:{opacity:0}, to:{opacity:1} },
      float: { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-8px)'} },
      pop: { '0%':{transform:'scale(0.8)',opacity:0}, '100%':{transform:'scale(1)',opacity:1} },
    }
  }},
  plugins: [],
}
