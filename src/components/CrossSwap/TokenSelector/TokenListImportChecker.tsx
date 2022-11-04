import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

// import { useTokens } from 'hooks/useTokens'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { Currency, Token } from 'sdk'
import { Dialog } from 'components/Dialogue'
import { useTokens } from 'services/graph/hooks'

interface TokenListImportCheckerProps {
  children: ReactNode
  onAddTokens: (tokens: Currency[]) => void
  tokens?: { address: string; chainId: number }[]
  tokenMap: Record<string, Currency>
  customTokensMap: Record<string, Currency>
}

export const TokenListImportChecker: FC<TokenListImportCheckerProps> = ({
  onAddTokens,
  tokenMap,
  customTokensMap,
  tokens,
  children,
}) => {
  const _tokens = useMemo(() => {
    if (!tokens || Object.keys(tokenMap).length === 0) return []
    return tokens.filter((el) => {
      return !(el.address in tokenMap) && !(el.address.toLowerCase() in customTokensMap)
    })
  }, [customTokensMap, tokenMap, tokens])

  return (
    <_TokenListImportChecker
      onAddTokens={onAddTokens}
      tokens={_tokens}
      tokenMap={tokenMap}
      customTokensMap={customTokensMap}
    >
      {children}
    </_TokenListImportChecker>
  )
}

const _TokenListImportChecker: FC<TokenListImportCheckerProps & { tokens: { address: string; chainId: number }[] }> = ({
  children,
  tokens,
  onAddTokens,
  tokenMap,
  customTokensMap,
}) => {
  const [open, setOpen] = useState(false)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const { data: currencies } = useTokens({
    // @ts-ignore TYPE NEEDS FIXING
    tokens: tokens.map((el) => ({ address: el.address, chainId: el.chainId })),
  })

  const _currencies = useMemo(() => {
    if (!currencies) return
    return currencies.map((el, idx) => {
      const { address, name, symbol, decimals } = el
      return new Token(tokens[idx].chainId, address,decimals, symbol, name)
    })
  }, [currencies, tokens])

  const handleImport = useCallback(() => {
    if (!currencies) return

    if (onAddTokens && _currencies) {
      onAddTokens(_currencies)
    }

    onClose()
  }, [_currencies, currencies, onAddTokens, onClose])

  useEffect(() => {
    if (!tokens) return
    tokens.map((el) => {
      if (!(el.address in tokenMap) && !(el.address.toLowerCase() in customTokensMap)) setOpen(true)
    })
  }, [customTokensMap, tokenMap, tokens])

  return (
    <>
      {children}
      {_currencies && (
        <Dialog open={open} onClose={onClose}>
          <Dialog.Content>
            <Dialog.Header
              onClose={() => setOpen(false)}
              title={_currencies.length > 1 ? 'Import Tokens' : 'Import Token'}
            />
            <TokenSelectorImportRow currencies={_currencies} onImport={handleImport} slideIn={false} />
          </Dialog.Content>
        </Dialog>
      )}
    </>
  )
}
