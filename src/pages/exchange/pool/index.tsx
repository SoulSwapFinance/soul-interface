import { CurrencyAmount, NATIVE, SOUL_ADDRESS } from '../../../sdk'
import React, { useMemo } from 'react'
import { classNames, currencyId } from '../../../functions'
// import { toV2LiquidityToken, useTrackedTokenPairs } from '../../../state/user/hooks'

import { Button } from '../../../components/Button'
import Container from '../../../components/Container'
import Dots from '../../../components/Dots'
import Empty from '../../../components/Empty'
import FullPositionCard from '../../../components/PositionCard'
import Head from 'next/head'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import DoubleGlowShadowV2 from '../../../components/DoubleGlowShadowV2'
import NavLink from 'components/NavLink'
import { useV2PairsWithLiquidity } from 'features/trident/migrate/context/useV2PairsWithLiquidity'

export default function Pool() {
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
  const { loading, pairs } = useV2PairsWithLiquidity(chainId)

  return (
    <>
      <Head>
        <title>{`Pool`} | Soul</title>
        <meta
          key="description"
          name="description"
          content="Soul liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
      </Head>

      {/* <SoulLogo /> */}
      {/* <br /> <br /> */}
      <DoubleGlowShadowV2 opacity="0.6">
        <Container maxWidth="2xl" className="space-y-3 mt-12">
          {/* <Alert
          title={`Liquidity Provider Rewards`}
          message={`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity at any time.`}
          type="information"
        /> */}

          <div className="p-4 space-y-2 bg-dark-900 rounded bg-dark-1200">
            {/* <div className="p-4 mb-00 space-y-3"> */}
              {/* <div className="text-center">
                <Typography component="h1" variant="h2">
                  {`Liquidity Positions`}
                </Typography>
              </div> */}
            <div
              // className={`w-full grid grid-cols-2 p-4 rounded rounded-2xl border border-2 border-purple`}
            >
          {/* <div
              className={`flex m-6 border-4 p-4 border-dark-800 rounded-2xl`}
            > */}
              {/* <Image src={POOL_BANNER}
                height={180}
                width={720}
                alt={'pool banner'}
              /> */}
          {/* </div> */}
            </div>
            <div className="flex mb-4 items-center justify-center">
              <Button variant="filled" color="purple" size="lg">
                <NavLink href={'/info/dashboard'}>
                  <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                    View Account Analytics <span> ↗</span>
                  </a>
                </NavLink>
              </Button>
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
                    onClick={() => router.push(`/exchange/add/${currencyId(NATIVE[chainId])}/${SOUL_ADDRESS[chainId]}`)}
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
