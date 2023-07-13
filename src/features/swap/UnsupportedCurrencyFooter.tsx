import { AutoRow, RowBetween } from '../../components/Row'
import { Currency, Token } from '../../sdk'
import React, { useState } from 'react'

import { AutoColumn } from '../../components/Column'
import { Button } from '../../components/Button'
import CloseIcon from '../../components/CloseIcon'
import { CurrencyLogo } from '../../components/CurrencyLogo'
import ExternalLink from '../../components/ExternalLink'
import { getExplorerLink } from '../../functions/explorer'
import styled from 'styled-components'
import { useActiveWeb3React } from 'services/web3'
import { useUnsupportedTokens } from '../../hooks/Tokens'
import { HeadlessUiModal } from 'components/Modal'

const DetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  text-align: center;
`

const AddressText = styled.div`
  font-size: 12px;
`

export default function UnsupportedCurrencyFooter({
  show,
  currencies,
}: {
  show: boolean
  currencies: (Currency | undefined)[]
}) {
  const { chainId } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(false)

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return currency?.wrapped
        })
      : []

  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()

  return (
    <DetailsFooter show={show}>
      <HeadlessUiModal.Controlled 
      isOpen={showDetails} 
      chainId={chainId} 
      onDismiss={() => setShowDetails(false)}>
        <div style={{ padding: '2rem' }}>
          <AutoColumn gap="lg">
            <RowBetween>
              <div>Unsupported Assets</div>

              <CloseIcon onClick={() => setShowDetails(false)} />
            </RowBetween>
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <div className="border border-dark-700" key={token.address?.concat('not-supported')}>
                    <AutoColumn gap="10px">
                      <AutoRow gap="5px" align="center">
                        <CurrencyLogo currency={token} size={24} />
                        <div className="font-medium">{token.symbol}</div>
                      </AutoRow>
                      {chainId && (
                        <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
                          <AddressText>{token.address}</AddressText>
                        </ExternalLink>
                      )}
                    </AutoColumn>
                  </div>
                )
              )
            })}
            <AutoColumn gap="lg">
              <div className="font-medium">
                Some assets are not available through this interface because they may not work well with our smart
                contract or we are unable to allow trading for legal reasons.
              </div>
            </AutoColumn>
          </AutoColumn>
        </div>
      </HeadlessUiModal.Controlled>
      <Button variant="empty" style={{ padding: '0px' }} onClick={() => setShowDetails(true)}>
        <div>Read more about unsupported assets</div>
      </Button>
    </DetailsFooter>
  )
}
