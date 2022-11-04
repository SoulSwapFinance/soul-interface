import chain, { chains } from 'constants/xchains'
// import { formatBytes32String } from 'ethers/lib/utils'
import React, { FC, useEffect, useState } from 'react'

import { TransactionProgressStep } from './TransactionProgressStep'
// import { Link } from 'components/Link'
// import Typography from 'components/Typography'
import { NetworkIcon } from 'components/Icons/NetworkIcon'
import { Currency, CurrencyAmount } from 'sdk'
// import { Icon } from '../Currency/Icon'

interface TransactionProgressStepper {
  id: string
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  srcBridgeToken: Currency
  dstBridgeToken: Currency
  srcTxHash: string
  crossChain: boolean
}

export const TransactionProgressStepper: FC<TransactionProgressStepper> = ({
  id,
  inputAmount,
  outputAmount,
  srcBridgeToken,
  dstBridgeToken,
  srcTxHash,
  crossChain,
}) => {
  // const { isError, isSuccess, isLoading } = useWaitForTransaction({
  //   // @ts-ignore
  //   hash: srcTxHash,
  //   chainId: inputAmount?.currency.chainId,
  //   enabled: Boolean(srcTxHash) && Boolean(inputAmount),
  // })
  
  // dummies
  let isError = false
  let isSuccess = true
  let isLoading = false
  //

  const [dstTxState, setDstTxState] = useState<{ txHash: string; isSuccess: boolean } | undefined>()
  const [delayed, setDelayed] = useState<boolean>(false)

  // temp disable //
  // useContractEvent({
  //   // ...getSoulXSwapContractConfig(outputAmount?.currency.chainId),
  //   chainId: outputAmount?.currency.chainId,
  //   eventName: 'StargateSoulXSwapDst',
  //   listener: (event) => {
  //     const [context, success, { transactionHash }] = event
  //     // console.log(event, formatBytes32String(id), context === formatBytes32String(id))
  //     if (context === formatBytes32String(id)) {
  //       setDstTxState({
  //         txHash: transactionHash,
  //         isSuccess: !success,
  //       })
  //     }
  //   },
  // })

  useEffect(() => {
    if (dstTxState?.isSuccess !== undefined) {
      setTimeout(() => {
        setDelayed(true)
      }, 750)
    }
  }, [dstTxState])

  if (!crossChain) {
    return (
      <div className="flex flex-col">
        {inputAmount && outputAmount && (
          <TransactionProgressStep
            lastStep={true}
            link={chains[inputAmount.currency.chainId].getTxUrl(srcTxHash)}
            status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
            header={
              <TransactionProgressStep.Header>
                Swapping{' '}
                <b>
                  {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
                </b>{' '}
                for{' '}
                <b>
                  {outputAmount?.toSignificant(6)} {outputAmount.currency.symbol}
                </b>
              </TransactionProgressStep.Header>
            }
            subheader={
              <TransactionProgressStep.SubHeader
              icon={
                <NetworkIcon 
                  // @ts-ignore
                  chainId={inputAmount.currency.chainId} 
                  width={16} 
                  height={16} 
                />
              }
                caption={chain[inputAmount.currency.chainId].name}
              />
            }
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {inputAmount && (
        <TransactionProgressStep
          link={chains[inputAmount.currency.chainId].getTxUrl(srcTxHash)}
          status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
          header={
            inputAmount.currency.wrapped.equals(srcBridgeToken) ? (
              <TransactionProgressStep.Header>
                Transfer{' '}
                <b>
                  {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
                </b>{' '}
                to Stargate Router
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swapping{' '}
                <b>
                  {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
                </b>{' '}
                for <b>{srcBridgeToken.symbol}</b>
              </TransactionProgressStep.Header>
            )
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon={
                <NetworkIcon
                  // @ts-ignore 
                  chainId={inputAmount.currency.chainId} 
                  width={16} 
                  height={16} 
                />
              }
              caption={chain[inputAmount.currency.chainId].name}
            />
          }
        />
      )}
      <TransactionProgressStep
        comingSoon
        status={dstTxState ? 'success' : isError ? 'skipped' : isSuccess ? 'pending' : 'idle'}
        subheader={''}
        header={<TransactionProgressStep.Header>
          Send <b>{srcBridgeToken.symbol}</b> to destination chain
        </TransactionProgressStep.Header>} 
      />
      {outputAmount && (
        <TransactionProgressStep
          link={dstTxState ? chains[outputAmount.currency.chainId].getTxUrl(dstTxState.txHash) : undefined}
          lastStep={true}
          status={
            dstTxState
              ? dstTxState.isSuccess
                ? 'success'
                : 'notice'
              : isError
              ? 'skipped'
              : isSuccess
              ? delayed
                ? 'pending'
                : 'idle'
              : 'idle'
          }
          header={
            (dstTxState && !dstTxState.isSuccess) || outputAmount.currency.wrapped.equals(dstBridgeToken) ? (
              <TransactionProgressStep.Header>
                Transfer{' '}
                <b>
                  {outputAmount.toSignificant(6)} {outputAmount.currency.symbol}
                </b>{' '}
                to recipient
              </TransactionProgressStep.Header>
            ) : (
              <TransactionProgressStep.Header>
                Swap <b>{dstBridgeToken.symbol}</b> for{' '}
                <b>
                  {outputAmount.toSignificant(6)} {outputAmount.currency.symbol}
                </b>
              </TransactionProgressStep.Header>
            )
          }
          subheader={
            <TransactionProgressStep.SubHeader
              icon=
                {<NetworkIcon
                  // @ts-ignore
                  chainId={outputAmount.currency.chainId} 
                  width={16} 
                  height={16} 
                />}
              caption={chain[outputAmount.currency.chainId].name}
            />
          }
        />
      )}
    </div>
  )
}
