import { ChainId, Token } from 'sdk'

export const WETH = new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether')
export const JOE = new Token(ChainId.AVALANCHE, '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', 18, 'JOE', 'JoeToken')
export const USDC = new Token(ChainId.AVALANCHE, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USD Coin')
