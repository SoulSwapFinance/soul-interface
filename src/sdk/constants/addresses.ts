import { AddressMap } from '../types'
import { ChainId } from '../enums/ChainId'
// import { WNATIVE } from 'sdk'

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x794d858b0b152fb68a5CE465451D729EFfA67f08', // FEB22
  [ChainId.TELOS]: '0x81582F803A17a4a454A80600e9185B42E32e0fcF',
  [ChainId.BSC]: '0xa9EC396a1b709689e98DaB9eAf4f18A913775d39',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.AVALANCHE]: '0x5BB2a9984de4a69c05c996F7EF09597Ac8c9D63a',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',}

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x2a8B48a8B8a8a8E4a184280333c418BcdcE72dE9', // FEB22
  [ChainId.TELOS]: '0xf9D9b96F213aCC6434f16fff5D932FA85cD179f3',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.AVALANCHE]: '0xa4594460A9d3D41e8B85542D34E23AdAbc3c86Ef',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const JOE_ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const BORING_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x26bbB91Ade07f995E1c5D1F4A050639763F4C44b',
  [ChainId.AVALANCHE]: '0x78b02521057adc0124C12dDB99De167fC65a9198', // OCT22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const LIMIT_ORDER_HELPER_ADDRESS: AddressMap = {
  // [ChainId.MATIC]: '0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12',
  // [ChainId.AVALANCHE]: '0x889ec9e19C1598358899fCA4879011686c3d4045',
  [ChainId.ETHEREUM]: '0x75a5263bddD871E94188611f3563aabc833Cc005',
  [ChainId.FANTOM]: '0xd63E7D4eB9aB59bf85975c7100a5D92919C4E7E5', // FEB22
}

export const MIM_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x82f0B8B456c1A451378467398982d4834b6829c1',
}

export const JOE_ADDRESS: AddressMap = {
  [ChainId.AVALANCHE]: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
}

export const STOP_LIMIT_ORDER_ADDRESS: AddressMap = {
  // [ChainId.KOVAN]: '0xce9365dB1C99897f04B3923C03ba9a5f80E8DB87',
  // [ChainId.MATIC]: '0x1aDb3Bd86bb01797667eC382a0BC6A9854b4005f',
  // [ChainId.AVALANCHE]: '0xf6f9c9DB78AF5791A296c4bF34d59E0236E990E0',
  [ChainId.ETHEREUM]: '0x104734Ce12567421aC7B562e03Be2D75522cd112',
  [ChainId.FANTOM]: '0x6AaC28444cB227EC5D5cebe696882DeCcD50ee83', // FEB22
}

export const SOUL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x34862060EFF6DA2AF04D382C209a433279377d16', // SEP22
  [ChainId.TELOS]: '0xef9777827a3581b64f5c7CB8954ccaE3cc2c46C0',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07',
  [ChainId.AVALANCHE]: '0x11d6DD25c1695764e64F439E32cc7746f3945543', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const CRV_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1E4F97b9f9F913c46F1632781732927B9019C68b',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOR_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const FUSD_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SEANCE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.AVALANCHE]: '0x97Ee3C9Cf4E5DE384f95e595a8F327e65265cC4E', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const UNDERWORLD_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x94f2ae18250507506C77cefc14EE7B4b95d323B1', // Updated
  [ChainId.AVALANCHE]: '0xE80922adb47964D096ca6F61c0BbC38d5bC218e2', // JUL22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982',
  [ChainId.FANTOM]: '0xA121b64fd62a99869767650879C5bEc776415a45',
  [ChainId.TELOS]: '',
  [ChainId.AVALANCHE]: undefined,
  [ChainId.MATIC]: undefined,
  [ChainId.ARBITRUM]: undefined,
  [ChainId.MOONRIVER]: undefined,
  56: undefined,
  4002: undefined
}

export const SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  // [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM]: '0xb898226dE3c5ca980381fE85F2Bc10e35e00634c', // V2
  [ChainId.AVALANCHE]: '0xB1e330401c920077Ddf157AbA5594238d36b54B1', // V2
  // [ChainId.AVALANCHE]: '0x090D4911Db910efaA498f9b97b8999FbE7A41Dd7', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const MANIFESTER_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x1E786a13C97a333A445c89487985A9eBDebe0c97',
  // [ChainId.AVALANCHE]: '',
}

