// // import { Wrap } from '../../components/ReusableStyles'
// // import Container from '../../components/Container'
// import Head from 'next/head'
// import React from 'react'
// import PostList from 'features/articles/List'
// // import NetworkGuard from 'guards/Network'
// // import { Feature } from 'enums'

// const Articles = () => {
//   return (
//     <div className={`mt-4`}>
//         <Head>
//           <title>Articles | Soul</title>
//           <meta key="description" name="description" content="Articles covering the SoulSwap Ecosystem" />
//         </Head>
//         <PostList />
//     </div>
//   )
// }

// export default Articles

// // Articles.Guard = NetworkGuard(Feature.VAULT)

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'components/Card'
import Dots from 'components/Dots'
import Image from 'components/Image'
import { useUnderworldPairs } from 'features/lending/hooks'
import ListHeaderWithSort from 'features/lending/components/ListHeaderWithSort'
import MarketHeader from 'features/lending/components/MarketHeader'
import { useUnderworldLendPositions } from 'features/portfolio/AssetBalances/underworld/hooks'
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
import { classNames } from 'functions'
import { UnderworldBanner } from 'components/Banner'

export default function Articles() {
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

      {[ChainId.FANTOM].includes(chainId) && <UnderworldBanner />}

        <div className={`mt-2`}>
          <div className="grid grid-flow-col grid-cols-2 gap-4 px-4 pb-4 text-sm text-secondary">
            <ListHeaderWithSort
              className="justify-center"
              sort={data}
              direction="descending"
            >
              {i18n._(t`ARTICLE`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-center sm:flex"
              sort={data}
              direction="descending"
            >
              {i18n._(t`URL`)}
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
                <LendEntry key={pair.address} pair={pair} title={'Title'} summary={'Summary'} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </Card>
    </LendLayout>
  )
}

const LendEntry = ({ pair, title, summary }) => {
  const { chainId } = useActiveWeb3React()
  const slug = "placeholder_slug"

  const blockchain = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
  const postURI = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/posts/${slug}/banner.png`

  return (
    <NavLink href={'/lend/' + pair.address}>
    <a className="block text-high-emphesis">
    <div className={classNames(
      `grid items-center grid-flow-col grid-cols-2 rounded rounded-3xl gap-4 px-4 py-4 text-sm rounded align-center bg-dark-800 hover:bg-dark-blue`,
      `border border-2 border-[${getChainColor(chainId)}]`
    )}>
      <div className="flex flex-cols-2 items-start items-center">
      <div className="flex flex-cols gap-24 text-center justify-center">
          <Image
            height={64}
            width={64}
            src={postURI}
        
            className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
            alt={pair.asset.tokenInfo.symbol}
          />
          <Typography
            className={'justify-center text-lg mt-4'}
          >
            {title}
          </Typography>
          </div>
        </div>
          <div className="sm:flex sm:flex-cols-1 gap-0.5 text-center justify-center sm:mr-1">
          <Typography>
            {summary}
          </Typography>
          </div>
    </div>
    </a>
    </NavLink>
  )
}

Articles.Provider = RecoilRoot

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

// Articles.Guard = NetworkGuard(Feature.UNDERWORLD)