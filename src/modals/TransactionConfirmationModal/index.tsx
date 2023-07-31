import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { ChainId, Currency } from 'sdk'
import React, { FC } from 'react'

import { Button } from 'components/Button'
import CloseIcon from 'components/CloseIcon'
import ExternalLink from 'components/ExternalLink'
import Image from 'components/Image'
import Lottie from 'lottie-react'
import { RowFixed } from 'components/Row'
import { getExplorerLink } from 'functions/explorer'
import loadingRollingCircle from 'animation/loading-purple-rolling-circle.json'
import { useActiveWeb3React } from 'services/web3'
import useAddTokenToMetaMask from 'hooks/useAddTokenToMetaMask'
import { HeadlessUiModal } from 'components/Modal'
import ModalHeader from 'components/Modal/Header'
import { getChainColorCode } from 'constants/chains'

interface ConfirmationPendingContentProps {
  onDismiss: () => void
  pendingText: string
  pendingText2: string
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({
  onDismiss,
  pendingText,
  pendingText2,
}) => {
  return (
    <div>
      <div className="flex justify-end">
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <Lottie animationData={loadingRollingCircle} autoplay loop />
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-xl font-bold text-high-emphesis">{`Waiting for Confirmation`}</div>
        <div className="font-bold">{pendingText}</div>
        <div className="font-bold">{pendingText2}</div>
        <div className="text-sm font-bold text-secondary">{`Confirm transaction in your wallet`}</div>
      </div>
    </div>
  )
}

interface TransactionSubmittedContentProps {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> = ({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}) => {
  const { library } = useActiveWeb3React()
  const blockchain = chainId == 43114 ? "avalanche" : "fantom"
  const { addToken, success } = useAddTokenToMetaMask(currencyToAdd)
  return (
    <div>
      <div className="flex justify-end">
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <ArrowUpCircle strokeWidth={0.5} size={90} className={`text-${getChainColorCode(chainId)}`} />
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-xl font-bold">{`Transaction Submitted`}</div>
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            <div className={`font-bold text-${getChainColorCode(chainId)}`}>View on Explorer</div>
          </ExternalLink>
        )}
        {currencyToAdd && library?.provider?.isMetaMask && (
          <Button color="gradient" 
                        onClick={() => {
                const params: any = {
                  type: 'ERC20',
                  options: {
                    address: currencyToAdd.wrapped.address,
                    symbol: `${currencyToAdd.wrapped.symbol}`,
                    decimals: currencyToAdd.wrapped.decimals,
                    image: `https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/${blockchain}/assets/${currencyToAdd.wrapped.address}/logo.png`,
                  },
                }
                if (library && library.provider.isMetaMask && library.provider.request) {
                  library.provider
                    .request({
                      method: 'wallet_watchAsset',
                      params,
                    })
                    .then((success) => {
                      if (success) {
                        console.log('Successfully added SOUL to MetaMask')
                      } else {
                        throw new Error('Something went wrong.')
                      }
                    })
                    .catch(console.error)
                }
              }}
          className="w-auto mt-4">
            {!success ? (
              <RowFixed className="mx-auto space-x-2">
                <span>Add {currencyToAdd.symbol} to MetaMask</span>
                <Image
                  src={`https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/${blockchain}/assets/${currencyToAdd.wrapped.address}/logo.png`}
                  alt={`Add ${currencyToAdd.symbol} to MetaMask`}
                  width={24}
                  height={24}
                  // className="ml-1"
                />
              </RowFixed>
            ) : (
              <RowFixed>
                {`Added`} {currencyToAdd.symbol}
                <CheckCircle className="ml-1.5 text-2xl text-green" size="16px" />
              </RowFixed>
            )}
          </Button>
        )}
        {/* <Button color="gradient" onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
          Close
        </Button> */}
      </div>
    </div>
  )
}

interface ConfirmationModelContentProps {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="grid gap-4">
      <ModalHeader header={title} onClose={onDismiss} />
      {topContent()}
      {bottomContent()}
    </div>
  )
}

interface TransactionErrorContentProps {
  message: string
  onDismiss: () => void
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({ message, onDismiss }) => {

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex justify-between">
          <div className="text-lg font-medium text-high-emphesis">{`Error`}</div>
          <CloseIcon onClick={onDismiss} />
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="text-red" style={{ strokeWidth: 1.5 }} size={64} />
          <div className="font-bold text-red">{message}</div>
        </div>
      </div>
      <div>
        <Button color="gradient" size="lg" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  pendingText2?: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  pendingText2,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <HeadlessUiModal.Controlled
      isOpen={isOpen}
      chainId={chainId}
      onDismiss={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} pendingText2={pendingText2} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default TransactionConfirmationModal