export const MASTERCHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: SUMMONER_ADDRESS[ChainId.FANTOM],
  [ChainId.AVALANCHE]: SUMMONER_ADDRESS[ChainId.AVALANCHE],
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_CIRCLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5063Fc9D759B5b03DD5fBC0B882b5F68CF881C32',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const AUTO_STAKE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb844360d6CF54ed63FBA8C5aD06Cb00d4bdf46E0',
  [ChainId.AVALANCHE]: '0x5647Ed56e3781D490182fcEaf090f9b43c7322c3', // V2
  // [ChainId.AVALANCHE]: '0xD191F9C5Bd60c9b2239E321C37a2397269170D61',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUX_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xdC7Bd8bA29ba99A250da6F0820ad9A1a285fE82a',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUXOR_STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf3F0BCFd430085e198466cdCA4Db8C2Af47f0802',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUXOR_STAKING_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x2Dd0D30f525e65641962904470660507e80940e4',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const BTC_NATIVE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '0x8C162C3Bdd7354b5Cb1A0b18eDBB5725CFE762A3',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const ETH_NATIVE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: undefined,
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '0x5796Bf89f6C7C47811E4E59Ecd7aCACC8A5B9dEF',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const USDC_DAI_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '0xE9807645aDA66F2f3d4f2d2A79223701F3cC0903',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const WLUM_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const LUX_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const CHANT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb844360d6CF54ed63FBA8C5aD06Cb00d4bdf46E0',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_BOND_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xEdaECfc744F3BDeAF6556AEEbfcDedd79437a01F',
  [ChainId.AVALANCHE]: '0x6385BFD7A981021fF07845b2e7fDdD02901E25ea', // V2
  // [ChainId.AVALANCHE]: '0x4161A44D71F68852d6b013a9C6BF968d3b08D9b7',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const MULTICALL_ADDRESS: { [chainId in ChainId]: string } = {
  // [ChainId.ETHEREUM]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.ETHEREUM]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a',
  [ChainId.AVALANCHE]: '0x2E138E5cAFfa287b4d96CD4b34A0Fb180Ae7eB84',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const UNDERWORLD_PAIRS = {
  [ChainId.FANTOM]: [
    // ACTIVE //
    '0xc5Ae8847C868898f68EF0227B6c4865dFcCe0D65',   // FTM-USDC
    '0x29a72C8d81815787B886E9fc9d763406C796DD73',   // USDC-FTM
    '0x0a55Eb040C5183c5784A03F34bCEb3963f52b5a0',   // USDC-ETH
    '0x91787338E8fF91D0B36E54Fa5A50046d6C797D5B',   // USDC-BTC
    '0x9e17f37d807B211306C7354605FAAa308c3683EB',   // USDC-BNB
    '0x5C900Ac3c95D13adE54D28A9800636AE21Cb5F39',   // USDC-LINK
    
    // INACTIVE //
    '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',     // FTM-DAI
    '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',     // DAI-FTM
    '0x9fA5de19495331E13b443F787B90CdD22B32263d',     // DAI-ETH
    '0xaf28730165634A56434ca7f0B302CC54F862046F',     // DAI-BTC
    '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',     // DAI-BNB
  ],
    [ChainId.AVALANCHE]: [
    // ACTIVE //
    '0x7ef603f01Ffa9D21c9ee8159AF4adFbE78DC925B',   // AVAX-USDC
    '0xa34fe600E6349d67fcd6989A9c4007b5ee5A494B',   // USDC-AVAX
    '0xD981D3e065bA8E89Ac56DB994D86F22dA409cf20',   // USDC-ETH
    '0x142c9eE960bB6AD872f22712C4b129783999c35E',    // USDC-BTC
    '0x90b666E3149aDB70F937429Caa1d8D316Eb81b16'    // USDC-LINK

  ]
}

