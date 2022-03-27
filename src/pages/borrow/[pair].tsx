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
import QuestionHelper from 'components/QuestionHelper'
import { Feature } from 'enums'
import { Borrow, PairTools, Repay, Strategy } from 'features/lending'
import { useUnderworldPair } from 'features/lending/hooks'
import { formatNumber, formatPercent } from 'functions/format'
import NetworkGuard from 'guards/Network'
import { useUSDCPrice } from 'hooks'
import { useToken } from 'hooks/Tokens'
import { useRedirectOnChainId } from 'hooks/useRedirectOnChainId'
import { useV2Pair } from 'hooks/useV2Pairs'
import Layout from 'layouts/Underworld'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { RecoilRoot } from 'recoil'
import { e10 } from 'functions/math'
import usePriceApi from 'hooks/usePriceApi'

export default function Pair() {
  useRedirectOnChainId('/borrow')

  const router = useRouter()
  const { i18n } = useLingui()

  const pair = useUnderworldPair(router.query.pair as string)
  const userCollateralBalance = Number(pair?.userCollateralShare / 1e18) // √
  const userBorrowBalance = Number(pair?.currentUserBorrowAmount.string / 1e18) // √
  const collateralPrice = usePriceApi(pair?.collateral.address)
  const borrowPrice = usePriceApi(pair?.asset.address)
  const userCollateralValue = userCollateralBalance * collateralPrice
  const userBorrowValue = userBorrowBalance * borrowPrice
  const pairUtilization = userBorrowValue * 10**(pair?.collateral.tokenInfo.decimals) / Number(userCollateralValue) * 100
  const pairHealth = pairUtilization

  if (!pair) return <div />

  return (
    <PairLayout>
      <Head>
        <title>{i18n._(t`Borrow ${pair?.asset?.symbol}-${pair?.collateral?.symbol}`)} | Soul</title>
        <meta
          key="description"
          name="description"
          content={`Borrow ${pair?.asset?.symbol} against ${pair?.collateral?.symbol} collateral in the Underworld by Soul`}
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
                      src={pair.asset.tokenInfo.logoURI}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={pair.asset.tokenInfo.symbol}
                    />

                    <Image
                      height={48}
                      width={48}
                      src={pair.collateral.tokenInfo.logoURI}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={pair.collateral.tokenInfo.symbol}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-high-emphesis">{i18n._(t`Borrow ${pair.asset.tokenInfo.symbol}`)}</div>
                  <div className="flex items-center">
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Collateral`)}:</div>
                    <div className="mr-2 text-sm text-high-emphesis">{pair.collateral.tokenInfo.symbol}</div>
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Oracle`)}:</div>
                    <div className="text-sm text-high-emphesis">{pair.oracle.name}</div>
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
              {formatNumber(userCollateralBalance)} {pair.collateral.tokenInfo.symbol}
            </div>
            <div className="text-center text-md sm:text-lg text-high-emphesis">{formatNumber(userCollateralValue, true)}</div>
          </div>
          <div>
            <div className="text-center text-md sm:text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
            <div className="text-center texl-lg sm:text-2xl text-purple">
            {formatNumber(pair.currentUserBorrowAmount.string)} {pair.asset.tokenInfo.symbol}
            </div>
            <div className="items-center text-center flex justify-center text-md sm:text-lg text-high-emphesis">
              { formatPercent(pairHealth) }
              <GradientDot percent={pairHealth}></GradientDot>
            </div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-center text-md sm:text-lg text-secondary">{i18n._(t`Available`)}</div>
              <div className="text-lg sm:text-2xl text-high-emphesis">{formatPercent(75-pairUtilization)}</div>
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
                `${
                  selected ? 'bg-purple text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-1 py-1 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary hover:bg-dark-700 focus:outline-none`
              }
            >
              {i18n._(t`Borrow`)}
            </Tab>
            <Tab
              className={({ selected }) =>
                `${
                  selected ? 'bg-purple text-high-emphesis' : ''
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
  const asset = useToken(pair?.asset.address)
  const collateral = useToken(pair?.collateral.address)
  const [pairState, liquidityPair] = useV2Pair(asset, collateral)
  const assetPrice = usePriceApi(asset?.address)
  const collateralPrice = usePriceApi(collateral?.address)
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
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`% APR`}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.interestPerYear.string)}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`% LTV`}</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Total Assets`}</div>
              <div className="text-lg text-high-emphesis">
              {formatNumber(pair?.totalAsset.base.div(e10(18)))} {pair?.asset.tokenInfo.symbol}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-green text-lg text-secondary">{`Available`}</div>
              <div className="flex items-center">
                <div className="text-green text-lg text-high-emphesis">
                {formatPercent(100-
                ((pair?.totalAsset.base.div(e10(18))) -
                  (pair?.totalAsset.base.sub(pair?.totalBorrow.base).div(e10(18))))
                  / (pair?.totalAsset.base.div(e10(18))) * 100
                )}</div>
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

            {/* <PairTools pair={pair} /> */}

            <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{i18n._(t`Oracle`)}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-lg text-secondary">Name</div>
              <div className="text-lg text-high-emphesis">{pair?.oracle.name}</div>
            </div>

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
            </div>

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