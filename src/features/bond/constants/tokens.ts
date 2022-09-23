import { ChainId, AVAX_ADDRESS, FTM_ADDRESS, SEANCE_ADDRESS, DAI_ADDRESS, SOUL_ADDRESS
} from "sdk";

export const tokens = {
  SOUL: {
    4002: "0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5",
    250: SOUL_ADDRESS[ChainId.FANTOM],
    43114: SOUL_ADDRESS[ChainId.AVALANCHE],
  },
  SEANCE: {
    4002: "0xD54Cf31D5653F4a062f5DA4C83170A5867d04442",
    250: SEANCE_ADDRESS[ChainId.FANTOM],
    43114: '',
    // 43114: SEANCE_ADDRESS[ChainId.AVALANCHE],
  },
  FTM: {
    4002: "0xf1277d1ed8ad466beddf92ef448a132661956621",
    250: FTM_ADDRESS[ChainId.FANTOM],
    43114: '',
  },
  AVAX: {
    4002: "0xf1277d1ed8ad466beddf92ef448a132661956621",
    250: AVAX_ADDRESS[ChainId.FANTOM],
    43114: AVAX_ADDRESS[ChainId.AVALANCHE],
  },
  BNB: {
    4002: '',
    250: "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454",
    43114: '',
    // 43114: BNB_ADDRESS[ChainId.AVALANCHE],
  },
  DAI: {
    4002: '',
    250: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    43114: DAI_ADDRESS[ChainId.AVALANCHE],
  },
  USDC: {
    4002: "",
    250: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    43114: '',
    // 43114: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  WETH: {
    4002: "0x442993b05D170AE47af948FBF507B9972f26cA86",
    250: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    43114: '',
    // 43114: WETH_ADDRESS[ChainId.AVALANCHE],
  },
  WBTC: {
    4002: "0xd4cBf200850A79D5130c368f9D56592cfbE22179",
    250: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
    43114: '',
    // 43114: WBTC_ADDRESS[ChainId.AVALANCHE],
  }, 
};