export const ACTIVE_UNDERWORLD_PAIRS = {
  [ChainId.FANTOM]: [
    // ACTIVE //
    '0xc5Ae8847C868898f68EF0227B6c4865dFcCe0D65',   // FTM-USDC
    '0x29a72C8d81815787B886E9fc9d763406C796DD73',   // USDC-FTM
    '0x0a55Eb040C5183c5784A03F34bCEb3963f52b5a0',   // USDC-ETH
    '0x91787338E8fF91D0B36E54Fa5A50046d6C797D5B',   // USDC-BTC
    '0x9e17f37d807B211306C7354605FAAa308c3683EB',   // USDC-BNB
    '0x5C900Ac3c95D13adE54D28A9800636AE21Cb5F39',   // USDC-LINK
  ],

  [ChainId.AVALANCHE]: [
    // ACTIVE //
    '0x7ef603f01Ffa9D21c9ee8159AF4adFbE78DC925B',   // AVAX-USDC
    '0xa34fe600E6349d67fcd6989A9c4007b5ee5A494B',   // USDC-AVAX
    '0xD981D3e065bA8E89Ac56DB994D86F22dA409cf20',   // USDC-ETH
    '0x142c9eE960bB6AD872f22712C4b129783999c35E',    // USDC-BTC
    '0x90b666E3149aDB70F937429Caa1d8D316Eb81b16'    // USDC-LINK
  ]
}

export const COFFIN_BOX_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0xBC321C2e7A7FA48DcF0C09E088950C8172c2Ecc9',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF539C37275e947F24480fAb9f7e302aE827570b2',
  [ChainId.AVALANCHE]: '0x51d7d0d03A9E38Ba550f24cea28B992AD2350fee',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_X_SWAP_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x64f2e9dA58C3B521Ef2564FC68FBFA5E32A2a5df', // OCT22
  [ChainId.AVALANCHE]: '0x4f1B22481E83D222969daE360B0C83C656900B11', // OCT22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const CHAINLINK_ORACLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xCDd5Df7146B278c90c572b6c6F933C6b7ce2b41e', // FEB22
  [ChainId.AVALANCHE]: '0x04BcdA3c65B2f28ADE0A40e9f2691681f531D20E', // JUL10
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const ENCHANT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const LINK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8',
  [ChainId.AVALANCHE]: '0x5947BB275c521040051D82396192181b413227A3',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const ENCHANT_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x62acBC5E5501374D6e462a095B48003Eaac3593C',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const AURA_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xec3F962238cC6D45aEc0f97D0f150e221Ef3C42C',
  [ChainId.AVALANCHE]: '0x268D3D63088821C17c59860D6B9476680a4843d2', // V2
  // [ChainId.AVALANCHE]: '0x385cC4Ce661a32891919153676efd4E208AAc3Bc', // SEP22
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const TIMELOCK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SUMMONER_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const REFUNDER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x0346AE83d549Ff90f15036925bc817707644bFE2', // FEB23
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const SOUL_GUIDE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5A6B3Ce2736E9B731Fba73262884016b50c39184', // JUL 27TH
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const BALANCES_FETCHER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x386a4B75578C7843A6082EFe181D5d629236C047', // todo
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0x9d6c13Bc5269E553C4697767b4c267FB33Dd8d1A', // todo
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '0xF0c5eCe120dbbe540121eAa65Ba206e511cdE021', // SEP22
  [ChainId.MATIC]: '0x06a846BA430Ed005bE60f8598B4C563dbaa6feF0', // todo
  [ChainId.MOONRIVER]: '',
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

export const MARKET_UPDATER_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0xc192abffe9617a545acb20ea22d495200845b425',
  [ChainId.AVALANCHE]: '0x489037544121C5407706a838c36280Cefad8BBce',
}

export const SOULSWAP_MULTISWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x545820d5Cc05248da112419fEfb18522c63C8e12',
  [ChainId.BSC]: '0x86c655cAc122e9A2fd9Ae1f79Df27b30E357968c',
  [ChainId.FANTOM]: '0xbA1d9DdC58bD750ab05217b1eDD864FDb495Ab57', // FEB22
  [ChainId.AVALANCHE]: '0x5a5aB985039F7BF51A2157c99b9b245D65b25BF8', // OCT22
}

