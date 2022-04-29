const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  // important: '#__next',
  darkMode: true,
  mode: 'jit',
  future: {
    purgeLayersByDefault: true,
    applyComplexClasses: true,
  },
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      linearBorderGradients: {
        directions: {
          tr: 'to top right',
          r: 'to right',
        },
        colors: {
          'blue-pink': ['#27B0E6', '#FA52A0'],
          'blue-purple': ['#27B0E6', '#FA52A0'],
          'yellow-gold': ['#F5D100', '#F7A700'],
          'pink-red-light-brown': ['#FE5A75', '#FEC464'],
        },
        background: {
          'dark-1000': '#0D0415',
          'dark-900': '#161522',
          'dark-800': '#360069',
          'dark-pink-red': '#4e3034',
        },
        border: {
          1: '1px',
          2: '2px',
          3: '3px',
          4: '4px',
        },
      },
      colors: {
        // purple: '#a755dd',
        purple: '#821fff',
        deepPurple: '#9756F7',
        // blue: '#0993ec',
        blue: '#1D5AFF',
        ftmBlue: '#11B5EC',
        arbitrumBlue: '#4698FA',
        pink: '#f338c3',
        green: '#7cff6b',
        red: '#ff3838',
        yellow: '#FFFF00',
        // gold: '#F7A700',
        gold: '#FEAC00',
        paleYellow: '#d9d68a',
        grey: '#b5aeb5',
        darkGrey: '#989898',

        'opaque-blue': '#0993ec80',
        'opaque-purple': '#B993EC',
        'opaque-pink': '#f338c380',
        'pink-red': '#FE5A75',
        'pink-purple': 'E5B6F7',
        'light-brown': '#FEC464',
        'light-yellow': '#FFD166',
        'cyan-blue': '#0993EC',
        'dark-pink': '#221825',
        'dark-blue': '#0F182A',
        'dark-1000': '#0D0415',
        'dark-900': '#161522',
        'dark-850': '#1d1e2c',
        'dark-800': '#202231',
        'dark-700': '#2E3348',
        'dark-600': '#B485FF',
        'dark-500': '#223D5E',
        'dark-420': '#B485FF',
        'low-emphesis': '#575757',
        primary: '#BFBFBF',
        secondary: '#7F7F7F',
        'high-emphesis': '#E3E3E3',
      },
      lineHeight: {
        '48px': '48px',
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        hero: [
          '48px',
          {
            letterSpacing: '-0.02em;',
            lineHeight: '96px',
            fontWeight: 700,
          },
        ],
      },
      borderRadius: {
        none: '0',
        px: '1px',
        DEFAULT: '0.625rem',
      },
      boxShadow: {
        swap: '0px 50px 250px -47px rgba(39, 176, 230, 0.29)',
        liquidity: '0px 50px 250px -47px rgba(123, 97, 255, 0.23)',
        'pink-glow': '0px 57px 90px -47px rgba(250, 82, 160, 0.15)',
        'blue-glow': '0px 57px 90px -47px rgba(39, 176, 230, 0.17)',
        'pink-glow-hovered': '0px 57px 90px -47px rgba(250, 82, 160, 0.30)',
        'blue-glow-hovered': '0px 57px 90px -47px rgba(39, 176, 230, 0.34)',
      },
      ringWidth: {
        DEFAULT: '1px',
      },
      padding: {
        px: '1px',
        '3px': '3px',
      },
      minHeight: {
        empty: '128px',
        cardContent: '230px',
        fitContent: 'fit-content',
      },
      dropShadow: {
        currencyLogo: '0px 3px 6px rgba(15, 15, 15, 0.25)',
      },
    },
  },
  variants: {
    linearBorderGradients: ['responsive', 'hover', 'dark'], // defaults to ['responsive']
    extend: {
      backgroundColor: ['checked', 'disabled'],
      backgroundImage: ['hover', 'focus'],
      borderColor: ['checked', 'disabled'],
      cursor: ['disabled'],
      opacity: ['hover', 'disabled'],
      placeholderColor: ['hover', 'active'],
      ringWidth: ['disabled'],
      ringColor: ['disabled'],
    },
  },
  plugins: [
    require('tailwindcss-border-gradient-radius'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.header-border-b': {
          background:
            'linear-gradient(to right, rgba(39, 176, 230, 0.2) 0%, rgba(250, 82, 160, 0.2) 100%) left bottom no-repeat',
          backgroundSize: '100% 1px',
        },
      })
    }),
  ],
}
