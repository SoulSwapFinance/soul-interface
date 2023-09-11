import { ChainId } from 'sdk'
import { rgba } from 'polished'
import { useCallback, useState } from 'react'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import Shield from 'components/Icons/Shield'
import SlippageSetting from 'components/SwapForm/SlippageSetting'
import { useActiveWeb3React } from 'hooks'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import useTheme from 'hooks/useTheme'
import { MEDIA_WIDTHS } from 'hooks/useIsMobileByMedia'
// import { MEDIA_WIDTHS } from 'theme'

// import AddMEVProtectionModal from './AddMEVProtectionModal'

const PriceAlertButton = styled.div`
  background: ${({ theme }) => rgba(theme.subText, 0.2)};
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
`

export default function SlippageSettingGroup({
  isStablePairSwap,
  isWrapOrUnwrap,
}: {
  isStablePairSwap: boolean
  isWrapOrUnwrap: boolean
}) {
// CROSSCHAIN TODO: ensure it fits.
  const upToXXSmall = useMedia(`(max-width: ${MEDIA_WIDTHS.upToExtraSmall}px)`)
  const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const [showMevModal, setShowMevModal] = useState(false)
  const { mixpanelHandler } = useMixpanel()

  const addMevProtectionHandler = useCallback(() => {
    setShowMevModal(true)
    mixpanelHandler(MIXPANEL_TYPE.MEV_CLICK_ADD_MEV)
  }, [mixpanelHandler])

  const onClose = useCallback(() => {
    setShowMevModal(false)
  }, [])

  const rightButton =
    chainId === ChainId.ETHEREUM && account ? (
      <PriceAlertButton onClick={addMevProtectionHandler}>
        <Shield size={14} color={theme.subText} />
        <Text color={theme.subText} style={{ whiteSpace: 'nowrap' }}>
          {upToXXSmall ? `MEV Protection`: `Add MEV Protection`}
        </Text>
      </PriceAlertButton>
    ) : null

  return (
    <Flex alignItems="flex-start" fontSize={12} color={theme.subText} justifyContent="space-between">
      {isWrapOrUnwrap ? (
        <>
          <div />
          {rightButton}
        </>
      ) : (
        <SlippageSetting isStablePairSwap={isStablePairSwap} rightComponent={rightButton} />
      )}
      {/* CROSSCHAIN TODO: add */}
      {/* <AddMEVProt ectionModal isOpen={showMevModal} onClose={onClose} /> */}
    </Flex>
  )
}
