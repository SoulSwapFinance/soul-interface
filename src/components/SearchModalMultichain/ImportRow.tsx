import { Token } from 'sdk'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { CurrencyLogo } from 'components/CurrencyLogo'
import { AutoRow } from 'components/Row'
import { TYPE } from 'theme'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  setImportToken: (token: Token) => void
}) {
  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size={24} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <TYPE.Body fontWeight={500}>{token.symbol}</TYPE.Body>
          <TYPE.DarkGray ml="8px" fontWeight={300}>
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </TYPE.DarkGray>
        </AutoRow>
      </AutoColumn>
      <ButtonPrimary
        data-testid="button-import-token"
        width="fit-content"
        padding="6px 12px"
        fontWeight={500}
        fontSize="14px"
        onClick={() => setImportToken(token)}
      >
        {`Import`}
      </ButtonPrimary>
    </TokenSection>
  )
}
