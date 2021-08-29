// import { useEffect, useMemo } from 'react'
// import { useActiveWeb3React } from './useActiveWeb3React'
// import { ChainId } from '@soulswap/sdk'
// import { useAnyswapEthOperaBridge } from "./useContract";
// import { useCallback } from 'react'
// import { useTransactionAdder } from '../state/transactions/hooks'
// import { ApprovalState } from './useApproveCallback'

// // bridge
// // import anyswapEthOperaBridge_ABI from '../constants/abis/soulswap/bridge/anyswapEthOperaBridge.json'

// const useBridge = () => {
//     const { account } = useActiveWeb3React()
//   const addTransaction = useTransactionAdder()
//   const anyswapContract = useAnyswapEthOperaBridge(true)

// // const { anyswapContract } = useContract(
// //     '0x5cbe98480a790554403694b98bff71a525907f5d', 
// //     anyswapEthOperaBridge_ABI, 
// //     withSignerIfPossible
// //   );

//   useEffect(() => {
//     if (account && anyswapContract) {
//         fetchAllowance()
//     }
//       const refreshInterval = setInterval(fetchAllowance, 10000)
//     return () => clearInterval(refreshInterval)
//   }, [account, anyswapContract])

//   const approvalState = useMemo(() => {
//     if (!account) return ApprovalState.UNKNOWN
//     if (pendingApproval) return ApprovalState.PENDING
//     if (!allowance || Number(allowance) === 0) return ApprovalState.NOT_APPROVED

//     return approvalState.APPROVED
//   }, [account])

//     const approve = useCallback(async () => {
//     try {
//       setPendingApproval(true)

//       let tx
//         tx = await anyswapContract?.approve(anyswapContract?.address, ethers.constants.MaxUint256.toString())

//       addTransaction(tx, { summary: 'Approve' })
//       await tx.wait()
//       return tx
//     } catch (e) {
//       return e
//     } finally {
//       setPendingApproval(false)
//     }
//   }, [addTransaction, anyswapContract])

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const swapOut = useCallback(async (amount) => {

//     if (ChainId.MAINNET) {
//       try {
//         const result = anyswapContract?.Swapout(amount);
//         return result;
//       } catch (err) {
//         console.log(err);
//         return err;
//       }
//     } else {
//       console.warn('not connected to ETHEREUM MAINNET (ChainId: 1)')
//       alert('not connected to ETHEREUM MAINNET (ChainId: 1)')
//     }
//   })

//   return {
//     swapOut,
//   };
// }
//   export default useBridge