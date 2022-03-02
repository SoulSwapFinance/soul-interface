import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'components/Card'
import Dots from 'components/Dots'
import GradientDot from 'components/GradientDot'
import Image from 'components/Image'
// import { Feature } from 'enums/Feature'
import ListHeaderWithSort from 'features/lending/components/ListHeaderWithSort'
import { useUnderworldPair, useUnderworldPairAddresses, useUnderworldPairs } from 'features/lending/hooks'
import { formatNumber, formatPercent } from 'functions/format'
// import NetworkGuard from 'guards/Network'
import { useInfiniteScroll } from 'hooks/useInfiniteScroll'
import useSearchAndSort from 'hooks/useSearchAndSort'
import Layout from 'layouts/Underworld'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RecoilRoot } from 'recoil'
import MarketHeader from 'features/lending/components/MarketHeader'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import { useUnderworldBorrowPositions } from 'features/portfolio/AssetBalances/underworld/hooks'
import { usePrice, useUSDCPrice } from 'hooks'
import { e10 } from 'functions/math'
import router from 'next/router'
import SwapHeader from '../../features/trade/HeaderNew'
import MainHeader from 'features/swap/MainHeader'
import { i18n } from '@lingui/core'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
// import { formatNumber } from 'functions'

// import MainHeader from 'features/swap/MainHeader'
// import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import Container from '../../components/Container'
// import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
// const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
const BORROW_IMG = "https://media.giphy.com/media/GgyKe2YYi3UR8HltC6/giphy.gif"

