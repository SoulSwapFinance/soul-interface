import { Currency, CurrencyAmount } from 'sdk'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonConfirmed, ButtonLight, ButtonPrimary } from 'components/Button'
import Column from 'components/Column/index'
import InfoHelper from 'components/InfoHelper'
import Loader from 'components/Loader'
import ProgressSteps from 'components/ProgressSteps'
import { AutoRow, RowBetween, RowFit } from 'components/Row'
import SwapOnlyButton from 'components/SwapForm/SwapActionButton/SwapOnlyButton'
import { SwapCallbackError } from 'components/swapv2/styleds'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
// import { PermitState, usePermit } from 'hooks/usePermit'
import useTheme from 'hooks/useTheme'
import { WrapType } from 'hooks/useWrapCallback'
import ApprovalModal from 'components/SwapV2/ApprovalModal'
// import { ApplicationModal } from 'state/application/actions'
import { useToggleModal, useWalletModalToggle } from 'state/application/hooks'
import { DetailedRouteSummary } from 'types/route'

import { Props as SwapOnlyButtonProps } from './SwapOnlyButton'
import { BuildRouteResult } from 'features/crosschain/SwapForm/hooks/useBuildRoute'

const CustomPrimaryButton = styled(ButtonPrimary).attrs({
  id: 'swap-button',
})`
  border: none;
  font-weight: 500;

  &:disabled {
    border: none;
  }
`

type Props = {
  isDegenMode: boolean
  isGettingRoute: boolean
  isProcessingSwap: boolean

  typedValue: string
  parsedAmountFromTypedValue: CurrencyAmount<Currency> | undefined
  routeSummary: DetailedRouteSummary | undefined

  currencyIn: Currency | undefined
  currencyOut: Currency | undefined
  balanceIn: CurrencyAmount<Currency> | undefined
  balanceOut: CurrencyAmount<Currency> | undefined

  swapInputError: string | undefined
  wrapInputError: string | undefined
  wrapType: WrapType

  setProcessingSwap: React.Dispatch<React.SetStateAction<boolean>>
  onWrap: (() => Promise<string | undefined>) | undefined
  buildRoute: () => Promise<BuildRouteResult>
}

