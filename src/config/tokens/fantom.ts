import { AVAX_ADDRESS, ChainId, DAI_ADDRESS, MULTI_AVAX_ADDRESS, MULTI_DAI_ADDRESS, Token } from 'sdk'

export const LZUSDC = new Token(ChainId.FANTOM, '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf', 6, 'lzUSDC', 'USDC (LayerZero)')
export const FMULTI = new Token(ChainId.FANTOM, '0xF386eB6780a1e875616b5751794f909095283860', 6, 'lzFMULTI', 'fMULTI (LayerZero)')
export const MUSDC = new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'mUSDC', 'USDC (Multichain)')
export const MDAI = new Token(ChainId.FANTOM, MULTI_DAI_ADDRESS[ChainId.FANTOM], 18, 'mDAI', 'DAI (Multichain)')
export const USDC = new Token(ChainId.FANTOM, '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4', 6, 'USDC', 'USD Coin (Axelar)')
export const MWBTC = new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'mWBTC', 'Wrapped Bitcoin (Multichain)')
export const WBTC = new Token(ChainId.FANTOM, '0x448d59B4302aB5d2dadf9611bED9457491926c8e', 8, 'WBTC', 'Wrapped Bitcoin (Axelar)')
export const DAI = new Token(ChainId.FANTOM, DAI_ADDRESS[ChainId.FANTOM], 18, 'DAI', 'DAI (Axelar)')
export const WETH = new Token(ChainId.FANTOM, '0xfe7eDa5F2c56160d406869A8aA4B2F365d544C7B', 18, 'WETH', 'Wrapped Ether (Axelar)')
export const MWETH = new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'mWETH', 'Wrapped Ether (Multichain)')
export const MIM = new Token(ChainId.FANTOM, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'MIM', 'Magic Internet Money')
export const ICE = new Token(ChainId.FANTOM, '0xf16e81dce15B08F326220742020379B855B87DF9', 18, 'ICE', 'IceToken')
export const SPELL = new Token(ChainId.FANTOM, '0x468003B688943977e6130F4F68F23aad939a1040', 18, 'SPELL', 'SpellToken')
export const BNB = new Token(ChainId.FANTOM, '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', 18, 'BNB', 'Binance')
export const AI = new Token(ChainId.FANTOM, '0x2598c30330D5771AE9F983979209486aE26dE875', 18, 'AI', 'AnyInu')
export const ENCHANT = new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment')
export const MPX = new Token(ChainId.FANTOM, '0x66eEd5FF1701E6ed8470DC391F05e27B1d0657eb', 18, 'MPX', 'Morphex')
export const THC = new Token(ChainId.FANTOM,
'0x479673391b3818f5e3ED2fa69A58e13d685BEcf6', 18, 'THC', 'Tinhatcat')
export const FUSD = new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD')
export const GRIMEVO = new Token(ChainId.FANTOM, '0x0a77866C01429941BFC7854c0c0675dB1015218b', 18, 'EVO', 'Grim EVO')
export const MAVAX = new Token(ChainId.FANTOM, MULTI_AVAX_ADDRESS[ChainId.FANTOM], 18, 'mAVAX', 'Avalanche (Multichain)')
export const AVAX = new Token(ChainId.FANTOM, AVAX_ADDRESS[ChainId.FANTOM], 18, 'AVAX', 'Avalanche (Axelar)')
export const SOUL = new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'Soul Power')
export const SEANCE = new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'Seance Circle')
export const USDT = new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'USDT', 'Frapped USDT')
