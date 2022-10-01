import Container from 'components/Container'
import Typography from 'components/Typography'
import { useTokenInfo, useTotalSupply, } from 'hooks/useAPI'
import usePriceApi from 'hooks/usePriceApi'
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { formatNumber } from 'functions/format'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { getPrice } from 'hooks/useParaswap'
// import { useTokenBalances } from 'services/api/hooks'
// import { ChainId } from 'sdk'
// import capitalize from 'lodash/capitalize'

export default function Data() {
  // const { chainId, account } = useWeb3React()
  // const soulPrice = usePriceApi(SOUL_ADDRESS[ChainId.FANTOM])
  const { tokenInfo } = useTokenInfo(SOUL_ADDRESS[ChainId.FANTOM])
  // const { price }= usePriceUSD(SOUL_ADDRESS[ChainId.FANTOM])
  // const { supply }= useTotalSupply(SOUL_ADDRESS[ChainId.FANTOM])
  // const price = getPrice()//0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7, 0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e, 10000000000000000000, 43114)
  // const [tabIndex, setTabIndex] = useState(0)
  return (
    <Container id="chains-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="6xl">
      <div className="w-full max-w-6xl mx-auto">
        <Typography component="h1" variant="h1" className="w-full text-center mb-4">
        Token Information
        </Typography>
      <div className="grid grid-col mx-auto ">
      <Typography className="text-center">
        Price: ${Number(tokenInfo.price).toFixed(4)} <br/>
        Supply: {formatNumber((Number(tokenInfo.supply) / (10**Number(tokenInfo.decimals))), false, false, 2)} <br/>
        MCap: ${formatNumber(Number(tokenInfo.mcap), false, false, 2)} <br/>
      </Typography>
      <Typography className="text-center">
        {/* { `Price: ${price}` } <br/> */}
        {/* Supply: {formatNumber((Number(tokenInfo.supply) / (10**Number(tokenInfo.decimals))), false, false, 2)} <br/> */}
        {/* MCap: ${formatNumber(Number(tokenInfo.mcap), false, false, 2)} <br/> */}
      </Typography>
      </div>
      </div>
    </Container>
  )
}
