import SwapHeader from '../../features/trade/HeaderNew'
import MainHeader from 'features/swap/MainHeader'

// import MainHeader from 'features/swap/MainHeader'
// import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import Container from '../../components/Container'
// import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
// const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

const Bridge = () => {
  return ( 
  <>
  <MainHeader 
    // input={currencies[Field.INPUT]}
    // output={currencies[Field.OUTPUT]}
    // allowedSlippage={allowedSlippage}
  />
    {/* <DoubleGlowShadowV2 opacity="0.6"> */}
    <div id="bridge-page" className="mt-4 w-full max-w-2xl p-4 space-y-4 rounded bg-dark-900 z-1">
      {/* <Container id="charts-page" maxWidth="2xl" className="space-y-4"> */}
        {/* <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}> */}
    <SwapHeader />
          <iframe
            frameBorder={"none"}
            title={"BRIDGE"}
            src={'https://bridge.soulswap.finance/bridge'}
            height={'720'}
            width={"100%"} />
        {/* </div> */}
      </div>
    {/* </DoubleGlowShadowV2> */}
    </>

  )
}

export default Bridge