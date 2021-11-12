// // import { ArrowRightIcon } from '@heroicons/react/outline'
// // import { CashIcon } from '@heroicons/react/solid'
// import Container from '../../components/Container'
// import Head from 'next/head'
// // import { I18n } from '@lingui/core'
// import Typography from '../../components/Typography'
// import { t } from '@lingui/macro'
// // import { useLingui } from '@lingui/react'
// import { useMemo } from 'react'

// const BASE_URL = 'https://exchange.soulswap.finance'

// // const TOOLS = (i18n: I18n) => [
// const TOOLS = (tools) => [
//   {
//     id: 1,
//     name: 'SUMMON SOUL',
//     description: ``,
//     // href: BASE_URL + '/farm',
//     href: './farm'
//   },
//   {
//     id: 2,
//     name: 'BORROW & EARN',
//     description: '',
//     href: '/seance',
//   },
//   {
//     id: 3,
//     name: 'SEANCE CIRCLES',
//     description: '',
//     to: '/circles',
//   },
//   {
//     id: 4,
//     name: 'ENCHANTED BUYBACKS',
//     description: '',
//     href: '/enchant',
//   },
//   {
//     id: 5,
//     name: 'SHARE SOUL',
//     description: '',
//     href: '/scarab',
//   },
//   {
//     id: 6,
//     name: 'BRIDGE ASSETS',
//     description: '',
//     href: '/bridge'
//   },
// ]


//  const Tools= () => {
//   // const { i18n } = useLingui()
//   const tools = useMemo(() => TOOLS(tools), [])

//   return (
//     <Container id="tools-page" className="py-4 space-y-4 md:py-8 lg:py-12" maxWidth="xl">
//       <Head>
//         <title>Tools | Soul</title>
//         <meta key="description" name="description" content="SoulSwap Tools..." />
//       </Head>
//       <Typography variant="h1" component="h1">
//         OUR ECOSYSTEM
//       </Typography>
//       <ul className="space-y-4 divide-y-0">
//         {tools.map((tool) => (
//           <li key={tool.id} className="relative w-full p-4 rounded bg-dark-900 hover:bg-dark-800">
//             <div className="flex justify-between space-x-4">
//               <div className="flex-1 min-w-0">
//                   <a className="flex items-center justify-between focus:outline-none">
//                     <span className="absolute inset-0" aria-hidden="true" />
//                   {/* <CashIcon width={20} height={20} className="h-10 w-10 text-blue-500"/> */}
//                     <div className="space-y-2">
//                       <p className="text-xl font-bold truncate text-primary">{tool.name}</p>
//                       <p className="text-sm truncate text-secondary">{tool.description}</p>
//                     </div>
//                     {/* <ArrowRightIcon width={24} height={24} className="text-high-emphesis" /> */}
//                   </a>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </Container>
//   )
// }

// export default Tools


import { ArrowRightIcon } from '@heroicons/react/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import { I18n } from '@lingui/core'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

const TOOLS = (i18n: I18n) => [
  {
    id: 1,
    name: 'SUMMON SOUL',
    description: i18n._(t`Deposit your SOUL-LP to earn $SOUL rewards.`),
    href: '/farm',
  },
  {
    id: 2,
    name: 'BORROW & EARN',
    description: 'Borrow $SEANCE with $SOUL and earn rewards.',
    href: './seance'
  },
  {
    id: 3,
    name: 'SEANCE CIRCLES',
    description: 'Deposit $SEANCE to earn $WFTM and $UNIDX.',
    href: './circles'
  },
  {
    id: 4,
    name: 'ENCHANTED BUYBACKS',
    description: 'Deposit $SEANCE and earn protocol fee-shares.',
    href: './enchant'
  },
  {
    id: 5,
    name: 'SHARE YOUR SOUL',
    description: 'Send $SOUL for a small sacrifice of $SEANCE.',
    href: './scarab/create'
  },
  {
    id: 6,
    name: 'BRIDGE ASSETS',
    description: 'Bridge from Binance, Ethereum, Huobi, and more.',
    href: './bridge'
  },
]

export default function Tools() {
  const { i18n } = useLingui()
  const tools = useMemo(() => TOOLS(i18n), [i18n])

  return (
    <Container id="tools-page" className="py-4 space-y-4 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Tools | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <Typography variant="h1" component="h1">
        OUR ECOSYSTEM
      </Typography>
      <ul className="space-y-4 divide-y-0">
        {tools.map((tool) => (
          <li key={tool.id} className="relative w-full p-4 rounded bg-dark-900 hover:bg-dark-800">
            <div className="flex justify-between space-x-4">
              <div className="flex-1 min-w-0">
                <Link href={tool.href}>
                  <a className="flex items-center justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-xl font-bold truncate text-primary">{tool.name}</p>
                      <p className="text-sm truncate text-secondary">{tool.description}</p>
                    </div>
                    <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                  </a>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}