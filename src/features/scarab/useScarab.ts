import { useScarabContract, useTokenContract } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useToken } from '../../hooks/Tokens'

export default function useScarab() {
  const contract = useScarabContract()
  const tokenContract = useTokenContract()

  const lockSouls = useCallback(
    async (recipient: string, amount: BigNumber, unlockTimestamp: string) => {
      try {
        return await contract?.lockSouls(recipient, amount.toString(), unlockTimestamp)
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

  const getScarabsByTokenAddress = useCallback(
    async (token: string) => {
      try {
        const scarabsIds = await contract?.getDepositsByTokenAddress(token)
        const result = []
        if (scarabsIds.length > 0) {
          for (const id of scarabsIds) {
            const scarabInfo = await contract?.scarabs(id.toString())
            console.log('scarabInfo: ', scarabInfo)
            result.push({ id, ...scarabInfo })
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
  //       const scarabs = await contract?.getDepositsByTokenAddress(token)
  //       const result = []
  //       if (contract?.depositsCount > 0) {
  //         for (const id of scarabs) {
  //           const scarabInfo = await contract?.scarabs(id.toString())
  //           console.log('scarabInfo: ', scarabInfo)
  //           result.push({ id, ...scarabInfo })
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

  return { lockSouls, getScarabsByTokenAddress, withdrawTokens } // getDepositsByTokenAddress
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