// const SwapActionButton: React.FC<Props> = ({
const SwapActionButton = ({
  // isDegenMode,
  // isGettingRoute,
  // isProcessingSwap,

  // typedValue,
  // parsedAmountFromTypedValue,
  // routeSummary,

  // currencyIn,
  // currencyOut,
  // balanceIn,
  // balanceOut,

  // swapInputError,
  // wrapInputError,
  // wrapType,

  // setProcessingSwap,
  // onWrap,
  // buildRoute,
}) => {
  // const theme = useTheme()
  // const { account } = useActiveWeb3React()
  // const { mixpanelHandler } = useMixpanel()
  // const [errorWhileSwap, setErrorWhileSwap] = useState('')
  // const noRouteFound = routeSummary && !routeSummary.route

  // toggle wallet when disconnected
  // const toggleWalletModal = useWalletModalToggle()

  // const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  // const userHasSpecifiedInputOutput = Boolean(
  //   currencyIn && currencyOut && parsedAmountFromTypedValue && !parsedAmountFromTypedValue.equalTo(0),
  // )

  // check whether the user has approved the router on the input token
  // const [approval, approveCallback, currentAllowance] = useApproveCallback(
  //   parsedAmountFromTypedValue,
  //   routeSummary?.routerAddress,
  // )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  // const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // const { permitState, permitCallback } = usePermit(parsedAmountFromTypedValue, routeSummary?.routerAddress)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  // useEffect(() => {
  //   if (approval === ApprovalState.PENDING) {
  //     setApprovalSubmitted(true)
  //   }
  //   if (approval === ApprovalState.NOT_APPROVED) {
  //     setApprovalSubmitted(false)
  //   }
  // }, [approval, approvalSubmitted])

  // useEffect(() => {
  //   // reset approval submitted when input token changes
  //   if (!isProcessingSwap) {
  //     setApprovalSubmitted(false)
  //   }
  // }, [currencyIn, typedValue, isProcessingSwap])

  // // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // // never show if price impact is above threshold in non degen mode
  // const showApproveFlow =
  //   !swapInputError &&
  //   (approval === ApprovalState.NOT_APPROVED ||
  //     approval === ApprovalState.PENDING ||
  //     (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
  //   permitState !== PermitState.SIGNED

  // // const toggleApprovalModal = useToggleModal(ApplicationModal.SWAP_APPROVAL)
  // const [toggleApprovalModal, setToggleApprovalModal] = useState(false)
  // const handleApproveClick = () => {
  //   // if (['COIN98', 'BRAVE', 'COINBASE'].includes(walletKey)) {
  //     // toggleApprovalModal()
  //     setToggleApprovalModal(true)
  //   // } else {
  //   //   approveCallback()
  //   }
  // }

  // const approveTooltipText = () => {
  //   if (currentAllowance && +currentAllowance > 0) {
  //     if (walletKey && walletKey?.toString() === 'METAMASK') {
  //       return (
  //           `Approve ${<b>{currencyIn?.symbol}</b>} requires to be more than{' '}
  //           ${<b>{`${currentAllowance} ${currencyIn?.symbol}`}</b>}, find out more${' '}
  //          ${<a
  //             href="https://support.metamask.io/hc/en-us/articles/6055177143579-How-to-customize-token-approvals-with-a-spending-cap"
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             here
  //           </a>}`
  //       )
  //     }
  //     if (walletKey && walletKey?.toString() === 'TRUST_WALLET') {
  //       return (
  //           `Approve <b>{currencyIn?.symbol}</b> requires to be more than${' '}
  //           ${<b>{`${currentAllowance} ${currencyIn?.symbol}`}</b>}, find out more${' '}
  //           ${<a
  //             href="https://community.trustwallet.com/t/what-is-token-approval/242764"
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             here
  //           </a>}`
  //       )
  //     }
  //   }

  //   // ${<a
  //   //   href="https://docs.kyberswap.com/kyberswap-solutions/kyberswap-interface/user-guides/instantly-swap-at-superior-rates#step-4-approve-contract-to-swap-tokens"
  //   //   target="_blank"
  //   //   rel="noreferrer"
  //   // >
  //   //   Read more ↗
  //   // </a>}`
  //   return (
  //       `You need to first allow SoulSwap&apos;s smart contract to use your ${currencyIn?.symbol}.${' '}`)
  //     }
  // const renderButton = () => {
  //   if (!account) {
  //     return (
  //       <ButtonLight onClick={toggleWalletModal}>
  //         {`Connect Wallet`}
  //       </ButtonLight>
  //     )
  //   }

  //   if (wrapInputError) {
  //     return <CustomPrimaryButton disabled>{wrapInputError}</CustomPrimaryButton>
  //   }

  //   if (showWrap) {
  //     return (
  //       <CustomPrimaryButton onClick={onWrap}>
  //         {wrapType === WrapType.WRAP ? `Wrap` : `Unwrap`}
  //       </CustomPrimaryButton>
  //     )
  //   }

  //   if (userHasSpecifiedInputOutput && noRouteFound) {
  //     return (
  //       <CustomPrimaryButton disabled>
  //         {`Insufficient liquidity for this trade.`}
  //       </CustomPrimaryButton>
  //     )
  //   }

  //   if (swapInputError) {
  //     return <CustomPrimaryButton disabled>{swapInputError}</CustomPrimaryButton>
  //   }

  //   const swapOnlyButtonProps: SwapOnlyButtonProps = {
  //     isDegenMode: isDegenMode,
  //     routeSummary,
  //     isGettingRoute,
  //     isProcessingSwap,

  //     currencyIn,
  //     currencyOut,
  //     balanceIn,
  //     balanceOut,
  //     parsedAmount: parsedAmountFromTypedValue,
  //     isPermitSwap: permitState === PermitState.SIGNED,

  //     setProcessingSwap,
  //     setErrorWhileSwap,
  //     buildRoute,

  //     isApproved: approval === ApprovalState.APPROVED || permitState === PermitState.SIGNED,
  //   }

  //   if (showApproveFlow) {
  //     return (
  //       <>
  //         <RowBetween gap="12px">
  //           {permitState === PermitState.NOT_APPLICABLE ? (
  //             <ButtonConfirmed
  //               onClick={handleApproveClick}
  //               disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
  //               altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
  //               confirmed={approval === ApprovalState.APPROVED}
  //               style={{
  //                 border: 'none',
  //                 flex: 1,
  //               }}
  //             >
  //               {approval === ApprovalState.PENDING ? (
  //                 <AutoRow gap="6px" justify="center">
  //                   Approving <Loader stroke="white" />
  //                 </AutoRow>
  //               ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
  //                 `Approved`
  //               ) : (
  //                 <RowFit gap="4px">
  //                   <InfoHelper color={theme.textReverse} placement="top" text={approveTooltipText()} />
  //                   Approve {currencyIn?.symbol}
  //                 </RowFit>
  //               )}
  //             </ButtonConfirmed>
  //           ) : (
  //             <ButtonConfirmed
  //               onClick={() => {
  //                 mixpanelHandler(MIXPANEL_TYPE.PERMIT_CLICK)
  //                 permitCallback()
  //               }}
  //               style={{
  //                 flex: 1,
  //               }}
  //             >
  //               <RowFit gap="4px">
  //                 <InfoHelper
  //                   color={theme.textReverse}
  //                   placement="top"
  //                   text={
  //                       `You need to first give a temporary approval to use your${' '}
  //                       ${currencyIn?.symbol}. This doesnt require a gas fees.`
  //                       // {' '}
  //                       // <a
  //                       //   href="https://docs.kyberswap.com/reference/permitable-tokens"
  //                       //   target="_blank"
  //                       //   rel="noreferrer"
  //                       // >
  //                       //   Read more ↗
  //                       // </a>
  //                   }
  //                 />
  //                Permit {currencyIn?.symbol}
  //               </RowFit>
  //             </ButtonConfirmed>
  //           )}

  //           <SwapOnlyButton minimal {...swapOnlyButtonProps} />
  //         </RowBetween>
  //         <Column>
  //           <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
  //         </Column>
  //       </>
  //     )
  //   }

  //   return <SwapOnlyButton {...swapOnlyButtonProps} />
  // }

  // useEffect(() => {
  //   setErrorWhileSwap('')
  // }, [typedValue])

  return (
    <>
      {/* {renderButton()} */}
      {/* {isDegenMode && errorWhileSwap ? (
        <SwapCallbackError style={{ margin: 0, zIndex: 'unset' }} error={errorWhileSwap} />
      ) : null} */}
      {/* <ApprovalModal typedValue={typedValue} currencyInput={currencyIn} onApprove={approveCallback} /> */}
    </>
  )
}

export default SwapActionButton
