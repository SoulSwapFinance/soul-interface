const withTM = require('next-transpile-modules')(["@soulswapfinance/cross-chain-widget"]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/en/swap',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/autostake',
        destination: '/soul/autostake',
        permanent: true,
      },
      {
        source: '/farms',
        destination: '/summoner',
        permanent: true,
      },
      {
        source: '/farm',
        destination: '/summoner',
        permanent: true,
      },
      {
        source: '/bond',
        destination: '/bonds',
        permanent: true,
      },
      {
        source: '/defarm',
        destination: '/defarms',
        permanent: true,
      },
      {
        source: '/soul',
        destination: '/soul/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/soul/dashboard',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
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
          source: '/swap/:token*',
          destination: '/exchange/swap/:token*',
        },
        {
          source: '/limit/:token*',
          destination: '/exchange/swap/limit/:token*',
        },
        {
          source: '/aggregator/:token*',
          destination: '/exchange/aggregator/:token*',
        },
        {
          source: '/soul',
          destination: '/soul/dashboard',
        },
        {
          source: '/pool',
          destination: '/exchange/pool',
        },
        {
          source: '/bond',
          destination: '/bonds',
        },
        {
          source: '/user',
          destination: '/portfolio',
        },
        {
          source: '/find',
          destination: '/exchange/find',
        },
        {
          source: '/balances',
          destination: '/portfolio',
        },
        {
          source: '/farm',
          destination: '/summoner',
        },
        {
          source: '/farms',
          destination: '/summoner',
        },
        {
          source: '/autostake',
          destination: '/soul/autostake',
        },
        {
          source: '/analytics',
          destination: '/analytics/dashboard',
        },
        {
          source: '/dashboard',
          destination: '/soul/dashboard',
        },
        {
          source: '/me',
          destination: '/user',
        },
  ]},

  images: {
          domains: [
            'ftmscan.com',
            'snowtrace.io',
            'www.shutterstock.com',
            'cryptologos.cc',
            'soul.sh',
            'assets.soulswap.finance',
            'assets.coingecko.com',
            'media.giphy.com',
            'app.soulswap.finance',
            'exchange.soulswap.finance',
            'assets.sushi.com',
            'res.cloudinary.com',
            'cloudstorage.openocean.finance',
            'raw.githubusercontent.com',
            'avatars.githubusercontent.com',
            'logos.covalenthq.com',
            'pbs.twimg.com',
            'api.rango.exchange',
            'ethapi.openocean.finance'
          ],
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        },
}

// Please declare withTM as your last plugin (the outermost one)
// module.exports = withTM(nextConfig)
module.exports = withTM(nextConfig)

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.s', JSON.stringify(module.exports, null, 2))