export const SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '0x1B16149Edaf1EFa6ADE6aEEF33e63C6e08c9bB1B',
  [ChainId.FANTOM]: '0xb988D44aF0065649E05e61B7d35b6121ff2b537E', // FEB22
  [ChainId.AVALANCHE]: '0xbDA06F519DB2DB8141d5Cac47D7AEa66ed8Dd326', // OCT22
}

export const SOULSWAP_TWAP_0_ORACLE_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x7a6d653B8248dA8d2DED372Ae6b3669bA1d81cFC', // FEB22
  [ChainId.AVALANCHE]: '0x82769332eFFcC20F6494887A417397a4e2518a68', // OCT22
}

export const SOULSWAP_TWAP_1_ORACLE_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x7b00f395e20d07eD50f03FC61eE1e72Fd0D331d9', // FEB22
  [ChainId.AVALANCHE]: '0xc6CE6E4163ca4a42c67b0ac4ae70A75A0cAe898e', // OCT22
}

export const BOND_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x8226D02356eC72Bcb61A19c3c67f3e053Ae5758e',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const PRICE_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x51445B73852952128bFCAE65fdd889881D8d87Bd',
  [ChainId.AVALANCHE]: '0xbc83454171005a8eFd6aad89b637dDeB18473497',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const HARVEST_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb9e5f6152b797280c8C3427947780ce5c4a55b08',
  [ChainId.AVALANCHE]: '',
  [ChainId.MATIC]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.ARBITRUM]: '',
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.TELOS]: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [ChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [ChainId.MATIC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [ChainId.AVALANCHE]: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  [ChainId.MOONRIVER]: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
}

export const USDT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.FANTOM]: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  [ChainId.BSC]: '',
  [ChainId.MATIC]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.MOONRIVER]: '',
}

export const WETH_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  [ChainId.BSC]: '',
  [ChainId.MATIC]: '',
  [ChainId.AVALANCHE]: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  [ChainId.MOONRIVER]: '',
}

export const WBTC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.TELOS]: '',
  [ChainId.FANTOM]: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
  [ChainId.BSC]: '',
  [ChainId.MATIC]: '',
  [ChainId.AVALANCHE]: '0x50b7545627a5162F82A992c33b87aDc75187B218',
  [ChainId.MOONRIVER]: '',
}

export const DAI_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [ChainId.FANTOM]: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  [ChainId.BSC]: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  [ChainId.AVALANCHE]: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
  [ChainId.MOONRIVER]: '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844',
  [ChainId.MATIC]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
}

export const GRIMEVO_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x0a77866C01429941BFC7854c0c0675dB1015218b'
}

export const LUM_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c'
}

export const AVAX_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
}

export const BNB_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
  [ChainId.AVALANCHE]: '0x264c1383EA520f73dd837F915ef3a732e204a493',
}

export const USD_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: USDC_ADDRESS[ChainId.ETHEREUM],
  [ChainId.TELOS]: USDC_ADDRESS[ChainId.TELOS],
  [ChainId.FANTOM]: USDC_ADDRESS[ChainId.FANTOM],
  [ChainId.BSC]: USDC_ADDRESS[ChainId.BSC],
  [ChainId.AVALANCHE]: USDC_ADDRESS[ChainId.AVALANCHE],
  [ChainId.MOONRIVER]: USDC_ADDRESS[ChainId.MOONRIVER],
  [ChainId.MATIC]: USDC_ADDRESS[ChainId.MATIC],
}

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.TELOS]: '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
  [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  [ChainId.AVALANCHE]: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  [ChainId.MATIC]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [ChainId.MOONRIVER]: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: WETH9_ADDRESS[ChainId.ETHEREUM],
  [ChainId.TELOS]: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  [ChainId.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
  [ChainId.MATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
}

export const FTM_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
  [ChainId.FANTOM]: WNATIVE_ADDRESS[ChainId.FANTOM]
}

export const GELATO_PINE_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x05Ad1094Eb6Cde564d732196F6754Ee464896031',
}

