import React from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import styled from 'styled-components'
import Card from 'components/Card'
import Dots from 'components/Dots'
import GradientDot from 'components/GradientDot'
import Image from 'components/Image'
// import QuestionHelper from 'components/QuestionHelper'
import { Feature } from 'enums'
import { Borrow, PairTools, Repay, Strategy } from 'features/lending'
import { useUnderworldPairInfo, useUnderworldUserInfo } from 'hooks/useAPI'
import { formatNumber, formatPercent } from 'functions/format'
import NetworkGuard from 'guards/Network'
// import { useUSDCPrice } from 'hooks'
import { useToken } from 'hooks/Tokens'
import { useRedirectOnChainId } from 'hooks/useRedirectOnChainId'
import { useV2Pair } from 'hooks/useV2Pairs'
import Layout from 'layouts/Underworld'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { RecoilRoot } from 'recoil'
// import { e10 } from 'functions/math'
// import usePriceApi from 'hooks/usePriceApi'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { useUnderworldPair } from 'features/lending/hooks'

export default function Pair() {
  useRedirectOnChainId('/borrow')

  const router = useRouter()
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const pair = useUnderworldPair(router.query.pair as string)
  const { underworldPairInfo } = useUnderworldPairInfo(router.query.pair as string)
  const { underworldUserInfo } = useUnderworldUserInfo(router.query.pair as string)
  const cDecimals = Number(underworldPairInfo.collateralDecimals)
  const aDecimals = Number(underworldPairInfo.assetDecimals)
  const cDivisor = 10 ** cDecimals
  const aDivisor = 10 ** aDecimals
  const userCollateralBalance = Number(underworldUserInfo.userCollateralBalance) // √
  const userBorrowBalance = Number(underworldUserInfo.userBorrowPart) / aDivisor // √
  const assetPrice = Number(underworldPairInfo.assetPrice)
  const collateralPrice = Number(underworldPairInfo.collateralPrice)
  // const lpDecimals = Number(underworldPairInfo.decimals)
  // const assetAddress = underworldPairInfo.assetAddress

  // format tickers //
  const aTicker = underworldPairInfo.assetTicker
  const bTicker = underworldPairInfo.collateralTicker

  const assetSymbol
    = aTicker == 'WAVAX' ? 'AVAX'
      : aTicker == 'WFTM' ? 'FTM'
      : aTicker == 'WETH.e' ? 'ETH'
        : aTicker == 'WBTC.e' ? 'BTC'
          : aTicker
  const collateralSymbol
    = bTicker == 'WAVAX' ? 'AVAX'
      : bTicker == 'WFTM' ? 'FTM'
      : bTicker == 'WETH.e' ? 'ETH'
        : bTicker == 'WBTC.e' ? 'BTC'
          : bTicker

  // const assetSymbol = pair?.asset.tokenInfo.symbol
  const assetAddress = pair?.asset.tokenInfo.address
  const collateralAddress = pair?.collateral.tokenInfo.address
  const blockchain = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
  const assetURL = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${blockchain}/assets/${assetAddress}/logo.png`
  const collateralURL = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${blockchain}/assets/${collateralAddress}/logo.png`

  const userCollateralValue = userCollateralBalance * collateralPrice / cDivisor
  const userBorrowValue = userBorrowBalance * assetPrice
  const pairUtilization = userBorrowValue / Number(userCollateralValue) * 100
  const pairHealth = pairUtilization

  if (!pair) return <div />

  return (
    <PairLayout>
      <Head>
        <title>{i18n._(t`Borrow ${assetSymbol}-${collateralSymbol}`)} | Soul</title>
        <meta
          key="description"
          name="description"
          content={`Borrow ${assetSymbol} against ${collateralSymbol} collateral in the Underworld by Soul`}
        />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="border-b-8 bg-dark-purple border-purple">
            <div className="flex items-center">
              <div className="flex items-center mr-4 space-x-2">
                {pair && (
                  <>
                    <Image
                      height={48}
                      width={48}
                      src={assetURL}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={assetSymbol}
                    />

                    <Image
                      height={48}
                      width={48}
                      src={collateralURL}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={collateralSymbol}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-high-emphesis">
                    {`Borrow`} {pair && assetSymbol}
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Collateral`)}:</div>
                    <div className="mr-2 text-sm text-high-emphesis">{collateralSymbol}</div>
                    {/* <div className="mr-1 text-sm text-secondary">{i18n._(t`Oracle`)}:</div> */}
                    {/* <div className="text-sm text-high-emphesis">{pair.oracle.name}</div> */}
                  </div>
                </div>
              </div>
            </div>
          </Card.Header>
        }
      >
        <div className="flex justify-between p-4 mb-8 xl:p-0">
          <div>
            <div className="text-center text-md sm:text-lg text-secondary">{i18n._(t`Collateral`)}</div>
            <div className="text-center text-lg sm:text-2xl text-blue">
              {formatNumber(userCollateralBalance / cDivisor)} {collateralSymbol}
            </div>
            <div className="text-center text-md sm:text-lg text-high-emphesis">{formatNumber(userCollateralValue, true)}</div>
          </div>
          <div>
            <div className="text-center text-md sm:text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
            <div className="text-center texl-lg sm:text-2xl text-purple">
              {formatNumber(userBorrowBalance)} {assetSymbol}
            </div>
            <div className="items-center text-center flex justify-center text-md sm:text-lg text-high-emphesis">
              {formatPercent(pairHealth)}
              <GradientDot percent={pairHealth}></GradientDot>
            </div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-center text-md sm:text-lg text-secondary">{i18n._(t`Available`)}</div>
              <div className="text-lg sm:text-2xl text-high-emphesis">{formatPercent(75 - pairUtilization)}</div>
            </div>
            {/* <div>
              <div className="text-center text-md sm:text-lg text-secondary">{i18n._(t`APR`)}</div>
              <div className="text-lg sm:text-2xl text-high-emphesis">{formatPercent(pair.interestPerYear.string)}</div>
            </div> */}
          </div>
        </div>
        <Tab.Group>
          <Tab.List className="flex p-1 rounded bg-dark-800">
            <Tab
              className={({ selected }) =>
                `${selected ? 'bg-purple text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-1 py-1 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary hover:bg-dark-700 focus:outline-none`
              }
            >
              {i18n._(t`Borrow`)}
            </Tab>
            <Tab
              className={({ selected }) =>
                `${selected ? 'bg-purple text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-1 py-1 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary hover:bg-dark-700 focus:outline-none`
              }
            >
              {i18n._(t`Repay`)}
            </Tab>
          </Tab.List>
          <Tab.Panel>
            <Borrow pair={pair} />
          </Tab.Panel>
          <Tab.Panel>
            <Repay pair={pair} />
          </Tab.Panel>
        </Tab.Group>
      </Card>
    </PairLayout>
  )
}

Pair.Provider = RecoilRoot

const PairLayout = ({ children }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const pair = useUnderworldPair(router.query.pair as string)
  const { underworldPairInfo } = useUnderworldPairInfo(router.query.pair as string)

  const asset = useToken(pair?.asset.address)
  const collateral = useToken(pair?.collateral.address)
  const [pairState, liquidityPair] = useV2Pair(asset, collateral)
  const assetPrice = Number(underworldPairInfo.assetPrice)
  const collateralPrice = Number(underworldPairInfo.collateralPrice)

  // const assetPrice = usePriceApi(asset?.address)
  // const collateralPrice = usePriceApi(collateral?.address)
  const aDecimals = Number(underworldPairInfo.assetDecimals)
  const aDivisor = 10**aDecimals
  // const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  // format tickers //
  const aTicker = underworldPairInfo.assetTicker
  const bTicker = underworldPairInfo.collateralTicker

  const assetSymbol
    = aTicker == 'WAVAX' ? 'AVAX'
      : aTicker == 'WETH.e' ? 'ETH'
        : aTicker == 'WBTC.e' ? 'BTC'
          : aTicker
  const collateralSymbol
    = bTicker == 'WAVAX' ? 'AVAX'
      : bTicker == 'WETH.e' ? 'ETH'
        : bTicker == 'WBTC.e' ? 'BTC'
          : bTicker

  // const BORROW_IMG = "https://media.giphy.com/media/GgyKe2YYi3UR8HltC6/giphy.gif"

  return pair ? (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          // backgroundImage={ BORROW_IMG }
          title={i18n._(t`Add collateral in order to borrow assets`)}
          description={i18n._(
            t`Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.`
          )}
        />
      }
      right={
        <Card className="h-full p-4 bg-dark-900 xl:p-0">
          <div className="flex-col space-y-2">
            <div className="flex justify-between">
              <div className="text-xl text-high-emphesis">{`Market`}</div>
            </div>
            {/* <div className="flex justify-between">
              <div className="text-lg text-secondary">{`% APR`}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.interestPerYear.string)}</div>
              </div>
            </div> */}
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`% LTV`}</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Total Assets`}</div>
              <div className="text-lg text-high-emphesis">
                {formatNumber(pair?.totalAsset.base / aDivisor)} {assetSymbol}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Oracle`}</div>
              <div className="text-lg text-high-emphesis">
              {pair?.oracle.name}             
            </div>
            </div>
            <div className="flex justify-between">
              <div className="text-green text-lg text-secondary">{`Available`}</div>
              <div className="flex items-center">
                <div className="text-green text-lg text-high-emphesis">
                {formatPercent(100-
                ((pair?.totalAsset.base / aDivisor) -
                  (pair?.totalAsset.base.sub(pair?.totalBorrow.base) / aDivisor))
                  / (pair?.totalAsset.base / aDivisor) * 100
                )}
                </div>
              </div>
            </div>
            {/* <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Borrowed`}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis"> */}
            {/* AVAILABLE - TOTAL / TOTAL * 100 */}
            {/* {formatPercent(
                ((pair?.totalAsset.base.div(e10(18))) -
                  (pair?.totalAsset.base.sub(pair?.totalBorrow.base).div(e10(18))))
                  / (pair?.totalAsset.base.div(e10(18))) * 100
                )}</div>
              </div>
            </div> */}


            {/* <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{i18n._(t`Oracle`)}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-lg text-secondary">Name</div>
              <div className="text-lg text-high-emphesis">{pair?.oracle.name}</div>
            </div> */}
          
          {/* 
            <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{i18n._(t`CoffinBox`)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`${pair?.collateral.tokenInfo.symbol} Strategy`)}</div>
              <div className="flex flex-row text-lg text-high-emphesis">
                {pair.collateral.strategy ? (
                  i18n._(t`Active`)
                ) : (
                  <>
                    {i18n._(t`None`)}
                    <QuestionHelper
                      text={i18n._(
                        t`CoffinBox strategies can create yield for your liquidity while it is not lent out. This token does not yet have a strategy in the CoffinBox.`
                      )}
                    />{' '}
                  </>
                )}
              </div>
            </div> */}

            <div className="flex justify-between">
              <div className="text-xl mt-4 text-high-emphesis">{``}</div>
            </div>
            <PairTools pair={pair} />

            <Strategy token={pair.collateral} />

            {pair && pair.oracle.name === 'SoulSwap' && (
              <>
                <div className="flex justify-between pt-3">
                  <div className="text-xl text-high-emphesis">{i18n._(t`SLP`)}</div>
                </div>
                {liquidityPair ? (
                  <>
                    <div className="flex justify-between">
                      <div className="text-lg text-secondary">{liquidityPair?.token0.symbol}</div>
                      <div className="text-lg text-high-emphesis">{liquidityPair?.reserve0.toSignificant(4)}</div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-lg text-secondary">{liquidityPair?.token1.symbol}</div>
                      <div className="text-lg text-high-emphesis">{liquidityPair?.reserve1.toSignificant(4)}</div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-lg text-secondary">TVL</div>
                      <div className="text-lg text-high-emphesis">
                        {formatNumber(
                          liquidityPair?.reserve1
                            .multiply(assetPrice)
                            .add(liquidityPair?.reserve1.multiply(collateralPrice))
                            .toSignificant(4),
                          true
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Dots className="text-lg text-secondary">Loading</Dots>
                )}
              </>
            )}
          </div>
        </Card>
      }
    >
      {children}
    </Layout>
  ) : null
}

Pair.Guard = NetworkGuard(Feature.UNDERWORLD)