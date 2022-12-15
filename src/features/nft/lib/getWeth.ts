import { Provider } from '@ethersproject/abstract-provider'
import { BigNumber, Signer } from 'ethers'
import { Common } from 'nfnt-sdk'
import { useActiveWeb3React } from 'services/web3'

/**
 * Get a wETH contract instance and the signers wETH balance
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet,
 *  250 - Fantom Opera)
 * @param provider An abstraction to access the blockchain data
 * @param signer An Ethereum signer object
 * @returns A wETH contract instance and the signers wETH balance
 */
export default async function getWeth(
  chainId: ChainId,
  // provider: Provider,
  signer: Signer
) {
  
  
  try {
    const { library } = useActiveWeb3React()
    const provider = library.provider
    // @ts-ignore
    // const weth = new Common.Helpers.Weth(provider, chainId)
    const signerAddress = await signer.getAddress()
    // TODO NFT
    const balance = BigNumber.from(0) // BigNumber.from(await weth.getBalance(signerAddress))
    // return { weth, balance }
  } catch (err) {
    console.error(err)
  }

  return null
}
