// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        bnkle: '0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
        custom: ' 0 6px 8px rgba(0, 0, 0, 0.10), 0 6px 8px rgba(0, 0, 0, 0.10)'
      },
      colors: {
        bbg: '#ECF2FB',
        bblue: '#437ADB',
        bash: '#77828D',
        bborder: '#2C2C2C',
        hoverblue: '#C7D7F4',
        bred: '#A7194B',
        lightblue: '#ECF2FB',
        bidsbg: '#E6E9ED',
        pbg: '#F1F2F4',
        projectBg: '#F4F4F5',
        borange: '#FF8A34',
        orangeShade: ['#CC6E2A'],
        redShade: ['#B63434', '#A7194B'],
        ashShade: [
          '#F1F2F4',
          '#5E6777',
          '#9099A8',
          '#E4E6EA',
          '#C8CDD4',
          '#E6E9ED',
          '#121212',
          '#C8CDD4',
          'rgba(241, 242, 244, 0.5)',
          '#E4E6EA',
          '#0D182C',
          '#5E6777',
          '#C4C4C4',
          '#D9D9D9',
          '#ECF2FB',
          '#667085'
        ],
        bblack: ['#091C2F', '#222B34', '#24282E', '#0C0F13', '#1A1F36'],
        boverlay: 'rgba(0,0,0,.8)',
        lightShades: ['#FFF3EB', '#F6E8ED'],
        redShades: ['#A7194B', '#FFE5E5', '#B63434'],
        blueShades: ['#365EAF', '#ECF2FB', '#7BA2E6', '#437ADB', '#C7D7F4'],
        submission: ['#F8EFD8', '#E3F2E0'],
        bgreen: ['#459A33', '#E3F2E0', '#A8D461', '#8DC881'],
        byellow: ['#F8EFD8', '#E2AE29']
      },
      animation: {
        pulse_fast: 'pulse 1s linear infinite'
      },
      screens: {
        xmd: { min: '692px' },
        '3xl': '1600px',
        '4xl': '1900px'
      },
      fontFamily: {
        Medium: 'Medium',
        Demibold: 'SemiBold',
        satoshi: 'satoshi',
        commons: 'commons'
      },
      height: {
        95: '95%'
      },
      width: {
        49: '49%',
        55: '55%',
        43: '43%',
        150: '620px'
      },
      maxWidth: {
        150: '150px',
        200: '200px',
        '8xl': '1400px',
        '9xl': '1500px',
        '10xl': '1600px'
      },
      padding: {
        '1px': '1px'
      },
      left: {
        1: '5%'
      },
      transitionProperty: {
        height: 'height',
        opacity: 'opacity'
      },
      gridAutoRows: {
        '1fr': 'minmax(0, 1fr)'
      },
      fontSize: {
        xxs: 10
      }
    }
  },
  variants: {
    scrollbar: ['rounded'],
    extend: {
      display: ['group-hover'],
      backgroundColor: ['odd']
    }
  },
  // eslint-disable-next-line no-undef
  plugins: [require('tailwindcss-scoped-groups'), require('tailwind-scrollbar')]
};
