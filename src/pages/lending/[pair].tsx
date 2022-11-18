import Container from 'components/Container'
import { 
    useLendingMediumRiskLendingPair 
} from 'features/lending/hooks'
import { 
    LendingMarket, 
    // LendingMarketProvider, 
    // LendingMarketSkeleton 
} from 'features/lending/LendingMarket/LendingMarket'
import { useRedirectOnChainId } from 'hooks/useRedirectOnChainId'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface LendingPairPage {}

const LendingPairPage: FC<LendingPairPage> = () => {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const market = useLendingMediumRiskLendingPair(account, router.query.pair as string)

  useRedirectOnChainId('/lending')

  return (
    <Container maxWidth="lg" className="py-4 md:py-12 lg:py-[120px] px-2 mx-auto">
      {market &&
    //    ? (
        // <LendingMarketProvider market={market}>
          <LendingMarket />
        /* </LendingMarketProvider> */
    //   ) : (
        // <LendingMarketSkeleton />
    //   )
      }
    </Container>
  )
}

export default LendingPairPage