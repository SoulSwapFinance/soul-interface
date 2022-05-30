import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'components/Card'
import Dots from 'components/Dots'
import Image from 'components/Image'
import QuestionHelper from 'components/QuestionHelper'
import { Feature } from 'enums'
import { useUnderworldPairAddresses, useUnderworldPairs } from 'features/lending/hooks'
import ListHeaderWithSort from 'features/lending/components/ListHeaderWithSort'
import MarketHeader from 'features/lending/components/MarketHeader'
import { useUnderworldLendPositions } from 'features/portfolio/AssetBalances/underworld/hooks'
import { formatNumber, formatPercent } from 'functions/format'
import NetworkGuard from 'guards/Network'
import { useInfiniteScroll } from 'hooks/useInfiniteScroll'
import useSearchAndSort from 'hooks/useSearchAndSort'
import Layout from 'layouts/Underworld'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RecoilRoot } from 'recoil'
// import { e10 } from 'functions/math'
import { useUnderworldPairInfo, useUnderworldUserInfo } from 'hooks/useAPI'

// const BORROW_IMG = "https://media.giphy.com/media/GgyKe2YYi3UR8HltC6/giphy.gif"

export default function Lend() {
  const { i18n } = useLingui()

  const addresses = useUnderworldPairAddresses()

  const pairs = useUnderworldPairs(addresses)

  const positions = useUnderworldLendPositions(pairs)
  console.log('Underworld Pairs', pairs)

  const data = useSearchAndSort(
    pairs,
    // pairs.filter((pair: any) => pair.userCollateralShare.gt(0) || pair.userBorrowPart.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentSupplyAPR.valueWithStrategy', direction: 'descending' }
  )

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(data.items)

  return (
    <LendLayout>
      <Head>
        <title>Lend | Soul</title>
        <meta
          key="description"
          name="description"
          content="The Underworld is a lending and margin trading platform, built upon CoffinBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="The Underworld is a lending and margin trading platform, built upon CoffinBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
        <meta
          key="og:description"
          property="og:description"
          content="Underworld is a lending and margin trading platform, built upon CoffinBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
      </Head>
      <Card className="h-full bg-dark-900" header={<MarketHeader type="Lending" lists={[pairs, positions]} />}>
        {positions.items && positions.items.length > 0 && (
          <div className="pb-4">
            <div>
              <div className="grid grid-flow-col grid-cols-4 gap-4 px-2 pb-4 text-sm md:grid-cols-6 lg:grid-cols-7 text-secondary">
              <ListHeaderWithSort className="justify-center"sort={data} sortKey="search">
              <span className="justify-center md:flex">{i18n._(t`Positions`)}</span> 
                </ListHeaderWithSort>
                <ListHeaderWithSort className="hidden justify-center md:flex" sort={positions} sortKey="asset.tokenInfo.symbol">
                  {i18n._(t`Lent`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort className="hidden justify-center md:flex" sort={positions} sortKey="collateral.tokenInfo.symbol">
                  {i18n._(t`Collateral`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort className="hidden justify-center lg:flex" sort={positions} sortKey="oracle.name">
                  {i18n._(t`Oracle`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="currentUserAssetAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Supplied`)}
                </ListHeaderWithSort>
                {/* <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="currentUserLentAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Borrowed`)}
                </ListHeaderWithSort> */}
                <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="currentUserLentAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`APR`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="currentSupplyAPR.valueWithStrategy"
                  direction="descending"
                >
                  {i18n._(t`TVL`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="hidden sm:justify-center"
                  sort={positions}
                  sortKey="supplyAPR.valueWithStrategy"
                  direction="descending"
                >
                  {i18n._(t`Interest`)}
                </ListHeaderWithSort>
              </div>
              <div className="flex-col space-y-2">
                {positions.items.map((pair) => {
                  return <LendEntry key={pair.address} pair={pair} userPosition={true} />
                })}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-secondary">
            <ListHeaderWithSort className="justify-center"sort={data} sortKey="search">
              <span className="justify-center md:flex">{i18n._(t`Markets`)}</span> 
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden justify-center md:flex" sort={data} sortKey="asset.tokenInfo.symbol">
              {i18n._(t`Lend`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden justify-center md:flex" sort={data} sortKey="collateral.tokenInfo.symbol">
              {i18n._(t`Collateral`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden justify-center lg:flex" sort={data} sortKey="oracle.name">
              {i18n._(t`Oracle`)}
              <QuestionHelper text={i18n._(t`Onchain oracle that tracks pricing for this pair.`)} />
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center"
              sort={data}
              sortKey="currentAllAssets.usdValue"
              direction="descending"
            >
              {i18n._(t`Total`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center"
              sort={data}
              sortKey="currentSupplyAPR.valueWithStrategy"
              direction="descending"
            >
              {i18n._(t`Interest`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center sm:flex"
              sort={data}
              sortKey="currentUserBorrowAmount.usdValue"
              direction="descending"
            >
              {i18n._(t`Borrowed`)}
            </ListHeaderWithSort>
          </div>

          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={
              <div className="mt-8 text-center">
                <Dots>Loading</Dots>
              </div>
            }
          >
            <div className="flex-col space-y-2">
              {data.items.slice(0, numDisplayed).map((pair) => (
                <LendEntry key={pair.address} pair={pair} userPosition={false} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </Card>
    </LendLayout>
  )
}

// @ts-ignore TYPE NEEDS FIXING
const LendEntry = ({ pair, userPosition = false }) => {
  const { underworldUserInfo } = useUnderworldUserInfo(pair.address)
  const { underworldPairInfo } = useUnderworldPairInfo(pair.address)

  const assetDecimals = Number(underworldPairInfo.assetDecimals)
  const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  const assetPrice = Number(underworldPairInfo.assetPrice)
  const collateralPrice = Number(underworldPairInfo.collateralPrice)
  const assetBalance = Number(underworldUserInfo.userAssetBalance) // 10**assetDecimals
  const borrowedAmount = Number(underworldUserInfo.userBorrowPart) / 10**assetDecimals
  const suppliedAmount = Number(underworldUserInfo.userBalance) // 10**lpDecimals
  const collateralAmount = Number(underworldUserInfo.userCollateralShare) / 10**collateralDecimals
  // const walletValue = assetBalance * assetPrice
  const borrowedValue = borrowedAmount * assetPrice
  const collateralValue = collateralAmount * collateralPrice
  const userDepositedValue = suppliedAmount * assetPrice
  
  const LTV = (1 - (collateralValue - borrowedValue) / collateralValue) * 100
  // const leeway = (75 - LTV) / 100

  // const userDepositedBalance = pair?.userAssetFraction // √
  // const assetPrice = pair?.asset.usd / 1e18 // √
  // const borrowPrice = pair?.collateral.usd / (10**assetDecimals)
  // const userDepositedValue 
  // = userDepositedBalance 
  //   * assetPrice 
  //   / 10**assetDecimals
  
  const totalDepositedValue 
  = Number(pair.totalAsset.base) 
    * assetPrice
    / 10**assetDecimals

  return (
    <Link href={'/lend/' + pair.address}>
      <a className="block text-high-emphesis">
        <div className="grid items-center grid-flow-col grid-cols-4 gap-4 px-4 py-4 text-sm rounded md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-blue">
          <div className="flex flex-col items-start md:flex-row items-center">
            <div className="hidden space-x-2 md:flex">
              <Image
                height={48}
                width={48}
                src={pair.asset.tokenInfo.logoURI}
                className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                alt={pair.asset.tokenInfo.symbol}
              />

              <Image
                height={48}
                width={48}
                src={pair.collateral.tokenInfo.logoURI}
                className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                alt={pair.collateral.tokenInfo.symbol}
              />
            </div>
            <div className="hidden sm:items-end md:hidden">
              <div>
                <strong>{pair.asset.tokenInfo.symbol}</strong> / {pair.collateral.tokenInfo.symbol}
              </div>
              <div className="block mt-0 text-xs text-left text-white-500 hidden">{pair.oracle.name}</div>
            </div>
            <div className="text-center justify-center items-center md:hidden">
            <div className="grid items-center grid-cols-2">
                {/* <strong>{pair.collateral.tokenInfo.symbol}</strong> */}
                <Image
                height={36}
                width={36}
                src={pair.asset.tokenInfo.logoURI}
                className="w-2 h-2 p-2 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                alt={pair.asset.tokenInfo.symbol}
              />
                <Image
                height={36}
                width={36}
                src={pair.collateral.tokenInfo.logoURI}
                className="w-2 h-2 p-2 rounded-sm md:w-10 md:h-10 lg:w-12 lg:h-12"
                alt={pair.collateral.tokenInfo.symbol}
              />
              </div>
              <div className="block mt-0 text-xs text-left text-white-500 hidden">{pair.oracle.name}</div>
            </div>
          </div>
          <div className="hidden text-center text-white md:block">
            <strong>{pair.asset.tokenInfo.symbol}</strong>
          </div>
          <div className="hidden text-center md:block">{pair.collateral.tokenInfo.symbol}</div>
          <div className="hidden text-center lg:block">{pair.oracle.name}</div>
          {userPosition ? (
            <>
              <div className="text-center">
                <div>
                  {formatNumber(Number(pair.userAssetFraction) / 10**(assetDecimals), false)} {pair.asset.tokenInfo.symbol}
                </div>
                <div className="text-center text-sm text-secondary">{formatNumber(userDepositedValue, true)}</div>
              </div>
              {/* APR */}
              <div className="text-center">
              {formatPercent(pair.currentSupplyAPR.stringWithStrategy)}
                {/* <div>{formatNumber(pair.currentUserLentAmount.string)} {pair.asset.tokenInfo.symbol}</div> */}
                {/* <div>{formatPercent(pair.utilization.string)}</div> */}
                {/* <div className="text-center text-secondary text-sm">{formatNumber(Number(pair.currentUserLentAmount.usd) / 1e12 , true)}</div> */}
              </div>
              <div className="text-center">
              {/* {
                formatPercent(
                  ((pair?.userAssetFraction.div(e10(assetDecimals))) -
                    (pair?.userAssetFraction.sub(pair?.currentUserLentAmount.value).div(e10(assetDecimals))))
                  / (pair?.userAssetFraction.div(e10(assetDecimals))) * 100
                 )
              } */}

              {/* TOTAL */}
                 {formatNumber(pair?.totalAsset.base / 10**(assetDecimals))} {pair?.asset.tokenInfo.symbol}
                  <div className="text-secondary">{formatNumber(totalDepositedValue, true)}</div>
                </div>{' '}
              <div className="hidden sm:text-center">{formatPercent(pair.supplyAPR.stringWithStrategy)}</div>{' '}
            </>
          ) : (
            <>
              <div>
                <div className="text-center">
                  {formatNumber(pair?.totalAsset.base / 10**(assetDecimals))} {pair?.asset.tokenInfo.symbol}
                  <div className="text-secondary">{formatNumber(totalDepositedValue, true)}</div>
                </div>
              </div>
              <div className="text-center">
                {formatPercent(pair.currentSupplyAPR.stringWithStrategy)}
              </div>
              <div className="text-center">{
                formatPercent(
                  ((pair?.totalAsset.base / 10**(assetDecimals)) -
                    (pair?.totalAsset.base.sub(pair?.totalBorrow.base) / 10**(assetDecimals)))
                  / (pair?.totalAsset.base / 10**(assetDecimals)) * 100
                )}
              </div>
            </>
          )}
        </div>
      </a>
    </Link>
  )
}

Lend.Provider = RecoilRoot

// @ts-ignore TYPE NEEDS FIXING
const LendLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
    // @ts-ignore TYPE NEEDS FIXING
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          // backgroundImage={BORROW_IMG}
          title={i18n._(t`Lend your assets, earn yield with ZERO impermanent loss`)}
          description={i18n._(
            t`Isolated lending markets mitigate your risks as an asset lender. Know exactly what collateral is available to you in the event of counter party insolvency.`
          )}
        />
      }
    >
      {children}
    </Layout>
  )
}

Lend.Guard = NetworkGuard(Feature.UNDERWORLD)