import { soulXSwapExports } from './soulXSwapExports'
// import { soulxswap } from 'soulswap-soulxswap/typechain'
import { useContract, useProvider, useSigner } from 'wagmi'

export const getsoulxswapContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    soulXSwapExports[chainId?.toString() as keyof Omit<typeof soulXSwapExports, '31337'>]?.[0]?.contracts?.SoulXSwap
      ?.address ?? '',
  contractInterface:
    soulXSwapExports[chainId?.toString() as keyof Omit<typeof soulXSwapExports, '31337'>]?.[0]?.contracts?.SoulXSwap
      ?.abi ?? [],
})

export function usesoulxswapContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  // return useContract<soulxswap>({
  return useContract({
    ...getsoulxswapContractConfig(chainId),
    signerOrProvider,
  })
}

export function usesoulxswapContractWithProvider(chainId: number | undefined) {
  const provider = useProvider({ chainId })
  // return useContract<soulxswap>({
  return useContract({
    ...getsoulxswapContractConfig(chainId),
    signerOrProvider: provider,
  })
}
