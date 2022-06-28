import { ChainId } from '../sdk'
import { ethers } from 'ethers'

type AddressMap = { [chainId in ChainId]: string }

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GENERIC_GAS_LIMIT_ORDER_EXECUTE = ethers.BigNumber.from(400000)

export const CONTRACT_SCAN = {
  [ChainId.ETHEREUM]: 'https://etherscan.io/address/',
  [ChainId.FANTOM]: 'https://ftmscan.com/address/',
  [ChainId.FANTOM_TESTNET]: 'https://testnet.ftmscan.com/address/',
}
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const ARCHER_ROUTER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x9917C083FF9FbD29Df1367FBF7F2388A9a202431',
  40: undefined,
  56: undefined,
  250: undefined,
  4002: undefined,
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LOTTERY_ADDRESS = {
  [ChainId.FANTOM]: "0x13A3Ff943CcA097C5eD90E1a15AF744ED89C77FE" 
}

export const SOR_ADDRESS = {
  [ChainId.FANTOM]: "0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A" 
}

export const SOR_MASTER_ADDRESS = {
  [ChainId.FANTOM]: "0x104b191008e56a0B79f25a828Ee18873AdD36C6c" 
  // [ChainId.FANTOM]: "0xfF1157CaCB174c012f68CDb0B7700597aae3D5A8" 
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
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ROUTER_ADDRESS = {
  [ChainId.ETHEREUM]: '0x2a8B48a8B8a8a8E4a184280333c418BcdcE72dE9', // FEB22
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
}

export const SOUL_VAULT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // TODO: UPDATE?
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SCARAB_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  // [ChainId.FANTOM]: '0xbc06b1115B272F4E217Ab2Ff33ad0efB873Be453', // 12 OCT
  // [ChainId.FANTOM]: '0x99Add9c96C2E547fE6628Fcfc72F346a07638120', // 12 OCT
  [ChainId.FANTOM]: '0xd07572CEA2cC0dd862aEB95581e3710084357A2b', // 13 OCT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SAFE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x497D86E79c28B5fffe7649C2EEE4D5E38bD9FdC2', // 23 DEC
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const TEAM_WALLET_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xd0744f7F9f65db946860B974966f83688D4f4630', // 23 DEC
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LOCKER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xd21fEDFC0AEf3c640B88FD0e3Ac87a31A8aC486B', // 29 NOV
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const CLAIM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xA121b64fd62a99869767650879C5bEc776415a45',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SUMMONER_ASSISTANT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x650e9c6A3c774be0A038294f57C44Fe51E9630d4',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SUMMONER_HELPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const FAUCET_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_SUMMONER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // 20 SEP,
  [ChainId.FANTOM_TESTNET]: '0x70C6A37244feD0Fa4e4148D5ffe38a209dCEd714', // 20 SEP
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_DAO_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1C63C726926197BD3CB75d86bCFB1DaeBcD87250',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUX_TREASURY_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xDF2A28Cc2878422354A93fEb05B41Bd57d71DB24',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUXOR_WARMUP_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x2B6Fe815F3D0b8C13E8F908A2501cdDC23D4Ed48',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ATOMIC_SWAP_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x7A2C9047085F413f259Bfa2d0E292AD725493F45', // 21 NOV,
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const TRIDENT: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // TODO: update
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  // [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  [ChainId.TELOS]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: undefined,
  [ChainId.MATIC]: undefined,
  [ChainId.ARBITRUM]: undefined,
  56: undefined,
  4002: undefined
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982',
  [ChainId.FANTOM]: '0xA121b64fd62a99869767650879C5bEc776415a45',
  [ChainId.TELOS]: '',
  [ChainId.AVALANCHE]: undefined,
  [ChainId.MATIC]: undefined,
  [ChainId.ARBITRUM]: undefined,
  56: undefined,
  4002: undefined
}

export const MULTICALL2_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a', // 29 AUG
  [ChainId.FANTOM_TESTNET]: '0x1ACB479bB9D1F73009F85ef5F495E942Bb57f15A', // 7 JUL
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

// TOKENS

export const SOUL_SEANCE_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_FTM_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const FTM_DAI_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_USDC_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SEANCE_USDC_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x98c678d3c7ebed4a36b84666700d8b5b5ddc1f79', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const FTM_USDC_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ETH_USD_PAIR: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // FTM-USDC
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const WNATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SEANCE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ENCHANT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', // ENCHANT
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUX_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', // LUX
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const WLUM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', // WLUM
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const GRIMEVO_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x0a77866C01429941BFC7854c0c0675dB1015218b', // GRIM EVO
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const AVAX_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212', // AVAX
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const FUSD_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const WETH_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // USDC
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const WBTC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const BNB_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const WFTM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const ANY_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xdDcb3fFD12750B45d32E084887fdf1aABAb34239', // ANY
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const CRV_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1E4F97b9f9F913c46F1632781732927B9019C68b', // CRV
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const UNIDX_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0', // UNIDX
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const GRIM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x7eC94C4327dC757601B4273cD67014d7760Be97E', // GRIM
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const REAPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x117dB78176C8eDe4F12fCd29d85Cd96b91A4cbBb', // REAPER
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const STOP_LIMIT_ORDER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6AaC28444cB227EC5D5cebe696882DeCcD50ee83', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const COFFIN_BOX_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF539C37275e947F24480fAb9f7e302aE827570b2', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const UNDERWORLD_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x94f2ae18250507506C77cefc14EE7B4b95d323B1', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOULSWAP_SWAPPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb2b22549F6586Cd81054677C6b9413Cea9587fd7', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOR_STAKING_REWARDS_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb2b22549F6586Cd81054677C6b9413Cea9587fd7', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOULSWAP_MULTISWAPPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xbA1d9DdC58bD750ab05217b1eDD864FDb495Ab57', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb988D44aF0065649E05e61B7d35b6121ff2b537E', // FEB22
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.ARBITRUM]: '',
}

export const PEGGED_ORACLE_ADDRESS = '0x287928938FC9c11c7D138778fB74c83223ca5CeA' // FEB22

export const SOULSWAP_TWAP_0_ORACLE_ADDRESS = '0x7a6d653B8248dA8d2DED372Ae6b3669bA1d81cFC' // FEB22

export const SOULSWAP_TWAP_1_ORACLE_ADDRESS = '0x7b00f395e20d07eD50f03FC61eE1e72Fd0D331d9' // FEB22

export const CHAINLINK_ORACLE_ADDRESS = {
  [ChainId.ETHEREUM]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xCDd5Df7146B278c90c572b6c6F933C6b7ce2b41e', // FEB22
}

export const SOUL_GUIDE_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '0x5A6B3Ce2736E9B731Fba73262884016b50c39184',
}
