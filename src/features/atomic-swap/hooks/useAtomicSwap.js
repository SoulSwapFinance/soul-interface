import { ethers } from 'ethers'

import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { ZERO_ADDRESS, ATOMIC_SWAP_ADDRESS } from '../../../constants/addresses'
import { useAtomicSwapContract, useMulticallContract } from '../../../hooks/useContract'

const useAtomicSwap = () => {
  const { account, chainId } = useActiveWeb3React()
  const AS = useAtomicSwapContract()

  const viewTotalTrades = async () => {
    try {
      const result = await AS?.connect(account).totalTrades()
      return result
    } catch (err) {
      console.log(err)
      return err
    }
  }

  const viewTrade = async (tradeId) => {
    try {
      const result = await AS?.connect(account).viewTrade(tradeId)
      return result
    } catch (err) {
      console.log(err)
      return err
    }
  }

  const cancelTrade = async (tradeId) => {
    try {
      const result = await AS?.connect(account).cancelTrade(tradeId)
      return result
    } catch (err) {
      console.log(err)
      return err
    }
  }

  const acceptTrade = async (tradeId) => {
    try {
      await AS?.connect(account).acceptTrade(tradeId)
    } catch (err) {
      console.log(err)
      return err
    }
  }

  // current fee to create + accept a trade

  // purchase bypass to skip pass fees

  // returns trade offer

  // creator can accepts trade offer

  // create trade offer

  // cancel trade offer

  /**
   * @param {string} to
   * @param {uint256} duration : when the trade expires (if 0, unlimited time)
   * @param {Array<Object>} user1Tokens : givingTokens / lose
   * @param {Array<Object>} user2Tokens : gettingTokens / receive
   */
  const createTrade = async (to, duration, user1Tokens, user2Tokens) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    await provider.send('eth_requestAccounts', [])
    const account = await provider.getSigner()

    // const Multicall = await useMulticallContract(250);

    try {
      // const currentTime = await Multicall.blockTimestamp();
      console.log('====================================')
      console.log('user1Tokens', user1Tokens)
      console.log('user2Tokens', user2Tokens)
      await AS?.connect(account).createTrade(
        to,
        duration,
        user1Tokens,
        // multiple tokens example:
        // [
        //   ["0xD54Cf31D5653F4a062f5DA4C83170A5867d04442", 20, [0], [amount]],
        //   ["0xD54Cf31D5653F4a062f5DA4C83170A5867d04442", 20, [0], [amount]],
        //   ["0xD54Cf31D5653F4a062f5DA4C83170A5867d04442", 20, [0], [amount]],
        //   ["0xD54Cf31D5653F4a062f5DA4C83170A5867d04442", 20, [0], [amount]],
        //   ["0xD54Cf31D5653F4a062f5DA4C83170A5867d04442", 20, [0], [amount]],
        // ]
        user2Tokens
        // single token example:
        // [["0x0000000000000000000000000000000000000000", 0, [0], [0]]]
      )
    } catch (err) {
      console.log(err)
      // RPC transfer require statement error
      // if (err.code === -32603) {
      //   alert("Insufficient balance for transfer.");
      // } else {
      // alert(err.message);
      // }
      return err
    }
  }

  return {
    viewTotalTrades,
    viewTrade,
    cancelTrade,
    acceptTrade,
    createTrade,
  }
}

export default useAtomicSwap
