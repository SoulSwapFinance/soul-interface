import React, { useState } from 'react'
import { useActiveWeb3React } from 'services/web3'
import Typography from 'components/Typography'
import TokenTracker from 'token-tracker'
import { RPC } from 'connectors'
import { SOUL_ADDRESS, USDC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
import Eth from 'ethjs'
import { Button } from 'components/Button'


const Tracker = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const provider = library?.provider
  const eth = new Eth(new Eth.HttpProvider('https://rpcapi.fantom.network'))
  const [balance, setBalance] = useState(0)

    const tokenTracker = new TokenTracker({
    
      userAddress: account, // whose balance to track
      provider: eth.currentProvider, //  .provider,                  // a web3-style provider
      pollingInterval: 4_000,     // block polling interval (optional)
    
      // Tell it about the tokens to track:
      tokens: [
        {
          address: SOUL_ADDRESS[chainId], // tokenAddress
        }
      ],
    })


    const getBalances = async () => {
      const balances = tokenTracker?.serialize()

      console.log(balances[0])
      console.log('symbol: %s', balances[0]?.symbol)
  
    }
    
    // You can use this method to check the state of the tokens
    // You can also subscribe to updates
    tokenTracker.on('update', function (balances) {
      console.log(`Your balance of ${balances[0].symbol} is ${balances[0].string}`)
    })
    
    // You can add additional tokens after initialization:
    tokenTracker.add({ address: USDC_ADDRESS[chainId] })
    
    // Make sure to clean up, or it will hold a reference:
    tokenTracker.stop()
    return (
      <div>
        <Typography>
            {`hai ${account}`}
        </Typography>
        <Button
          onClick={() => getBalances()}
        >
          {`Get Balance`}
        </Button>
      </div>
    )
}

export default Tracker