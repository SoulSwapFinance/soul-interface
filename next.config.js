const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const linguiConfig = require('./lingui.config.js')
const { locales, sourceLocale } = linguiConfig

const defaultTheme = require('tailwindcss/defaultTheme')

// const { ChainId } = require('sdk')
const { screens } = defaultTheme


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ]

    return config
  },
  // experimental: {
  //   concurrentFeatures: true,
  //   serverComponents: true,
  // },
  swcMinify: false,
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    // runtimeCaching,
    dynamicStartUrlRedirect: '/swap',
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: [
    'assets.soulswap.finance',
    'media.giphy.com',
    'assets.sushi.com',
    'res.cloudinary.com',
    'raw.githubusercontent.com',
    'logos.covalenthq.com'
    ],
  },
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
        //   source: '/bento/kashi',
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
        // {
        //   source: '/limit-order',
        //   destination: '/exchange/limit-order',
        // },
        // {
        //   source: '/limit-order/:token*',
        //   destination: '/exchange/limit-order/:token*',
        // },
        // {
        //   source: '/open-order',
        //   destination: '/exchange/open-order',
        // },
        // {
        //   source: '/migrate',
        //   destination: '/exchange/migrate',
        // },
        {
          source: '/pool',
          destination: '/exchange/pool',
        },
        {
          source: '/find',
          destination: '/exchange/find',
        },
        // Kashi
        // {
        //   source: '/borrow',
        //   destination: '/kashi/borrow',
        // },
        // {
        //   source: '/borrow/:token*',
        //   destination: '/kashi/borrow/:token*',
        // },
        // {
        //   source: '/lend',
        //   destination: '/kashi/lend',
        // },
        // {
        //   source: '/lend/:token*',
        //   destination: '/kashi/lend/:token*',
        // },
        // Onsen
        // {
        //   source: '/farm',
        //   destination: '/onsen',
        // },
        // {
        //   source: '/farm/:type*',
        //   destination: '/onsen/:type*',
        // },
        {
          source: '/farm',
          destination: '/mines',
        },
        {
          source: '/bond',
          destination: '/bonds',
        },
        // {
        // source: '/summoner',
        //  destination: '/summoner',
        // },
        {
          source: '/me',
          destination: '/user',
        },
        {
          source: '/balances',
          destination: '/user',
        },
      ]
    },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
  network: {
    chainIds: [1, 250],
    defaultChainId: 250,
    domains: [
      {
        domain: 'soulswap.finance',
        defaultChainId: 1,
      },
      {
        domain: 'exchange.soulswap.finance',
        defaultChainId: 250,
      },
    ],
  },
  publicRuntimeConfig: {
    breakpoints: screens,
  },
}

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
