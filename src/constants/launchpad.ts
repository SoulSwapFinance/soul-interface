import { ChainId } from '../sdk'

type ProjectsMap = { [id: number]: ProjectInfo }

export enum PROJECT_STATUS {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  COMPLETED = 'completed',
}

export type ProjectFeature = {
  title: string
  features: string[]
}

export type ProjectSocial = {
  title: string
  link: string
}

export type ProjectTokenomics = {
  title: string
  description: string
}

export type ProjectDetails = {
  title: string
  description: string
}

export type ProjectIDO = {
  title: string
  description: string
}

export type ProjectInfo = {
  status: PROJECT_STATUS
  name?: string
  description?: string
  symbol?: string
  logo?: string
  teaser?: string
  image?: string
  starts?: string
  startTime?: number
  endTime?: number
  startsOn?: string
  endsOn?: string
  raise?: number
  pairPrice?: number
  price?: number
  baseUrl?: string
  readmore?: string
  docs?: string
  website?: string
  tokenContract?: string
  launchpadContract?: string
  idoContract?: string
  highlights?: string[]
  features?: ProjectFeature[]
  socials?: ProjectSocial[]
  tokenomics?: ProjectTokenomics[]
  details?: ProjectDetails[]
  ido?: ProjectIDO[]
}

export const LAUNCHPAD_PROJECTS: ProjectsMap = {
  0: {
    name: 'Luxor Money',
    symbol: '$LUX',
    status: PROJECT_STATUS.UPCOMING,
    raise: 100000,
    price: 300,
    pairPrice: 205,
    baseUrl: '/launchpad/luxor',
    logo: '/images/launchpad/luxor/logo.png',
    teaser: '/images/launchpad/luxor/logo.png',
    // teaser: 'https://media.giphy.com/media/oXwWCXoPHaZeE/giphy.gif',
    // teaser: '/launchpad/luxor/logo.png',
    image: '/images/launchpad/luxor/logo.png',
    starts: 'July 4th, 2022',
    startTime: 1641578400,
    endTime: 1643738400,
    startsOn: 'July 4th 2022, 12:00 UTC',
    endsOn: 'August 31st 2022, 12:00 UTC',
    readmore: 'https://soulswapfinance.medium.com',
    // docs: 'https://luxor.soulswap.finance',
    // website: 'https://luxor.soulswap.finance',
    tokenContract: '0x6671e20b83ba463f270c8c75dae57e3cc246cb2b',
    launchpadContract: '0x739ff56D48A3aB7a29A3087E82EB985ee00895dF',
    highlights: [
      'This example exists for demonstration-purposes only.',
      'First decentralized, multichain reserve currency protocol available on the Fantom Opera Network.',
      '$LUX is a reserve currency backed by a basket of assets.',
      'Luxor Money is designed to build a policy-controlled currency system, native on the FTM network.',
      'There are two main strategies for market participants: staking and minting.',
    ],
    description:
      'Luxor is the first decentralized, multichain reserve currency protocol available on the Fantom Opera Network.',
    features: [
      {
        title: 'Staking',
        features: ['Stake $LUX for more LUX rebases'],
      },
      {
        title: 'Governance',
        features: [
          'Vote for new Luxor project partners',
          'Vote for community rewards',
        ],
      },
      {
        title: 'Earn',
        features: ['From using partner products', 'From games', 'For artwork voted on by the community'],
      },
    ],
    socials: [
      { title: 'Project Website', link: 'https://luxor.soulswap.finance' },
      { title: 'Token Explorer', link: 'https://tinyurl.com/ftmscan' },
      { title: 'DeFi Application', link: 'https://luxor.soulswap.finance' },
      { title: 'Twitter Profile', link: 'https://twitter.com/LuxorMoney' },
      { title: 'Official Telegram', link: 'https://t.me/SoulSwapDeFi' },
      { title: 'Official Discord', link: 'https://discord.gg/soulswap' },
      { title: 'Project Medium', link: 'https://soulswapfinance.medium.com/' },
      { title: 'Project Documentation', link: 'https://luxor.soulswap.finance' },
    ],
    details: [
      { title: 'Name', description: 'Luxor Money' },
      { title: 'Symbol', description: 'LUX' },
      { title: 'Blockchain', description: 'Fantom Opera' },
      { title: 'Discounted Price', description: '100 FTM' },
    ],
    tokenomics: [
      { title: 'Current Price', description: '$500' },
      { title: 'Circulating Supply', description: '1,000 LUX' },
      { title: 'Maximum Supply', description: '100,000 LUX' },
      { title: 'Fully Diluted MC', description: '$50,000,000' },
    ],
    ido: [
      { title: 'Total Available', description: '1,000 LUX' },
      { title: 'Launch Price', description: '100 FTM' },
      { title: 'Raise Target', description: '$100,000' },
      { title: 'Start Date', description: 'January 2022' },
      { title: 'End Date', description: 'February 2022' },
      { title: 'Pools', description: 'Basic, Unlimited' },
    ],
  },
}
