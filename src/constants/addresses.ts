import { ChainId } from '../sdk'
import { ethers } from 'ethers'

type AddressMap = { [chainId in ChainId]: string }

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GENERIC_GAS_LIMIT_ORDER_EXECUTE = ethers.BigNumber.from(400000)

export const CONTRACT_SCAN = {
  [ChainId.ETHEREUM]: 'https://etherscan.io/address/',
  [ChainId.FANTOM]: 'https://ftmscan.com/address/',
  [ChainId.AVALANCHE]: 'https://snowtrace.io/address/',
}
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const ARCHER_ROUTER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x9917C083FF9FbD29Df1367FBF7F2388A9a202431',
  40: undefined,
  56: undefined,
  250: undefined,
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const LOTTERY_ADDRESS = {
  [ChainId.FANTOM]: "0x13A3Ff943CcA097C5eD90E1a15AF744ED89C77FE" 
}

export const SWAP_INFO_ADDRESS = {
  [ChainId.FANTOM]: "0x357DbCb3d327029F20EC5Eda1c7508b5e37608eB" 
}

export const SPOOKY_ROUTER_ADDRESS = {
  [ChainId.FANTOM]: "0xF491e7B69E4244ad4002BC14e878a34207E38c29" 
}

export const SPIRIT_ROUTER_ADDRESS = {
  [ChainId.FANTOM]: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52" 
}

export const SOR_ADDRESS = {
  [ChainId.FANTOM]: "0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A" 
}

export const SOR_MASTER_ADDRESS = {
  [ChainId.FANTOM]: 
  // "0xfF1157CaCB174c012f68CDb0B7700597aae3D5A8" 
  "0x104b191008e56a0B79f25a828Ee18873AdD36C6c"
}

export const SOR_MINTER_ADDRESS = {
  [ChainId.FANTOM]: "0x046050f879E2fa5f60dd472da61d542B443B0603" 
}

export const LUX_MINTER_ADDRESS = {
  [ChainId.FANTOM]: "0xCc801658bD51Fe42Ac07078572112630a868c1eb" 
}

export const SOULSWAPEX_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x36049D479A97CdE1fC6E2a5D2caE30B666Ebf92B',
}

export const LIMIT_ORDER_MODULE_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x037fc8e71445910e1E0bBb2a0896d5e9A7485318',
  [ChainId.FANTOM]: "0xf2253BF9a0BD002300cFe6f4E630d755669f6DCa",
}

export const FACTORY_ADDRESS = {
  [ChainId.ETHEREUM]: '0x794d858b0b152fb68a5CE465451D729EFfA67f08', // FEB22
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0xa9EC396a1b709689e98DaB9eAf4f18A913775d39',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.AVALANCHE]: '0x5BB2a9984de4a69c05c996F7EF09597Ac8c9D63a',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ROUTER_ADDRESS = {
  [ChainId.ETHEREUM]: '0x2a8B48a8B8a8a8E4a184280333c418BcdcE72dE9', // FEB22
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.AVALANCHE]: '0xa4594460A9d3D41e8B85542D34E23AdAbc3c86Ef',
}

export const SCARAB_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  // [ChainId.FANTOM]: '0xbc06b1115B272F4E217Ab2Ff33ad0efB873Be453', // OCT21
  // [ChainId.FANTOM]: '0x99Add9c96C2E547fE6628Fcfc72F346a07638120', // OCT21
  [ChainId.FANTOM]: '0xd07572CEA2cC0dd862aEB95581e3710084357A2b', // OCT21
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SAFE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x497D86E79c28B5fffe7649C2EEE4D5E38bD9FdC2', // DEC21
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const TEAM_WALLET_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xd0744f7F9f65db946860B974966f83688D4f4630', // 23 DEC
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const CLAIM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xA121b64fd62a99869767650879C5bEc776415a45',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SUMMONER_ASSISTANT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x650e9c6A3c774be0A038294f57C44Fe51E9630d4',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SUMMONER_HELPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const FAUCET_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SOUL_DAO_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1C63C726926197BD3CB75d86bCFB1DaeBcD87250',
  [ChainId.AVALANCHE]: '0xf551D88fE8fae7a97292d28876A0cdD49dC373fa',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const LUX_TREASURY_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xDF2A28Cc2878422354A93fEb05B41Bd57d71DB24',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const LUXOR_WARMUP_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x2B6Fe815F3D0b8C13E8F908A2501cdDC23D4Ed48',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ATOMIC_SWAP_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x7A2C9047085F413f259Bfa2d0E292AD725493F45', // 21 NOV,
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const TRIDENT: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // TODO: update
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xF1025eb0071Bed98C56ED1a39A47D913c49312F8',
  // [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  [ChainId.TELOS]: '',
  [ChainId.FANTOM]: '0x936bdb9218d7f6d7ef95fafe3f0ded0220229d74',
  [ChainId.AVALANCHE]: '0x594C7137Ac541C9F3954169bB018548761986E8B',
  [ChainId.MATIC]: undefined,
  [ChainId.ARBITRUM]: undefined,
  [ChainId.MOONRIVER]: undefined,
  56: undefined
}

