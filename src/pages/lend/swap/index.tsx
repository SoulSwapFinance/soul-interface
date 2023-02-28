import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DAI_BNB_MARKET, DAI_ETH_MARKET, REFUNDER_ADDRESS, DAI_NATIVE_MARKET, LEND_MULTIPLIER, NATIVE_DAI_MARKET, Token } from 'sdk'
import { Button } from 'components/Button'
import Card from 'components/Card'
import Container from 'components/Container'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Feature } from 'enums'
import NetworkGuard from 'guards/Network'
import { useContract, useRefunderContract, useTokenContract } from 'hooks/useContract'
import Layout from 'layouts/Underworld'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import { WFTM } from 'constants/index'
import Typography from 'components/Typography'
import { i18n } from '@lingui/core'
import { formatNumber } from 'functions'
import useSendTransaction from 'hooks/useSendTransaction'
// import useSendTransaction from 'hooks/useSendTransaction'

export default function LendSwap() {
  const { account, chainId, library } = useActiveWeb3React()
  const provider = library.provider
  const [id, setId] = useState(0)
  const [currency, setCurrency] = useState<Token>(null)
  const [pairAddress, setPairAddress] = useState(DAI_NATIVE_MARKET[chainId])
  const [pairSymbol, setPairSymbol] = useState('FTM Market')
  const [amount, setAmount] = useState(0)
  const [refundable, setRefundable] = useState(0)
  const [available, setAvailable] = useState(0)
//   const [supplied, setSuppliedAmount] = useState(0)
//   const [lentAmount, setLentAmount] = useState(0)
  const [errored, setErrored] = useState(false)
//   const [inputError, setError] = useState('')

const refunderContract = useRefunderContract()
const addTransaction = useTransactionAdder()
let UnderworldPair = new Token(chainId, pairAddress, 18, 'Underworld')
const PairContract = useTokenContract(pairAddress)


// const { underworldUserInfo } = useUnderworldUserInfo(pairAddress)
// const { userTokenInfo } = useUserTokenInfo(account, pairAddress)

    // [ √ ] updates: id
    const handleAssetSelect = useCallback(
        (selectedCurrency: Token) => {
            setCurrency(selectedCurrency)
            let assetSymbol = selectedCurrency.wrapped.symbol

            let id = 
                assetSymbol == 'BNB' ? 0
                : assetSymbol == 'DAI' ? 1
                : assetSymbol == 'ETH' ? 2
                : assetSymbol == 'WFTM' ? 3
                : 4
            setId(id)

            handlePairSelect(selectedCurrency)
            handleRefundable(selectedCurrency)
            handleAvailable(selectedCurrency)

            let pairSymbol =
                id == 0 ? 'BNB Market'
                : id == 1 ? 'DAI Market'
                : id == 2 ? 'ETH Market'
                : id == 3 ? 'FTM Market'
                : 'Invalid Selection'
            setPairSymbol(pairSymbol)

            id == 4 ? setErrored(true) : setErrored(false)
            console.log({id})

        }, [setCurrency, setId, setPairSymbol, setErrored]
    )

    const handleAssetAmount = useCallback(
        (inputAmount) => {
            setAmount(inputAmount)
            setPairAddress(pairAddress)
        }, [setAmount]
    )

    const handleAvailable = useCallback(
        async (selectedCurrency: Token) => {
            let assetSymbol = selectedCurrency.wrapped.symbol
            let result = 
                assetSymbol == 'BNB' ? await refunderContract?.showAvailable(0)
                : assetSymbol == 'DAI' ? await refunderContract?.showAvailable(1)
                : assetSymbol == 'ETH' ? await refunderContract?.showAvailable(2)
                : assetSymbol == 'WFTM' ? await refunderContract?.showAvailable(3)
                : 0
            let _available = await result?.toString()
            let available = Number(_available) / 1E18
                setAvailable(available)
                console.log({result})
        }, [setAvailable]
    )

    const handleRefundable = useCallback(
        async (selectedCurrency: Token) => {
            let assetSymbol = selectedCurrency.wrapped.symbol
            let result = 
                assetSymbol == 'BNB' ? await refunderContract?.showRefundable(0, account)
                : assetSymbol == 'DAI' ? await refunderContract?.showRefundable(1, account)
                : assetSymbol == 'ETH' ? await refunderContract?.showRefundable(2, account)
                : assetSymbol == 'WFTM' ? await refunderContract?.showRefundable(3, account)
                : 0
            let _refundable = await result?.toString()
            let refundable = Number(_refundable) / 1E18
                setRefundable(refundable)
                console.log({result})
        }, [setRefundable]
    )

    // [ √ ] updates: pairAddress
    const handlePairSelect = useCallback(
        (selectedCurrency: Token) => {
            let assetSymbol = selectedCurrency.wrapped.symbol

            let pairAddress = 
                assetSymbol == 'BNB' ? DAI_BNB_MARKET[chainId]
                : assetSymbol == 'DAI' ? NATIVE_DAI_MARKET[chainId]
                : assetSymbol == 'ETH' ? DAI_ETH_MARKET[chainId]
                : assetSymbol == 'WFTM' ? DAI_NATIVE_MARKET[chainId]
                : DAI_NATIVE_MARKET[chainId]

        setPairAddress(pairAddress)
        console.log({pairAddress})

        }, [setPairAddress]
    )

  const handleRefund = async () => {
    try {
        if (errored) return

        const tx = await refunderContract?.refund(
            id, 
            amount
        )

      addTransaction(tx, {
        summary: `Swapping for Underlying Asset`,
      })

    } catch (e) {
      console.error(e)
    }
  }

  const {
    sendTx: handleApproveToken,
    isPending: isApprovePending,
    isCompleted: isApproveCompleted,
  } = useSendTransaction(() =>
    PairContract.approve(REFUNDER_ADDRESS[chainId], (amount * 2 * 1E18).toString())
  );

  return (
    <LendSwapLayout>
      <Head>
        <title>Swap Asset | Underworld by Soul</title>
        <meta key="description" name="description" content="Reclaim Retired Asset on Underworld by Soul" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="bg-dark-800 text-2xl font-bold"> Reclaim Retired Asset (1:1)
          </Card.Header>
        }
      >
        <Container maxWidth="full" className="space-y-6">
            <div className={`grid grid-cols-2`}>
            <Typography
                className={`font-bold text-2xl text-green text-center`}
                >
                {`Redeemable Assets`}
            </Typography>
            <Typography
                className={`font-bold text-2xl text-green text-center`}
                >
                {`${formatNumber(available, false, true)} ${currency?.wrapped.symbol}`}
            </Typography>
            </div>
          <div className="grid grid-cols-1">
            <CurrencyInputPanel
              label="Asset"
              chainId={chainId}
              hideBalance={true}
              hideInput={false}
              currency={currency}
              onCurrencySelect={handleAssetSelect}
              onUserInput={handleAssetAmount}
              showCommonBases={false}
              showSearch={false}
              id="underworld-currency-asset"
            />
          </div>

            <Button 
                color="gradient"
                className="w-full px-4 py-3 text-base rounded text-high-emphesis"
                onClick={handleApproveToken}
            >
                {isApprovePending
                ? "Approving"
                : isApproveCompleted
                    ? "Approved"
                    : "Approve"}
            </Button>

            <Button
                color="gradient"
                className="w-full px-4 py-3 text-base rounded text-high-emphesis"
                onClick={() => handleRefund()}
                disabled={id == 4}
                >
                {`${id == 4 ? `Invalid Asset Selected`
                    : amount == 0 ? `Enter Amount`
                        : `Swap Pair (1:1) for ${currency.wrapped.symbol}`
                }`}
            </Button>
        </Container>

        <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-purple w-full space-y-1">
            <div className="flex justify-between">
                <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Underworld Market`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                {pairSymbol}
                </Typography>
            </div>
            <div className="flex justify-between">
                <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Pair Balance`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                {`${formatNumber(refundable, false, true)} ${currency?.wrapped.symbol}`}
                </Typography>
            </div>

            <div className="flex justify-between">
                <Typography className="text-green" fontFamily={'medium'}>
                {i18n._(t`Maximum Refundable`)}
                </Typography>
                <Typography className="text-green" weight={600} fontFamily={'semi-bold'}>
                {`${formatNumber(available >= refundable ? refundable : available, false, true)} ${currency?.wrapped.symbol}`}
                </Typography>
            </div>
        </div>
            <div className="flex justify-between mt-4 text-center">
                <Typography className="text-white" fontFamily={'medium'}>
               {`This exchange is designed to provide a 1:1 redemption for lent assets. The purpose of this swap is to enable those impacted by the flash loan attack of 2022
               to redeem their underlying assets (minus interest).`}
                </Typography>
            </div>
      </Card>
    </LendSwapLayout>
  )
}

const LendSwapLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
  // @ts-ignore TYPE NEEDS FIXING
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/underworld/deposit.png"
          title={i18n._(t`Reclaim Retired Underworld Assets`)}
          description={i18n._(
            t`For those looking to reclaim their retired Underworld Assets (1:1).`
          )}
        />
      }
    >
      {children}
    </Layout>
  )
}

LendSwap.Guard = NetworkGuard(Feature.UNDERWORLD)