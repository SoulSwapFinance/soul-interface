import { useSafeContract, useTokenContract } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useToken } from '../../hooks/Tokens'

export default function useSafe() {
  const contract = useSafeContract()
  const tokenContract = useTokenContract()

  const lockSouls = useCallback(
    async (soulAddress: string, grimAddress: string, recipient: string, amount: BigNumber) => {
      try {
        return await contract?.lockSouls(
          soulAddress, 
          grimAddress,
          recipient, 
          amount.toString()
        )
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const withdrawTokens = useCallback(
    async (id: string) => {
      try {
        return await contract?.withdrawTokens(id)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const getSoulByGrimAddress = useCallback(
    async (token: string) => {
      try {
        const safesIds = await contract?.getDepositsByTokenAddress(token)
        const result = []
        if (safesIds.length > 0) {
          for (const id of safesIds) {
            const safeInfo = await contract?.safes(id.toString())
            console.log('safeInfo: ', safeInfo)
            result.push({ id, ...safeInfo })
          }
        }
        return result
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract, tokenContract]
  )
  

  // const getDepositsByTokenAddress = useCallback(
  //   async (token: string) => {
  //     try {
  //       const safes = await contract?.getDepositsByTokenAddress(token)
  //       const result = []
  //       if (contract?.depositsCount > 0) {
  //         for (const id of safes) {
  //           const safeInfo = await contract?.safes(id.toString())
  //           console.log('safeInfo: ', safeInfo)
  //           result.push({ id, ...safeInfo })
  //         }
  //       }
  //       return result
  //     } catch (e) {
  //       console.error(e)
  //       return e
  //     }
  //   },
  //   [contract]
  // )

  return { lockSouls, getSoulByGrimAddress, withdrawTokens } // getDepositsByTokenAddress
}

// import { useLockerContract, } from '../../hooks'


//   const contract = useLockerContract()
//   const tokenContract = useTokenContract()


//   const withdrawTokens = useCallback(
//     async (id: string) => {
//       try {
//         return await contract?.withdrawTokens(id)
//       } catch (e) {
//         console.error(e)
//         return e
//       }
//     },
//     [contract]
//   )

//   const getLockersByTokenAddress = useCallback(
//     async (token: string) => {
//       try {
//         const lockersIds = await contract?.getDepositsByTokenAddress(token)
//         const result = []
//         if (lockersIds.length > 0) {
//           for (const id of lockersIds) {
//             const lockerInfo = await contract?.lockedToken(id.toString())
//             result.push({ id, ...lockerInfo })
//           }
//         }
//         return result
//       } catch (e) {
//         console.error(e)
//         return e
//       }
//     },
//     [contract, tokenContract]
//   )

//   return { lockTokens, getLockersByTokenAddress, withdrawTokens }
// }