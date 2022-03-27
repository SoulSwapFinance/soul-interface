import { ChainId } from '../../sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.BSC]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.FANTOM]: '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a', // 28 AUG
  [ChainId.FANTOM_TESTNET]: '0xef9777827a3581b64f5c7CB8954ccaE3cc2c46C0', // 7 JUL
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
