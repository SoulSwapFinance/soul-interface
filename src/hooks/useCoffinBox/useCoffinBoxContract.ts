import { coffinBoxExports } from './coffinBoxExports'
import { ChainId } from 'sdk'
import { useContract, useProvider } from 'wagmi'

export const COFFINBOX_ADDRESS: Record<number, string> = {
  [ChainId.ETHEREUM]: '0xBC321C2e7A7FA48DcF0C09E088950C8172c2Ecc9',
  [ChainId.FANTOM]: '0xF539C37275e947F24480fAb9f7e302aE827570b2',
  [ChainId.AVALANCHE]: '0x51d7d0d03A9E38Ba550f24cea28B992AD2350fee',
}

export const getCoffinBoxContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    coffinBoxExports[chainId?.toString() as keyof Omit<typeof coffinBoxExports, '31337'>]?.[0]?.contracts?.CoffinBoxV1
      ?.address ?? '',
  contractInterface:
    coffinBoxExports[chainId?.toString() as keyof Omit<typeof coffinBoxExports, '31337'>]?.[0]?.contracts?.CoffinBoxV1
      ?.abi ?? [],
})

export function useCoffinBoxContract(chainId: number | undefined) {
  // return useContract<CoffinBoxV1>({
  return useContract({
    ...getCoffinBoxContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
