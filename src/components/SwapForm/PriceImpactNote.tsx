import { FC } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'

import Row from 'components/Row'
import WarningNote from 'components/WarningNote'
import { checkPriceImpact } from 'utils/prices'

// const TextUnderlineColor = styled(Text)`
//   border-bottom: 1px solid ${({ theme }) => theme.text};
//   width: fit-content;
//   cursor: pointer;
//   color: ${({ theme }) => theme.text};
//   font-weight: 500;
//   margin-right: 0.5ch;
// `

const TextUnderlineTransparent = styled(Text)`
  border-bottom: 1px solid transparent;
  width: fit-content;
  cursor: pointer;
`

// const PRICE_IMPACT_EXPLANATION_URL =
//   'https://docs.kyberswap.com/getting-started/foundational-topics/decentralized-finance/price-impact'

type Props = {
  isDegenMode?: boolean
  priceImpact: number | undefined
}

const PriceImpactNote: FC<Props> = ({ isDegenMode, priceImpact }) => {
  const priceImpactResult = checkPriceImpact(priceImpact)

  if (typeof priceImpact !== 'number') {
    return null
  }

  // invalid
  if (priceImpactResult.isInvalid) {
    return (
      <WarningNote
        level="serious"
        shortText={
          <Row 
            // alignItems="center" 
            style={{ gap: '0.5ch' }}
            >
              <TextUnderlineTransparent>Unable to Calculate</TextUnderlineTransparent>
              {/* <TextUnderlineColor as="a" href={PRICE_IMPACT_EXPLANATION_URL} target="_blank" rel="noreferrer">
                Price Impact
              </TextUnderlineColor> */}
          </Row>
        }
        longText={
          <Text>
            {isDegenMode ? (
                `You have turned on <b>Degen Mode</b> from settings. Trades can still be executed when price impact
                cannot be calculated.`
            ) : (
                `You can turn on Degen Mode from Settings to execute trades when price impact cannot be calculated. This
                can result in bad rates and loss of funds`
            )}
          </Text>
        }
      />
    )
  }

  // VERY high
  if (priceImpactResult.isVeryHigh) {
    return (
      <WarningNote
        level="serious"
        shortText={
          <Row 
            // alignItems="center" 
            style={{ gap: '0.5ch' }}
          >
              <TextUnderlineTransparent>
                {/* <TextUnderlineColor as="a" href={PRICE_IMPACT_EXPLANATION_URL} target="_blank" rel="noreferrer"> */}
                  {`Price Impact`}
                {/* </TextUnderlineColor> */}
                is very high. You will lose funds!
              </TextUnderlineTransparent>
          </Row>
        }
        longText={
          <Text>
            {isDegenMode ? (
                `You have turned on Degen Mode from settings. Trades with very high price impact can be executed`
            ) : (
                `You can turn on Degen Mode from Settings to execute trades with very high price impact. This can result
                in bad rates and loss of funds.`
            )}
          </Text>
        }
      />
    )
  }

  // high

  const shortText = (
    <Row 
    // alignItems="center" 
    style={{ gap: '0.5ch' }}
    >
        {/* <TextUnderlineColor as="a" href={PRICE_IMPACT_EXPLANATION_URL} target="_blank" rel="noreferrer"> */}
          {`Price Impact`}
        {/* </TextUnderlineColor> */}
        <TextUnderlineTransparent> is high</TextUnderlineTransparent>
    </Row>
  )

  if (priceImpactResult.isHigh) {
    return <WarningNote shortText={shortText} />
  }

  return null
}

export default PriceImpactNote
