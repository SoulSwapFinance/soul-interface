import { Token } from 'sdk'
import { Button } from 'components/Button'
import Chip from 'components/Chip'
import { CurrencyLogo } from 'components/CurrencyLogo'
import ExternalLink from 'components/ExternalLink'
import { HeadlessUiModal } from 'components/Modal'
import Typography from 'components/Typography'
import { getExplorerLink, shortenAddress } from 'functions'
import { useCurrencyModalContext } from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'
import { useAddUserToken } from 'state/user/hooks'
import React, { FC } from 'react'

interface ImportProps {
  tokens: Token[]
  onBack?: () => void
}

export const ImportToken: FC<ImportProps> = ({ tokens, onBack }) => {
  const { chainId } = useActiveWeb3React()
  const { onDismiss, onSelect, importToken } = useCurrencyModalContext()
  const addToken = useAddUserToken()
  const importList = importToken instanceof WrappedTokenInfo ? importToken.list : undefined

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={`Import token`} onClose={onDismiss} onBack={onBack} />
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 divide-y divide-gray-700 !border-avaxRed">
        <Typography variant="sm" weight={700} className="text-avaxRed justify-center text-center">
          {`This token doesn't appear on your token list(s). Ensure this is the intended token.`}
        </Typography>
        {tokens.map((token) => {
          return (
            <div key={'import' + token.address} className=".token-warning-container flex flex-col gap-4 pt-4">
              <div className="flex justify-center items-center gap-4">
                <CurrencyLogo currency={token} size={48} className="!rounded-full overflow-hidden" />
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <div
                      className={'flex border hover:border-2 border-ftmBlue justify-center items-center rounded-full px-2 py-1 text-xs text-white'}
                    >
                    <Typography variant="lg" weight={700}>
                      <ExternalLink href={getExplorerLink(chainId, token.address, 'address')} color="blue">
                        {shortenAddress(token.address)}
                      </ExternalLink>
                    </Typography>
                    </div>
                    {/* {importList !== undefined ? (
                      <Chip icon={importList.logoURI} color="green" size="sm" label={importList.name} />
                    ) : (
                      <Chip 
                        color="blue" size="sm" 
                        className={'text-white'}
                        label={`Unknown Source`}
                      >
                        {`Unknown Source`}
                      </Chip>
                    )} */}
                  </div>
                  <Typography variant="xs" weight={700} component="span">
                    {token.symbol}{' '}
                    <Typography variant="xxs" component="span">
                      {token.name}
                    </Typography>
                  </Typography>
                </div>
              </div>
            </div>
          )
        })}
      </HeadlessUiModal.BorderedContent>
      <div className="flex flex-grow" />
      <Button
        color="blue"
        onClick={() => {
          tokens.map((token) => addToken(token))
          onSelect && onSelect(tokens[0])
        }}
        className=".token-dismiss-button text-sm text-white"
      >
        {`Import`}
      </Button>
    </div>
  )
}

export default ImportToken
