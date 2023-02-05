import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'components/Card'
import Dots from 'components/Dots'
import Image from 'components/Image'
import QuestionHelper from 'components/QuestionHelper'
import { Feature } from 'enums'
import { useUnderworldPairs } from 'features/lending/hooks'
import ListHeaderWithSort from 'features/lending/components/ListHeaderWithSort'
import MarketHeader from 'features/lending/components/MarketHeader'
import { useUnderworldLendPositions } from 'features/portfolio/AssetBalances/underworld/hooks'
import { formatNumber, formatPercent } from 'functions/format'
import NetworkGuard from 'guards/Network'
import { useInfiniteScroll } from 'hooks/useInfiniteScroll'
import useSearchAndSort from 'hooks/useSearchAndSort'
import Layout from 'layouts/Underworld'
import Head from 'next/head'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RecoilRoot } from 'recoil'
import { useUnderworldPairInfo, useUnderworldUserInfo } from 'hooks/useAPI'
import { ChainId, LEND_MULTIPLIER, Token, ACTIVE_UNDERWORLD_PAIRS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import NavLink from 'components/NavLink'
import Typography from 'components/Typography'
import { SubmitButton } from 'features/summoner/Styles'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useUnderworldPairAPI } from 'hooks/useUnderworldAPI'
import { classNames } from 'functions'
import { UnderworldBanner } from 'components/Banner'

