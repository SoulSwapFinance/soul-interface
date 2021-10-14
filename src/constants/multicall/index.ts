import { ChainId } from '../../sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xEd2Fb478f7fCef33E1E1d980a0135789B295a7F5', // 28 AUG
  [ChainId.FANTOM_TESTNET]: '0xef9777827a3581b64f5c7CB8954ccaE3cc2c46C0', // 7 JUL
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
