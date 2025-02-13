import React from 'react'
import { ChainId, CurrencyAmount, NATIVE, SOUL_ADDRESS } from '../../../sdk'
import { classNames, currencyId } from '../../../functions'
import { Button } from '../../../components/Button'
import Container from '../../../components/Container'
import Dots from '../../../components/Dots'
import Empty from '../../../components/Empty'
import FullPositionCard from '../../../components/PositionCard'
import Head from 'next/head'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import DoubleGlowShadowV2 from '../../../components/DoubleGlowShadowV2'
import Image from 'next/image'
import POOL_BANNER from 'assets/branding/pool-banner.png'
import { useV2PairsWithLiquidity } from 'features/trident/migrate/context/useV2PairsWithLiquidity'

const Pool = ({ }) => {
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
  const { loading, pairs } = useV2PairsWithLiquidity(chainId)

  return (
    <>
      <Head>
        <meta
          key="description"
          name="description"
          content=""
        />
        <title>Pool | SoulSwap</title>
        {/* <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
        <meta name="description" content="Soul liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta name="twitter:site" content="@SoulSwapFinance" />
        <meta property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:description" content="Soul liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades." />
      </Head>

      <DoubleGlowShadowV2 opacity="0.6">
        <Container maxWidth="2xl" className="space-y-3 mt-12">
          <div className="p-4 space-y-2 bg-dark-900 rounded bg-dark-1200">
            <div>
              <div
                className={`flex border-4 h-[120px] sm:h-[162px] p-4 border-dark-800 rounded-2xl`}
              >
                <Image
                  src={POOL_BANNER}
                  height={180}
                  width={720}
                  alt={'pool banner'}
                />
              </div>
            </div>
            <div className="grid grid-flow-row gap-3">
              <div className="mb-1 mt-1" />
              {loading ? (
                <Empty>
                  <Dots>{`Loading`}</Dots>
                </Empty>
              ) : pairs?.length > 0 ? (
                <>
                  {pairs?.map((v2Pair) => (
                    <FullPositionCard
                      chainId={chainId}
                      key={v2Pair.liquidityToken.address}
                      pair={v2Pair}
                      stakedBalance={CurrencyAmount.fromRawAmount(v2Pair.liquidityToken, '0')}
                    />
                  ))}
                </>
              ) : (
                <Empty className="flex text-lg text-center text-low-emphesis">
                  <div className="px-4 py-2">{`Add Liquidity & Earn Fees (0.25%)`}</div>
                </Empty>
              )}
              {account && (
                <div className={classNames('grid gap-4', 'grid-cols-2')}>
                  <Button
                    id="add-pool-button"
                    variant="filled"
                    color="gradient"
                    className="grid items-center justify-center grid-flow-col gap-2 whitespace-nowrap"
                    onClick={() => router.push(`/exchange/add/${currencyId(NATIVE[chainId ?? ChainId.FANTOM])}/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}`)}
                  >
                    {`Add`}
                  </Button>
                  <Button
                    id="add-pool-button"
                    variant="filled"
                    color="gradient"
                    onClick={() => router.push(`/exchange/find`)}
                  >
                    {`Import`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </DoubleGlowShadowV2>
    </>
  )
}

export default Pool
