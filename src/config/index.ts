import { ChainId } from 'sdk'

const config = {
  // Global configuration
  defaultChainId: ChainId.FANTOM,
  blockedAddresses: [
    // SDN OFAC addresses
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  ],
  // Network specific configuration
  [ChainId.ETHEREUM]: {
    averageBlockTimeInSeconds: 13,
    underworld: { blacklistedTokens: [], blacklistedOracles: ['0x8f2CC3376078568a04eBC600ae5F0a036DBfd812'] },
  },
  [ChainId.FANTOM]: {
    averageBlockTimeInSeconds: 1,
    underworld: { blacklistedTokens: [], blacklistedOracles: [] },
  },
  // [ChainId.MATIC]: {
  //   averageBlockTimeInSeconds: 13,
  //   underworld: { blacklistedTokens: ['0xC6d54D2f624bc83815b49d9c2203b1330B841cA0'], blacklistedOracles: [] },
  // },
}

export default config