export const MULTICALL2_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a', // 29 AUG
  [ChainId.AVALANCHE]: '0x2E138E5cAFfa287b4d96CD4b34A0Fb180Ae7eB84',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ONCHAIN_AGGREGATOR_ORACLE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '', //
  [ChainId.AVALANCHE]: '0x9632e2b35F901E372939d59C3509747C641F7693', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const OFFCHAIN_AGGREGATOR_ORACLE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '', //
  [ChainId.AVALANCHE]: '0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

// TOKENS //
export const SOUL_SEANCE_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b', // 01 OCT
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SOUL_FTM_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57', // 01 OCT
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const FTM_DAI_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b', // 01 OCT
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SOUL_USDC_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SEANCE_USDC_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x98c678d3c7ebed4a36b84666700d8b5b5ddc1f79', // 01 OCT
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const FTM_USDC_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // 01 OCT
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ETH_USD_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // FTM-USDC
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const WNATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SOUL_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x34862060EFF6DA2AF04D382C209a433279377d16', // SEP22
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
  [ChainId.AVALANCHE]: '0x11d6DD25c1695764e64F439E32cc7746f3945543', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SEANCE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.AVALANCHE]: '0x97Ee3C9Cf4E5DE384f95e595a8F327e65265cC4E', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const SURV_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5d9EaFC54567F34164A269Ba6C099068df6ef651', // MAR23
  [ChainId.AVALANCHE]: '', //
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ENCHANT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', // ENCHANT
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const LUX_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', // LUX
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const WLUM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', // WLUM
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const GRIMEVO_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x0a77866C01429941BFC7854c0c0675dB1015218b', // GRIM EVO
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const AVAX_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212', // AVAX
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
  [ChainId.AVALANCHE]: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const FUSD_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const WETH_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: WNATIVE_ADDRESS[ChainId.ETHEREUM],
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
  [ChainId.AVALANCHE]: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const WBTC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
  [ChainId.AVALANCHE]: '0x50b7545627a5162F82A992c33b87aDc75187B218',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const BNB_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
  [ChainId.AVALANCHE]: '0x264c1383EA520f73dd837F915ef3a732e204a493',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const WFTM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.AVALANCHE]: undefined,
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const ANY_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xdDcb3fFD12750B45d32E084887fdf1aABAb34239', // ANY
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const CRV_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1E4F97b9f9F913c46F1632781732927B9019C68b', // CRV
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const LINK_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8', // LINK
  [ChainId.AVALANCHE]: '0x5947BB275c521040051D82396192181b413227A3',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

export const UNIDX_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x95b3497bBcCcc46a8F45F5Cf54b0878b39f8D96C',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0', // UNIDX
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}

// UNDERWORLD ADDRESSES //
export const STOP_LIMIT_ORDER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6AaC28444cB227EC5D5cebe696882DeCcD50ee83', // FEB22
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}




export const SOR_STAKING_REWARDS_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb2b22549F6586Cd81054677C6b9413Cea9587fd7', // FEB22
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.MOONRIVER]: '',
}
export const PEGGED_ORACLE_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x287928938FC9c11c7D138778fB74c83223ca5CeA', // FEB22
  [ChainId.AVALANCHE]: '0x82035c90EBE56adbfd9A927b515Aaf455CE0Bf68',
}

export const SOUL_GUIDE_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
}

export const NATIVE = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
