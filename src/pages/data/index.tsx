import Container from 'components/Container'
import Typography from 'components/Typography'
import { useArcherMinerTips, useTokenInfo, useTotalSupply, } from 'hooks/useAPI'
import usePriceApi from 'hooks/usePriceApi'
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { formatNumber } from 'functions/format'
// import { useTokenBalances } from 'services/api/hooks'
// import { ChainId } from 'sdk'
// import capitalize from 'lodash/capitalize'

export default function Data() {
  const { chainId, account } = useWeb3React()
  const soulPrice = usePriceApi('0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07')
  // const { data } = useArcherMinerTips()
  const { tokenInfo } = useTokenInfo('0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07')
  // const { price }= usePriceUSD('0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07')
  // const { supply }= useTotalSupply('0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07')
  
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
      </div>
      </div>
    </Container>
  )
}
