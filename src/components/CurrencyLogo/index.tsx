// import { ETHER_ADDRESS, NETWORKS_INFO } from 'constants/index'
// import { useAllTokens } from 'hooks/Tokens'
// import { ChainId } from 'sdk'
export { default as CurrencyLogo } from './CurrencyLogo'
export { default as CurrencyLogoArray } from './CurrencyLogoArray'

// export const useGetNativeTokenLogo = (chainId: ChainId | undefined) => {
//     const whitelistTokens = useAllTokens(false, chainId)
//     return whitelistTokens[ETHER_ADDRESS]?.logoURI || (chainId ? NETWORKS_INFO[chainId].nativeToken.logo : '')
//   }