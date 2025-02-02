// import { getAddress, isAddress } from '@ethersproject/address'
import { UseQueryOptions } from '@tanstack/react-query'
// import { parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { ChainId } from 'sdk'

type UsePrices = ({
  chainId,
  options,
}: {
  chainId?: ChainId
  options?: UseQueryOptions<string, unknown, Record<string, number> | undefined, string[]>
}) => Pick<ReturnType<any>
  // <typeof useQuery>
  , 'isLoading' | 'isError'> & { data: Record<string, any> | undefined }

export const usePrices = ({
  chainId,
  options,
}: {
  chainId?: number
  options?: Omit<
    UseQueryOptions<Record<string, number>, unknown, Record<string, number>, string[]>,
    'queryKey' | 'queryFn' | 'initialData'
  >
}) => {
  const queryKey = useMemo(() => [`https://token-price.sushi.com/v0/${chainId}`], [chainId ?? ChainId.FANTOM])
  // const {
  //   data: pricesMap,
  //   isError,
  //   isLoading,
  // } = 
  // useQuery(
    // queryKey,
    // () => fetch(`https://token-price.sushi.com/v0/${chainId}`).then((response) => response.json()),
    // @ts-ignore
    // { staleTime: 20000, enabled: Boolean(chainId), ...options }
  // )

  return useMemo(() => {
    return {
      // isError,
      // isLoading,
      // data:
      //   pricesMap && !isError && !isLoading
      //     ? Object.entries(pricesMap).reduce<Record<string, Fraction>>((acc, [address, price]) => {
      //         if (isAddress(address)) {
      //           acc[getAddress(address)] = new Fraction(
      //             parseUnits(price.toFixed(18), 18).toString(),
      //             parseUnits('1', 18).toString()
      //           )
      //         }

      //         return acc
      //       }, {})
          // :
           undefined,
    }
  }, 
  // [isError, isLoading, pricesMap]
  )
}