export const OPEN_OCEAN_EXCHANGE_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x6352a56caadC4F1E25CD6c75970Fa768A3304e64',
  [ChainId.AVALANCHE]: '0x6352a56caadC4F1E25CD6c75970Fa768A3304e64',
}
// LP TOKEN ADDRESS //

export const LUX_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0x951BBB838e49F7081072895947735b0892cCcbCD',
}

export const SOUL_USDC: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
  [ChainId.AVALANCHE]: '0x922fcADa825Dc669798206A35D2D2B455f9A64E7' // SEP22
}

export const SOUL_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
  [ChainId.AVALANCHE]: '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00' // SEP22
}

export const LINK_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0x8cE4baC1bD4399579C2F6f44653dC4B065f93193',
  [ChainId.AVALANCHE]: ''
}

export const DAI_USDC: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '',
  [ChainId.AVALANCHE]: '0xE9807645aDA66F2f3d4f2d2A79223701F3cC0903' // SEP22
}

export const BTC_USDC: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6',
  [ChainId.AVALANCHE]: '0xd413F437F998dE70413d9D9840825156bb32941c'
}

export const ETH_USDC: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0x5b181BBc3Cc18C66B6f36f584866a1ff09865630',
  [ChainId.AVALANCHE]: '0x351C6327F9639664C7962B94570D1A19F47b3f44'
}

export const ETH_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
  [ChainId.AVALANCHE]: '0x5796Bf89f6C7C47811E4E59Ecd7aCACC8A5B9dEF' // SEP22
}

export const USDC_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
  [ChainId.AVALANCHE]: '0x864384a54ea644852603778c0C200eF2D6F2Ac2f' // SEP22
}

export const BTC_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
  [ChainId.AVALANCHE]: '0x8C162C3Bdd7354b5Cb1A0b18eDBB5725CFE762A3' // SEP22
}

export const LUX_DAI: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0x46729c2AeeabE7774a0E710867df80a6E19Ef851',
}

export const BNB_NATIVE: AddressMap = {
  [ChainId.ETHEREUM]: '',
  [ChainId.FANTOM]: '0x52966a12e3211c92909C28603ca3df8465c06c82',
  [ChainId.AVALANCHE]: '0xB3074D8b7f22439F337E2E2830864be9c8236866', // SEP22
}

export const LUX_SOR: AddressMap = {
  [ChainId.FANTOM]: '0x622E69B6785311800B0d55D72fF27D91F5518212',
}

export const FUSD_NATIVE: AddressMap = {
  [ChainId.FANTOM]: '0x1AE16105a7d4bE7DFD9737FD13D9A50AEFed1437',
}

export const DAI_NATIVE: AddressMap = {
  [ChainId.FANTOM]: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
  [ChainId.AVALANCHE]: '0xEF1D48b24E87F8ccfF97f7C295B31B92E30F372B',
}

export const WLUM_NATIVE: AddressMap = {
  [ChainId.FANTOM]: '0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99',
}
export const SOR_FTM: AddressMap = {
  [ChainId.FANTOM]: '0xdfB2218b48627794711E6cFd72e26c541E456F6F',
}
export const SOR_NATIVE: AddressMap = {
  [ChainId.FANTOM]: '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A',
}
export const BTC_ETH: AddressMap = {
  [ChainId.FANTOM]: '0x1FC954d3484bC21E0Ce53A6648a35BBfc03DC9D0',
}
export const AVAX_NATIVE: AddressMap = {
  [ChainId.FANTOM]: '0x5159Ba92FDC80b3a4B19De279711b1822de06c86',
}


// LENDING PAIRS //
export const NATIVE_DAI_MARKET: AddressMap = {
  [ChainId.FANTOM]: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
}


export const DAI_ETH_MARKET: AddressMap = {
  [ChainId.FANTOM]: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
}

export const DAI_NATIVE_MARKET: AddressMap = {
  [ChainId.FANTOM]: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
}

export const DAI_BTC_MARKET: AddressMap = {
  [ChainId.FANTOM]: '0xaf28730165634A56434ca7f0B302CC54F862046F',
}

export const DAI_BNB_MARKET: AddressMap = {
  [ChainId.FANTOM]: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
}

export const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";