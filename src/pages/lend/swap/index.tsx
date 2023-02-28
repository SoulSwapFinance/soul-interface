import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DAI_BNB_MARKET, DAI_ETH_MARKET, DAI_NATIVE_MARKET, LEND_MULTIPLIER, NATIVE_DAI_MARKET, Token } from 'sdk'
import { Button } from 'components/Button'
import Card from 'components/Card'
import Container from 'components/Container'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Feature } from 'enums'
import NetworkGuard from 'guards/Network'
import { useRefunderContract } from 'hooks/useContract'
import Layout from 'layouts/Underworld'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import { WFTM } from 'constants/index'
import Typography from 'components/Typography'
import { i18n } from '@lingui/core'
import { formatNumber } from 'functions/format'
import { useUnderworldUserInfo, useUserPairInfo, useUserTokenInfo } from 'hooks/useAPI'
import { useTokenBalance } from 'state/wallet/hooks'

export default function LendSwap() {
  const { account, chainId } = useActiveWeb3React()
  const [id, setId] = useState(0)
  const [currency, setCurrency] = useState(WFTM[chainId])
  const [pairAddress, setPairAddress] = useState(DAI_NATIVE_MARKET[chainId])
  const [pairSymbol, setPairSymbol] = useState('FTM Market')
  const [amount, setAmount] = useState(0)
  const [supplied, setSuppliedAmount] = useState(0)
//   const [lentAmount, setLentAmount] = useState(0)
  const [errored, setErrored] = useState(false)
//   const [inputError, setError] = useState('')

  const refunderContract = useRefunderContract()
  const addTransaction = useTransactionAdder()
  const { underworldUserInfo } = useUnderworldUserInfo(pairAddress)

    const handleAssetSelect = useCallback(
        async (selectedCurrency: Token) => {
            await setCurrency(selectedCurrency)
            let assetSymbol = selectedCurrency.wrapped.symbol

            let id = 
                assetSymbol == 'BNB' ? 0
                : assetSymbol == 'DAI' ? 1
                : assetSymbol == 'ETH' ? 2
                : assetSymbol == 'WFTM' ? 3
                : 4
            await setId(id)

            let pair =
                id == 0 ? DAI_BNB_MARKET[chainId]
                : id == 1 ? NATIVE_DAI_MARKET[chainId]
                : id == 2 ? DAI_ETH_MARKET[chainId]
                : id == 3 ? DAI_NATIVE_MARKET[chainId]
                : DAI_NATIVE_MARKET[chainId]
            await setPairAddress(pair)

            let pairSymbol =
                id == 0 ? 'BNB Market'
                : id == 1 ? 'DAI Market'
                : id == 2 ? 'ETH Market'
                : id == 3 ? 'FTM Market'
                : 'Invalid Selection'
            await setPairSymbol(pairSymbol)

            await handleCalculation()
            id == 4 ? setErrored(true) : setErrored(false)
            console.log({pairAddress})

        }, [setCurrency, setId, setPairAddress, setPairSymbol, setErrored]
    )

    const handleAssetAmount = useCallback(
        (inputAmount) => {
            setAmount(inputAmount)
            setPairAddress(pairAddress)
        }, [setAmount]
    )


    const handleCalculation = async () => {
            const suppliedAmount = Number(underworldUserInfo?.userBalance) / 10 ** 18
            setSuppliedAmount(suppliedAmount)
            // console.log({pairAddress})
            console.log({suppliedAmount})

      }

      
  const handleRefund = async () => {
    try {
        if (errored) return
      const tx = await refunderContract?.refund(
        id, amount
        )

      addTransaction(tx, {
        summary: `Swapping for Underlying Asset`,
      })

    //   router.push('/lend')
    } catch (e) {
      console.error(e)
    }
  }

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
                {i18n._(t`Underworld Pair`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                {pairSymbol}
                </Typography>
            </div>
            <div className="flex justify-between">
                <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Lent Amount`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                {formatNumber(supplied, false, true)} {currency.wrapped.symbol}
                </Typography>
            </div>
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