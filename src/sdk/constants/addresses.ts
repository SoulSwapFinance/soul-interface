import { AddressMap } from '../types'
import { ChainId } from '../enums/ChainId'

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x794d858b0b152fb68a5CE465451D729EFfA67f08', // FEB22
  [ChainId.TELOS]: '0x81582F803A17a4a454A80600e9185B42E32e0fcF',
  [ChainId.BSC]: '0xa9EC396a1b709689e98DaB9eAf4f18A913775d39',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '0x5BB2a9984de4a69c05c996F7EF09597Ac8c9D63a',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',}

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x2a8B48a8B8a8a8E4a184280333c418BcdcE72dE9', // FEB22
  [ChainId.TELOS]: '0xf9D9b96F213aCC6434f16fff5D932FA85cD179f3',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '0xa4594460A9d3D41e8B85542D34E23AdAbc3c86Ef',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',}

export const BORING_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x26bbB91Ade07f995E1c5D1F4A050639763F4C44b',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LIMIT_ORDER_HELPER_ADDRESS: AddressMap = {
  // [ChainId.MATIC]: '0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12',
  // [ChainId.AVALANCHE]: '0x889ec9e19C1598358899fCA4879011686c3d4045',
  [ChainId.ETHEREUM]: '0x75a5263bddD871E94188611f3563aabc833Cc005',
  [ChainId.FANTOM]: '0xd63E7D4eB9aB59bf85975c7100a5D92919C4E7E5', // FEB22
}

export const STOP_LIMIT_ORDER_ADDRESS: AddressMap = {
  // [ChainId.KOVAN]: '0xce9365dB1C99897f04B3923C03ba9a5f80E8DB87',
  // [ChainId.MATIC]: '0x1aDb3Bd86bb01797667eC382a0BC6A9854b4005f',
  // [ChainId.AVALANCHE]: '0xf6f9c9DB78AF5791A296c4bF34d59E0236E990E0',
  [ChainId.ETHEREUM]: '0x104734Ce12567421aC7B562e03Be2D75522cd112',
  [ChainId.FANTOM]: '0x6AaC28444cB227EC5D5cebe696882DeCcD50ee83', // FEB22
}

export const SOUL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '0xef9777827a3581b64f5c7CB8954ccaE3cc2c46C0',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOR_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SEANCE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const MASTERCHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const UNDERWORLD_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x94f2ae18250507506C77cefc14EE7B4b95d323B1', // Updated
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '0xE80922adb47964D096ca6F61c0BbC38d5bC218e2', // JUL10
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_CIRCLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5063Fc9D759B5b03DD5fBC0B882b5F68CF881C32', // Summoner
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const AUTO_STAKE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x083423C61B9373050e62E2A6Ec170e663F9c7BFa',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUX_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xdC7Bd8bA29ba99A250da6F0820ad9A1a285fE82a',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUXOR_STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf3F0BCFd430085e198466cdCA4Db8C2Af47f0802',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUXOR_STAKING_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x2Dd0D30f525e65641962904470660507e80940e4',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const CHANT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x083423C61B9373050e62E2A6Ec170e663F9c7BFa',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const COFFIN_BOX_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF539C37275e947F24480fAb9f7e302aE827570b2',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '0x51d7d0d03A9E38Ba550f24cea28B992AD2350fee',
[ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const CHAINLINK_ORACLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xCDd5Df7146B278c90c572b6c6F933C6b7ce2b41e', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '0x04BcdA3c65B2f28ADE0A40e9f2691681f531D20E', // JUL10
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ENCHANT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ENCHANT_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x62acBC5E5501374D6e462a095B48003Eaac3593C',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const AURA_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf4253A709733CdD8568542bD9eb4029516a0147A',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const REAPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const TIMELOCK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SUMMONER_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_GUIDE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5A6B3Ce2736E9B731Fba73262884016b50c39184', // JUL 27TH
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}
  
export const DEFAULT_RECEIVER_ADDRESS: AddressMap = {
  //   [ChainId.AVALANCHE]: '0x042c99C84b00f11A08a07AA9752E083261083A57',
    [ChainId.FANTOM]: '0x612D3c387c2A483084D68061c753Ce1AD4e88bb6', // FEB22
    [ChainId.ETHEREUM]: '0xf4943f2dEc7E4914067CdF4120E8A322bc8f5a36',
  }
  
export const ADVANCED_RECEIVER_ADDRESS: AddressMap = {
  //   [ChainId.AVALANCHE]: '0x50995361A1104B2E34d81771B2cf19BA55051C7c',
    [ChainId.FANTOM]: '0xd6AF3AAe2Aef4f1Acff9dD66f542ea863fBe9ae7', // FEB22
    [ChainId.ETHEREUM]: '0xA32e906C31093aDbe581B913e549f70fD2fD7969',
  }
  
export const ROUND_UP_RECEIVER_ADDRESS: AddressMap = {
  //   [ChainId.MATIC]: '0x1C9B033F8C46C08EbE67F15924F5B9E97e36E0a7'
  }

export const SOULSWAP_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.BSC]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.FANTOM]: '0xb2b22549F6586Cd81054677C6b9413Cea9587fd7', // FEB22
  [ChainId.AVALANCHE]: '0x9b16ec084B8b2cA1BBC9DB33166E5d9567a7257F', // JUL22
}

export const SOULSWAP_MULTISWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x545820d5Cc05248da112419fEfb18522c63C8e12',
  [ChainId.BSC]: '0x86c655cAc122e9A2fd9Ae1f79Df27b30E357968c',
  [ChainId.FANTOM]: '0xbA1d9DdC58bD750ab05217b1eDD864FDb495Ab57', // FEB22
}

export const SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0x1B16149Edaf1EFa6ADE6aEEF33e63C6e08c9bB1B',
  [ChainId.FANTOM]: '0xb988D44aF0065649E05e61B7d35b6121ff2b537E', // FEB22
}

export const PRICE_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x51445B73852952128bFCAE65fdd889881D8d87Bd',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const HARVEST_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb9e5f6152b797280c8C3427947780ce5c4a55b08',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.TELOS]: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [ChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [ChainId.AVALANCHE]: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
}

export const DAI_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [ChainId.FANTOM]: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  [ChainId.BSC]: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  [ChainId.AVALANCHE]: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70'
}

export const GRIMEVO_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x0a77866C01429941BFC7854c0c0675dB1015218b'
}

export const LUM_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c'
}

export const USD_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: USDC_ADDRESS[ChainId.ETHEREUM],
  [ChainId.TELOS]: USDC_ADDRESS[ChainId.TELOS],
  [ChainId.FANTOM]: USDC_ADDRESS[ChainId.FANTOM],
  [ChainId.BSC]: USDC_ADDRESS[ChainId.BSC],
  [ChainId.AVALANCHE]: USDC_ADDRESS[ChainId.AVALANCHE],
}

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.TELOS]: '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
  [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  [ChainId.AVALANCHE]: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: WETH9_ADDRESS[ChainId.ETHEREUM],
  [ChainId.TELOS]: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [ChainId.FANTOM_TESTNET]: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
}