import { TraceEvent } from '@uniswap/analytics'
// import { BrowserEvent, ElementName, EventName } from '@uniswap/analytics-events'
import { Box } from 'features/nft/components/Box'
import { Row } from 'features/nft/components/Flex'
import { useIsCollectionLoading } from 'features/nft/hooks'
import styled from 'styled-components/macro'

import * as styles from './ActivitySwitcher.css'

const BaseActivityContainer = styled(Row)`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.backgroundInteractive};
  margin-right: 12px;
`

export const ActivitySwitcherLoading = new Array(2)
  .fill(null)
  .map((_, index) => <div className={styles.styledLoading} key={`ActivitySwitcherLoading-key-${index}`} />)

export const ActivitySwitcher = ({
  showActivity,
  toggleActivity,
}: {
  showActivity: boolean
  toggleActivity: () => void
}) => {
  const isLoading = useIsCollectionLoading((state) => state.isCollectionStatsLoading)

  return (
    <BaseActivityContainer gap="24" marginBottom="16">
      {isLoading ? (
        ActivitySwitcherLoading
      ) : (
        <>
          <Box
            as="button"
            className={showActivity ? styles.activitySwitcherToggle : styles.selectedActivitySwitcherToggle}
            onClick={() => showActivity && toggleActivity()}
          >
            Items
          </Box>
            <Box
              as="button"
              className={!showActivity ? styles.activitySwitcherToggle : styles.selectedActivitySwitcherToggle}
              onClick={() => !showActivity && toggleActivity()}
            >
              Activity
            </Box>
        </>
      )}
    </BaseActivityContainer>
  )
}