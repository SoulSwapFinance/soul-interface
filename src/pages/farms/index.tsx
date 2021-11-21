// import FarmHeader from '../../features/farm/Header'
// import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import Container from '../../components/Container'
// // import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'

// // const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

// const Farms = () => {
// 	return (
//     <DoubleGlowShadowV2 opacity="0.6">
//         <Container id="charts-page" maxWidth="2xl" className="space-y-4">
//           <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
//             <FarmHeader
//               // input={currencies[Field.CURRENCY_A]}
//               // output={currencies[Field.CURRENCY_B]}
//               // allowedSlippage={allowedSlippage}
//             />     
//             <iframe 
//               frameBorder={"none"}
//               title={"BRIDGE"}
//               src="https://bridge.soul.sh"
//               height={'720' }
//               width={"100%"}
//             />
// 	        </div>
//         </Container>
//       </DoubleGlowShadowV2>

// )}

// export default Farms

import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
// import FarmHeader from '../../features/farm/Header'

import React from 'react'

import FarmList from '../../features/farm/FarmList'
// import NavLink from '../../components/NavLink'

const Farms = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      {/* <h1> Farm Pairs for SOUL Rewards</h1>
      <br /> */}
      <Container id="farm-page">
        <Head>
          <title>Farm | All</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        
        <FarmList />
      </Container>
      {/* <NavLink href="/farms">
            <a className="flex items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis">
              <span>View All Categories</span>
            </a>
          </NavLink> */}
      </DoubleGlowShadowV2>

    </Wrap>
  )
}

export default Farms