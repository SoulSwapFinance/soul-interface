import { useManifesterContract } from '../../hooks'
import { useCallback } from 'react'
// import { useActiveWeb3React } from 'services/web3'

export default function useDefarm() {
  const contract = useManifesterContract()
  // const { chainId } = useActiveWeb3React()

  const getDefarmByManifester = useCallback(
    async (manifester?: string) => {
      try {
        const manifestationId = await contract?.getManifestations()
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
