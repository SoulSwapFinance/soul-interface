import { useManifesterContract, useTokenContract } from '../../hooks'
import { useCallback } from 'react'
import { MANIFESTER_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'

export default function useDefarm() {
  const contract = useManifesterContract()
  const { chainId } = useActiveWeb3React()

  const getDefarmByManifester = useCallback(
    async (manifester?: string) => {
      try {
        const manifestationId = await contract?.getManifestationsByManifester(MANIFESTER_ADDRESS[chainId])
        const result = []
        if (manifestationId.length > 0) {
          for (const id of manifestationId) {
            // const manifestationInfo = await contract?.mInfo(id.toString())
            const manifestationInfo = await contract?.getInfo(id.toString())
            // console.log('manifestationInfo: ', manifestationInfo)
            result.push({ id, ...manifestationInfo })
          }
        }
        return result
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { getDefarmByManifester }
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