const Margin = () => {
  const { i18n } = useLingui()
  const addresses = useUnderworldPairAddresses()
  // @ts-ignore TYPE NEEDS FIXING
  const pairs = useUnderworldPairs(addresses)

  const positions = useUnderworldBorrowPositions(pairs)

  const data = useSearchAndSort(
    pairs,
    { keys: ['search'], threshold: 0.1 },
    { key: 'totalAssetAmount.usdValue', direction: 'descending' }
  )

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(data.items)
  let pairPrice = '0'

// const Margin = () => {

  return ( 
  <>
  <MainHeader />
    <DoubleGlowShadowV2 opacity="0.6">
    <div id="margin-page" className="mt-4 w-full max-w-2xl p-4 space-y-4 rounded bg-dark-900 z-1">
      {/* <Container id="charts-page" maxWidth="2xl" className="space-y-4"> */}
        {/* <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}> */}
    <SwapHeader />
          {/* <iframe
            frameBorder={"none"}
            title={"MARGIN"}
            src={'https://soul.sh/borrow'}
            height={'720'}
            width={"100%"} /> */}
      {/* <BorrowLayout> */}
      <Head>
        <title>{i18n._(t`Borrow`)} | Soul</title>
        <meta
          key="description"
          name="description"
          content="Underworld is a lending and margin trading platform, built upon CoffinBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Underworld is a lending and margin trading platform, built upon CoffinBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
        <meta
          key="og:description"
          property="og:description"
          content="Underworld is a lending and margin trading platform, built upon CoffinBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
      </Head>
      <Card className="h-full bg-dark-900" header={<MarketHeader type="Borrow" lists={[pairs, positions]} />}>
        {positions.items && positions.items.length > 0 && (
          <div className="pb-4">
            <div>
              <div className="grid grid-cols-4 gap-2 px-2 pb-4 text-sm md:grid-cols-5 lg:grid-cols-5 text-secondary">
              <ListHeaderWithSort className="justify-center" sort={data} sortKey="search">
            {i18n._(t`Positions`)}
          </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="currentUserBorrowAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Borrowed`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="userCollateralAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Collateral`)}
                </ListHeaderWithSort>
                {/* <ListHeaderWithSort
                  className="justify-center lg:flex"
                  sort={positions}
                  sortKey="health.value"
                  direction="descending"
                >
                  <>
                    {i18n._(t`Limit`)} <span className="hidden md:inline-block">{i18n._(t` Used`)}</span>
                  </>
                </ListHeaderWithSort> */}
                <ListHeaderWithSort
                  className="justify-center"
                  sort={positions}
                  sortKey="interestPerYear.value"
                  direction="descending"
                >
                  {i18n._(t`Utilized`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="hidden md:flex md:justify-center"
                  sort={positions}
                  sortKey="interestPerYear.value"
                  direction="descending"
                >
                  {i18n._(t`APR`)}
                </ListHeaderWithSort>
              </div>
              <div className="flex-col space-y-2">
                {positions.items.map((pair: any) => {
                    const userCollateralBalance = pair?.userCollateralShare // √
                    // const userBorrowBalance = Number(pair?.currentUserBorrowAmount.string / 1e18) // √
                    const collateralPrice = pair?.collateral.usd / (10**pair.collateral.tokenInfo.decimals) * 1e12
                     const userCollateralValue 
                    = userCollateralBalance 
                      * collateralPrice 
                      / 10**pair.collateral.tokenInfo.decimals
                    const userBorrowBalance = Number(pair?.currentUserBorrowAmount.string / 1e18) // √
                    const borrowPrice = pair?.asset.usd
                    const userBorrowValue = userBorrowBalance * borrowPrice
                    const pairUtilization = userBorrowValue * 10**(pair?.collateral.tokenInfo.decimals) / Number(userCollateralValue) * 100
                    const pairHealth = pairUtilization / 1e6
                  
                  return (
                    <div key={pair.address}>
                      <Link href={'/borrow/' + pair.address}>
                        <a className="block text-high-emphesis">
                          <div className="grid items-center grid-cols-4 gap-2 px-2 py-4 text-sm md:grid-cols-5 lg:grid-cols-5 align-center bg-dark-800 hover:bg-dark-purple">
                          <div className="flex justify-center flex-col md:flex-row items-center">
                        <div className="hidden justify-center text-center items-center space-x-2 sm:flex">
                          <Image
                            height={48}
                            width={48}
                            src={pair.asset.tokenInfo.logoURI}
                            className="w-6 h-6 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                            alt={pair.asset.tokenInfo.symbol}
                          />

                          <Image
                            height={48}
                            width={48}
                            src={pair.collateral.tokenInfo.logoURI}
                            className="w-6 h-6 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                            alt={pair.collateral.tokenInfo.symbol}
                          />
                        </div>
                        <div className="hidden sm:items-center md:hidden">
                          <div>
                            <strong>{pair.asset.tokenInfo.symbol}</strong> / {pair.collateral.tokenInfo.symbol}
                          </div>
                          <div className="block mt-0 text-xs text-left text-white-500 hidden">{pair.oracle.name}</div>
                        </div>
                        <div className="text-center justify-center items-center sm:hidden">
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
                            <div className="hidden text-white">
                              <div>
                                <strong>{pair.asset.tokenInfo.symbol}</strong> / {pair.collateral.tokenInfo.symbol}
                              </div>
                              <div>{pair.oracle.name}</div>
                            </div>
                            <div className="text-center">
                              <div>
                                {formatNumber(pair.currentUserBorrowAmount.string, false)} {pair.asset.tokenInfo.symbol}
                              </div>
                              <div className="text-sm text-secondary">
                                {formatNumber(pair.currentUserBorrowAmount.usd / 1e12, true)}
                              </div>
                            </div>
                            <div className="text-center md:block">
                              <div>
                                {formatNumber(Number(pair?.userCollateralShare / 1e18), false)} {pair.collateral.tokenInfo.symbol}
                              </div>
                              <div className="text-sm text-secondary">
                                {formatNumber(
                                  userCollateralValue / 1e12,
                                  true
                                )}
                              </div>
                              {/* <div className="text-center text-sm text-secondary"> */}
                              {/* {formatNumber(Number(pair?.userCollateralShare) * Number(pair?.collateralPrice / 1e18), true)} */}
                              {/* {formatNumber(pair?.userCollateralShare / 1e18 * (Number(usePrice(pair?.collateral.address))), true) } */}
                              {/* </div> */}
                            </div>
                            <div className="flex items-center justify-center">
                              {formatPercent(pairHealth)}
                              <GradientDot percent={pairHealth} />
                            </div>
                            {/* <div className="items-center text-center flex justify-center text-md sm:text-lg text-high-emphesis"> */}
                            {/* <div className="text-center">{
                            formatPercent(
                              pair?.currentUserBorrowAmount.usd
                              / userCollateralValue /// userCollateralValue
                              * 100
                            )}</div> */}
                          <div className="hidden text-center md:block">{formatPercent(pair.interestPerYear.string)}</div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-flow-col grid-cols-4 gap-4 px-2 pb-4 text-sm md:grid-cols-5 lg:grid-cols-5 text-secondary">
          <ListHeaderWithSort className="justify-center" sort={data} sortKey="search">
            {i18n._(t`Markets`)}
          </ListHeaderWithSort>
          {/* <ListHeaderWithSort className="hidden justify-center md:flex" sort={data} sortKey="asset.tokenInfo.symbol">
            {i18n._(t`Borrow`)}
          </ListHeaderWithSort> */}
          <ListHeaderWithSort className="hidden justify-center md:flex" sort={data} sortKey="collateral.tokenInfo.symbol">
            {i18n._(t`Collateral`)}
          </ListHeaderWithSort>
          {/* <ListHeaderWithSort className="hidden justify-center  lg:flex" sort={data} sortKey="oracle.name">
            {i18n._(t`Oracle`)}
          </ListHeaderWithSort> */}
          <ListHeaderWithSort
            className="justify-center"
            sort={data}
            sortKey="currentBorrowAmount.usdValue"
            direction="descending"
          >
            {i18n._(t`Borrowed`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort
            className="justify-center"
            sort={data}
            sortKey="totalAssetAmount.usdValue"
            direction="descending"
          >
            {i18n._(t`Available`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort
            className="justify-center"
            sort={data}
            sortKey="currentInterestPerYear.value"
            direction="descending"
          >
            {i18n._(t`APR`)}
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
              <div key={pair.address}>
                <Link href={'/borrow/' + String(pair.address).toLowerCase()}>
                  <a className="block text-high-emphesis">
                  <div className="grid items-center grid-cols-4 gap-2 px-2 py-4 text-sm md:grid-cols-5 lg:grid-cols-5 align-center bg-dark-800 hover:bg-dark-purple">
                          <div className="flex justify-center flex-col md:flex-row items-center">
                        <div className="hidden justify-center text-center items-center space-x-2 sm:flex">
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
                        <div className="text-center justify-center items-center sm:hidden">
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
                      {/* <div className="hidden text-white md:block">
                        <strong>{pair.asset.tokenInfo.symbol}</strong>
                      </div> */}
                      <div className="hidden text-center md:block">
                        {formatNumber(pair?.totalCollateralShare.div(e10(18)), false)}{' '}
                        {pair.collateral.tokenInfo.symbol}
                        <div className="text-secondary">{formatNumber(pair.totalCollateralShare / 1e18 * pair.collateral.usd / 1e18, true)}
                        </div>
                      </div>
                      {/* <div className="hidden lg:block">{pair.oracle.name}</div> */}
                      <div className="text-center md:text-right">
                        {/* <div className="md:hidden"> */}
                        {/* <div className="flex flex-col"> */}
                        {/* <div>{formatNumber(pair.currentAllAssets)}</div> */}
                        {/* <div>{formatNumber(pair.currentAllAssets)}</div> */}
                        {/* </div>                        */}
                        {/* </div> */}
                        <div className="text-center md:block">
                          {formatNumber(pair.currentBorrowAmount.string)} {pair.asset.tokenInfo.symbol}
                          <div className="text-secondary">{formatNumber(pair.currentBorrowAmount.usdValue.div(e10(18)), true)}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="md:hidden">
                          <div className="text-green flex flex-col">
                            {/* <div>{formatNumber(pair.totalAssetAmount.string)}</div> */}
                            {formatPercent(100 -
                              ((pair?.totalAsset.base.div(e10(18))) -
                                (pair?.totalAsset.base.sub(pair?.totalBorrow.base).div(e10(18))))
                              / (pair?.totalAsset.base.div(e10(18))) * 100
                            )}
                            {/* <div>{pair.asset.tokenInfo.symbol}</div> */}
                          </div>
                          <div className="text-secondary">{formatNumber(pair.asset.usd / 1e18 * Number(pair?.totalAsset.base) / 1e18, true)}</div>
                        </div>
                        <div className="hidden md:block">
                          {formatNumber(pair.totalAsset.base.div(e10(18)))} {pair.asset.tokenInfo.symbol}
                          <div className="text-secondary">{formatNumber(Number(pair.asset.usd) / 1e18 * Number(pair.totalAsset.base / 1e18), true)}</div>
                        </div>
                      </div>
                      <div className="text-center">{formatPercent(pair.currentInterestPerYear.value / 1e16)}</div>
                      {/* <div className="text-right">{formatPercent(pair.currentInterestPerYear.value)}</div> */}
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </Card>
      </div>
    {/* </BorrowLayout> */}
    </DoubleGlowShadowV2>
    </>
    

  )
  
}
// @ts-ignore TYPE NEEDS FIXING
// const BorrowLayout = ({ children }) => {
//   const { i18n } = useLingui()
//   return (
//     <Layout
//       // left={
//       //   <Card
//       //     className="h-full bg-dark-900"
//       //     backgroundImage={BORROW_IMG}
//       //     title={i18n._(t`Borrow assets and leverage up`)}
//       //     description={i18n._(
//       //       t`Borrowing allows you to obtain liquidity without selling. Your borrow limit depends on the amount of deposited collateral. You will be able to borrow up to 75% of your collateral and repay at any time with accrued interest.`
//       //     )}
//       //   />
//       // }
//     >
//       {children}
//     </Layout>
//   )
// }

export default Margin