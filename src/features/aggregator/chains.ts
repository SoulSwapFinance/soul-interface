import { chainIconUrl } from './utils';

const binance = {
  id: 56,
  name: 'Binance SmartChain',
  network: 'binance',
  iconUrl: chainIconUrl('binance'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://rpc.ankr.com/bsc',
  },
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://bscscan.com/' },
  },
  testnet: false,
};

const moonriver = {
  id: 1285,
  name: 'MoonRiver',
  network: 'moonriver',
  iconUrl: chainIconUrl('moonriver'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Moonriver',
    symbol: 'MOVR',
  },
  rpcUrls: {
    default: 'https://moonriver.public.blastapi.io',
  },
  blockExplorers: {
    default: {
      name: 'MoonScan',
      url: 'https://moonriver.moonscan.io/',
    },
  },
  testnet: false,
};

const avax = {
  id: 43114,
  name: 'AVAX',
  network: 'avax',
  iconUrl: chainIconUrl('avalanche'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: 'https://avalanche-evm.publicnode.com',
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
  },
  testnet: false,
};

const fantom = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  iconUrl: chainIconUrl('fantom'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: { name: 'FTMScan', url: 'https://ftmscan.com/' },
  },
  testnet: false,
};

const polygon = {
  id: 137,
  name: 'Polygon',
  network: 'polygon',
  iconUrl: chainIconUrl('polygon'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: 'https://rpc.ankr.com/polygon',
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://polygonscan.com/' },
  },
  testnet: false,
};

const arbitrum = {
  id: 42161,
  name: 'Arbitrum',
  network: 'arbitrum',
  iconUrl: chainIconUrl('arbitrum'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Arbitrum Ethereum',
    symbol: 'AETH',
  },
  rpcUrls: {
    default: 'https://rpc.ankr.com/arbitrum',
  },
};

const ethereum = {
  id: 1,
  name: 'Ethereum',
  network: 'ethereum',
  iconUrl: chainIconUrl('ethereum'),
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'https://rpc.ankr.com/eth',
  },
};

export const allChains = [
  ethereum,
  polygon,
  binance,
  fantom,
  avax,
  moonriver,
  arbitrum,
];