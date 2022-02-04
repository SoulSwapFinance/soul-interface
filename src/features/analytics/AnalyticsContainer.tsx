import Head from 'next/head'

import Container from '../../components/Container'
import Sidebar from 'components/Sidebar'

// @ts-ignore TYPE NEEDS FIXING
export default function AnalyticsContainer({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>Soul Analytics | Soul</title>
        <meta name="description" content="SoulSwap Liquidity Pair (SLP) Analytics by Soul" />
      </Head>

      <Container
        id="analytics"
        maxWidth="full"
        className="grid h-full grid-flow-col grid-cols-10 mx-auto lg:px-4 gap-9"
      >
        <div className="sticky top-0 hidden lg:block md:col-span-2 3xl:col-start-1 3xl:col-span-2">
          <Sidebar
            items={[
              {
                text: 'Dashboard',
                href: '/analytics/dashboard',
              },
              // {
              //   text: 'Enchantment',
              //   href: '/analytics/enchantment',
              // },
              // {
              //   text: 'Farms',
              //   href: '/analytics/farms',
              // },
              {
                text: 'Pairs',
                href: '/analytics/pairs',
              },
              {
                text: 'Tokens',
                href: '/analytics/tokens',
              },
              {
                text: 'CoffinBox',
                href: '/analytics/coffinbox',
              },
            ]}
          />
        </div>
        <div className="col-span-10 lg:border-l lg:col-span-8 3xl:col-span-7 border-dark-700">{children}</div>
      </Container>
    </>
  )
}