// import Link from 'next/link'
// import { e10 } from 'functions/math'
// import { Button } from 'components/Button'
export default function Lend() {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  // const addresses = useUnderworldPairAddresses()
  const addresses = ACTIVE_UNDERWORLD_PAIRS[chainId]
  // console.log('Underworld Addresses', addresses)

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
      <Card className="h-full bg-dark-900" header={<MarketHeader type="Underworld Markets" lists={[pairs, positions]} />}>

      <UnderworldBanner />

        {/* {positions.items && positions.items.length > 0 && (
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
                  {i18n._(t`Action`)}
                </ListHeaderWithSort> //
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
        )} */}
        <div className={`mt-2`}>
          <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-secondary">
            <ListHeaderWithSort className="justify-center" sort={data} sortKey="search">
              <span className="justify-center md:flex">{i18n._(t`MARKET`)}</span>
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden justify-center md:flex" sort={data} sortKey="asset.tokenInfo.symbol">
              {i18n._(t`SUPPLY`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden justify-center md:flex" sort={data} sortKey="collateral.tokenInfo.symbol">
              {i18n._(t`COLLATERAL`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden justify-center lg:flex" sort={data} sortKey="oracle.name">
              {i18n._(t`ORACLE`)}
              {/* <QuestionHelper text={i18n._(t`On-chain oracle that tracks pricing for this pair.`)} /> */}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center"
              sort={data}
              sortKey="currentAllAssets.usdValue"
              direction="descending"
            >
              {i18n._(t`TVL`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center"
              sort={data}
              sortKey="currentSupplyAPR.valueWithStrategy"
              direction="descending"
            >
              {i18n._(t`APR`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center sm:flex"
              sort={data}
              sortKey="currentUserBorrowAmount.usdValue"
              direction="descending"
            >
              {i18n._(t`ACTION`)}
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

const LendEntry = ({ pair, userPosition = false }) => {
  const { underworldUserInfo } = useUnderworldUserInfo(pair.address)
  const { underworldPairInfo } = useUnderworldPairInfo(pair.address)
  const { chainId } = useActiveWeb3React()

  const assetDecimals = Number(underworldPairInfo.assetDecimals)
  const assetPrice = Number(underworldPairInfo.assetPrice)
  const suppliedAmount = Number(underworldUserInfo.userBalance) / 10 ** assetDecimals
  const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  const collateralAmount = Number(underworldUserInfo.userCollateralShare) / 10**collateralDecimals
  const _supplyAPR = Number(useUnderworldPairAPI(pair.address)[7]) // * 100 / 1E18)
  const supplyAPR = chainId == ChainId.AVALANCHE
    ? pair.currentSupplyAPR.stringWithStrategy : _supplyAPR / 1E18 * 100
  const assetAddress = pair?.asset.tokenInfo.address
  const collateralAddress = pair?.collateral.tokenInfo.address
  const blockchain = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
  const assetLogoURI = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${blockchain}/assets/${assetAddress}/logo.png`
  const collateralLogoURI = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${blockchain}/assets/${collateralAddress}/logo.png`
  // const userDepositedValue = suppliedAmount * assetPrice
  // const assetToken = new Token(chainId, assetAddress, assetDecimals)
  // const collateralPrice = Number(underworldPairInfo.collateralPrice)
  // const assetBalance = Number(underworldUserInfo.userAssetBalance) // 10**assetDecimals
  // const borrowedAmount = Number(underworldUserInfo.userBorrowPart) / 10**assetDecimals
  // const interestPerSecond = 1E18 / Number(underworldPairInfo.interestPerSecond)
  // const APR = 86_600 * interestPerSecond * 365

  const totalDepositedValue
    = Number(pair.totalAsset.base)
    * assetPrice
    / 10 ** assetDecimals

  return (
    // <Link href={'/lend/' + pair.address}>
    // <a className="block text-high-emphesis">
    <div className={classNames(
      `grid items-center grid-flow-col grid-cols-4 rounded rounded-3xl gap-4 px-4 py-4 text-sm rounded md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-blue`,
      suppliedAmount > 0 || collateralAmount > 0 ? `border border-2 border-[${getChainColor(chainId)}]` : `border border-2 border-dark-1000`
    )}>
      <div className="flex flex-col items-start md:flex-row items-center">
        <div className="hidden space-x-2 md:flex">
          <Image
            height={48}
            width={48}
            src={assetLogoURI}
            className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
            alt={pair.asset.tokenInfo.symbol}
          />

          <Image
            height={24}
            width={24}
            src={collateralLogoURI}
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
        <div className="flex flex-col md:hidden items-center">
        <div className="grid grid-cols-2 space-x-3 md:hidden">
            {/* <strong>{pair.collateral.tokenInfo.symbol}</strong> */}
            <Image
              height={48}
              width={48}
              src={assetLogoURI}
              className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
              alt={pair.asset.tokenInfo.symbol}
            />

            <Image
              height={24}
              width={24}
              src={collateralLogoURI}
              className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
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
      {<><div>
          <div className="text-center">
            {formatNumber(pair?.totalAsset.base / 10 ** (assetDecimals) * LEND_MULTIPLIER(chainId, pair?.asset.tokenInfo.symbol))} {pair?.asset.tokenInfo.symbol}
            <div className="text-secondary">{formatNumber(totalDepositedValue * LEND_MULTIPLIER(chainId, pair?.asset.tokenInfo.symbol), true)}</div>
          </div>
        </div><div className="text-center">
            {formatPercent(
              supplyAPR
                > 0 ?
                supplyAPR
                : 1)}
          </div><div className="sm:flex sm:flex-cols-1 gap-0.5 text-center justify-center sm:mr-1">
            <NavLink href={`/lend/${pair.address}`}>
              <SubmitButton variant="bordered" primaryColor={getChainColor(chainId)}>
                <Typography className="text-xs text-center">
                  Lend
                </Typography>
              </SubmitButton>
            </NavLink>
            <NavLink href={`/borrow/${pair.address}`}>
              <SubmitButton variant="bordered" primaryColor={getChainColor(chainId)}>
                <Typography className="text-xs text-center">
                  Borrow
                </Typography>
              </SubmitButton>
            </NavLink>
            {/* {
        formatPercent(
          ((pair?.totalAsset.base / 10**(assetDecimals)) -
            (pair?.totalAsset.base.sub(pair?.totalBorrow.base) / 10**(assetDecimals)))
          / (pair?.totalAsset.base / 10**(assetDecimals)) * 100
        )} */}
          </div></>
      }
    </div>
    /* </a> */
    /* </Link> */
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