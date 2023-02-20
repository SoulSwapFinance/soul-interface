import Head from 'next/head'

import Container from '../../components/Container'
// import Sidebar from 'components/Sidebar'
// import AnalyticsHeaderNew from 'features/analytics/HeaderNew'

// @ts-ignore TYPE NEEDS FIXING
export default function AnalyticsContainer({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>Soul Analytics | Soul</title>
        <meta name="description" content="SoulSwap Liquidity Analytics" />
      </Head>
      {/* <AnalyticsHeaderNew /> */}
      <Container
        id="analytics"
        maxWidth="full"
        className="grid h-full grid-flow-col bg-dark-1000 grid-cols-10 mx-auto lg:px-4 gap- mt-4"
      >
        {/* <div className="sticky top-0 hidden lg:block md:col-span-2 3xl:col-start-1 3xl:col-span-2"> */}
        {/* <Sidebar
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
          /> */}
        {/* </div> */}
        <div className="col-span-10 lg:col-span-full 3xl:col-span-7">{children}</div>
      </Container>
    </>
  )
}