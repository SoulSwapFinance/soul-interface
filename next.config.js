const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { ChainId } = require('@soulswap/sdk')

const linguiConfig = require('./lingui.config.js')
const defaultTheme = require('tailwindcss/defaultTheme')

const { locales, sourceLocale } = linguiConfig
const { screens } = defaultTheme

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
      disable: process.env.NODE_ENV === 'development',
    },
    images: {
      domains: [
        'ftmscan.com',
        'assets.soulswap.finance',
        'media.giphy.com',
        'app.soulswap.finance',
        'exchange.soulswap.finance',
        'assets.sushi.com',
        'res.cloudinary.com',
        'raw.githubusercontent.com',
        'logos.covalenthq.com',
      ],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: '/',
          destination: '/swap',
          permanent: true,
        },
        // {
        //   source: '/zap',
        //   destination: '/',
        //   permanent: true,
        // },
        {
          source: '/yield',
          destination: '/farms',
          permanent: true,
        },
        {
          source: '/farm',
          destination: '/mines',
          permanent: true,
        },        
        {
          source: '/bond',
          destination: '/bonds',
          permanent: true,
        },        
        {
          source: '/enchantment',
          destination: '/enchant',
          permanent: true,
        },
        // {
        //   source: '/coffin/underworld',
        //   destination: '/lend',
        //   permanent: true,
        // },
      ]
    },
    async rewrites() {
      return [
        // {
        //   source: '/stake',
        //   destination: '/seance',
        // },
        {
          source: '/add/:token*',
          destination: '/exchange/add/:token*',
        },
        {
          source: '/remove/:token*',
          destination: '/exchange/remove/:token*',
        },
        {
          source: '/create/:token*',
          destination: '/exchange/add/:token*',
        },
        {
          source: '/swap',
          destination: '/swap',
        },
        {
          source: '/swap/:token*',
          destination: '/exchange/swap/:token*',
        },
        {
          source: '/limit-order',
          destination: '/exchange/limit-order',
        },
        {
          source: '/limit-order/:token*',
          destination: '/exchange/limit-order/:token*',
        },
        {
          source: '/open-order',
          destination: '/exchange/open-order',
        },
        // {
        //   source: '/migrate',
        //   destination: '/exchange/migrate',
        // },
        {
          source: '/pool',
          destination: '/exchange/pool',
        },
        {
          source: '/user',
          destination: '/portfolio',
        },
        {
          source: '/find',
          destination: '/exchange/find',
        },
        // Underworld
        // {
        //   source: '/borrow',
        //   destination: '/underworld/borrow',
        // },
        // {
        //   source: '/borrow/:token*',
        //   destination: '/underworld/borrow/:token*',
        // },
        // {
        //   source: '/lend',
        //   destination: '/underworld/lend',
        // },
        // {
        //   source: '/lend/:token*',
        //   destination: '/underworld/lend/:token*',
        // },
        {
          source: '/balances',
          destination: '/portfolio',
        },
        {
          source: '/farm',
          destination: '/mines?filter=active',
        },
        {
          source: '/farms',
          destination: '/mines?filter=active',
        },
        {
          source: '/mines',
          destination: '/mines?filter=active',
        },
        {
          source: '/analytics',
          destination: '/analytics/dashboard',
        },
        {
          source: '/bond',
          destination: '/bonds',
        },
        {
          source: '/me',
          destination: '/user',
        },
      ]
    },
    i18n: {
      // localeDetection: true,
      locales,
      defaultLocale: sourceLocale,
    },
    network: {
      chainIds: [ChainId.FANTOM],
      defaultChainId: ChainId.FANTOM,
      domains: [
        {
          domain: 'soulswap.finance',
          defaultChainId: ChainId.FANTOM,
        },
      ],
    },
    publicRuntimeConfig: {
      breakpoints: screens,
    },
  })
)

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.s', JSON.stringify(module.exports, null, 2))
