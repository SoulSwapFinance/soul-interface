import React, { useState } from 'react'
import { useActiveWeb3React } from 'services/web3'
import Typography from 'components/Typography'
import TokenTracker from 'token-tracker'
// import { RPC } from 'connectors'
import { SOUL_ADDRESS, USDC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
// import Eth from 'ethjs'
import { Button } from 'components/Button'
// import { TridentHeader } from 'layouts/Trident'


const Tracker = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const provider = library?.provider
  const [tracked, setTracked] = useState(0)
  const [loaded, setLoaded] = useState(false)
  // const eth = new Eth(new Eth.HttpProvider('https://rpcapi.fantom.network'))
  
  const tokenTracker = new TokenTracker({
    
    userAddress: account, // whose balance to track
    provider: provider, // eth.currentProvider,                 // a web3-style provider
    pollingInterval: 4_000,     // block polling interval (optional)
    // Tell it about the tokens to track:
    tokens: [
      {
        address: SOUL_ADDRESS[chainId], // tokenAddress
      },
      {
        address: USDC_ADDRESS[chainId], // tokenAddress
      }
    ],
  })
  
  let balances = tokenTracker?.serialize()
    
    const getBalances = async () => {
      if(loaded) return
      let tracked = balances.length
      setTracked(tracked)

      console.log({tracked})
      console.log('symbol: %s, balance %s, decimals: %s', balances[0]?.symbol, balances[0].balance, balances[0].decimals)
      setLoaded(true)
    }
    
    getBalances()

    return (
      <div className="grid grid-cols-1 gap-2">
        <Typography>
            {`Tracking ${tracked}`}
        </Typography>
        <Typography>
            {`${balances[0]?.symbol} ${tracked}`}
        </Typography>
        <Button
          onClick={() => getBalances()}
        >
          {`Get Balances`}
        </Button>
      </div>
    )
}

export default Tracker