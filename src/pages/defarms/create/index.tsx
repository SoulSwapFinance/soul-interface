import { defaultAbiCoder } from '@ethersproject/abi'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import Card from 'components/Card'
import Container from 'components/Container'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Feature } from 'enums'
import NetworkGuard from 'guards/Network'
import { useManifesterContract } from 'hooks/useContract'
import Layout from 'layouts/Underworld'
import { useActiveWeb3React } from 'services/web3'
import { Field } from 'state/defarms/actions'
import { useCreateFarmActionHandlers, useDerivedCreateFarmInfo } from 'state/defarms/hook'
import { useTransactionAdder } from 'state/transactions/hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import ExternalLink from 'components/ExternalLink'
import { getChainColor, getChainColorCode } from 'constants/chains'

// import { AddressZero } from '@ethersproject/constants'
// import { Currency, MANIFESTER_ADDRESS } from 'sdk'
// import { CHAINLINK_PRICE_FEED_MAP } from 'config/oracles/chainlink'
// import { e10 } from 'functions/math'

export type ChainlinkToken = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export default function CreateFarm() {
  const { chainId } = useActiveWeb3React()
  const manifesterContract = useManifesterContract()
  const addTransaction = useTransactionAdder()
  const router = useRouter()
  const [rewardDays, setRewardDays] = useState(0)
  const [feeDays, setFeeDays] = useState(0)
  const [dailyReward, seDailyReward] = useState(0)

  // const { independentField, typedValue } = useCreateState()
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useCreateFarmActionHandlers()

  const { currencies, inputError } = useDerivedCreateFarmInfo()

  const handleDepositSelect = useCallback(
    (depositCurrency) => {
      onCurrencySelection(Field.DEPOSIT, depositCurrency)
    },
    [onCurrencySelection]
  )

  const handleRewardSelect = useCallback(
    (rewardCurrency) => {
      onCurrencySelection(Field.REWARD, rewardCurrency)
    },
    [onCurrencySelection]
  )

  const both = Boolean(currencies[Field.DEPOSIT] && currencies[Field.REWARD])

  const handleCreate = async () => {
    try {
      if (!both) return


      const defarmData = defaultAbiCoder.encode(
        ['address', 'uint', 'uint', 'uint'],
        [
          currencies[Field.REWARD].wrapped.address, // rewardAddress
          rewardDays,                               // duraDays
          feeDays,                                  // feeDays
          dailyReward                               // dailyReward
        ]
      )

      // console.log([
        currencies[Field.REWARD].wrapped.address,
        rewardDays,
        feeDays,
        dailyReward
      // ])

      const tx = await manifesterContract?.createManifestation(
        // chainId && MANIFESTER_ADDRESS[chainId], 
        defarmData
      )

      addTransaction(tx, {
        summary: `Create Farm ${currencies[Field.REWARD].symbol}/${currencies[Field.DEPOSIT].symbol} Chainlink`,
      })

      router.push('/defarms')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <CreateFarmLayout>
      <Head>
        <title>Create Farm | DeFarms by Soul</title>
        <meta key="description" name="description" content="Create Permissionless Farms with Soul" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="bg-dark-800">
            <div className="text-3xl text-high-emphesis leading-48px">Create Farm</div>
          </Card.Header>
        }
      >
        <Container maxWidth="full" className="space-y-6">
          <div className="grid grid-cols-1 grid-rows-1 gap-4 md:grid-rows-1 md:grid-cols-1">
            <CurrencyInputPanel
              chainId={chainId}
              label="Reward"
              hideBalance={true}
              hideInput={false}
              currency={currencies[Field.DEPOSIT]}
              onCurrencySelect={handleDepositSelect}
              otherCurrency={currencies[Field.REWARD]}
              showCommonBases={false}
              allowManageTokenList={false}
              showSearch={true}
              id="defarms-currency-reward"
            />
          </div>

          <Button
            color="gradient"
            className="w-full px-4 py-3 text-base rounded text-high-emphesis"
            onClick={() => handleCreate()}
            disabled={!both}
          >
            {inputError || 'Create'}
          </Button>
        </Container>
      </Card>
    </CreateFarmLayout>
  )
}

const CreateFarmLayout = ({ children }) => {
  const { chainId } = useActiveWeb3React()

  const { i18n } = useLingui()
  return (
    <Layout
      left={
        <div>
          <Card
            className="h-full bg-dark-900 text-center"
            // backgroundImage="/images/defarms/deposit.png"
            title={i18n._(t`Create New Farm`)}
            description={i18n._(
              t`We provide protocols with the opportunity to incentivize their communities to provide liquidity.`
              // t`If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.`
            )}
          />
          <div className={`flex rounded m-1`} />
          <Card
            className="h-full bg-dark-900 text-center"
            // backgroundImage="/images/defarms/deposit.png"
            title={i18n._(t`Why Trust Us?`)}
            description={i18n._(
              t`Don't trust; verify (below). We have a full-suite of unit tests that include edge cases testing for potential security exploits.`
              // `Don't just take our word for it, check out our open source repository.`
              // t`If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.`
            )}
          />
          <div className={`flex rounded text-center`}>
            <ExternalLink className={`border border-[${getChainColor(chainId)}] rounded rounded-xl text-${getChainColorCode(chainId)} bg- flex-center font-bold text-center mt-2 mb-2 w-full p-2 m-4`} href="https://github.com/SoulSwapFinance/manifest-contracts">
              {i18n._(t`Click Here to View Our Unit Tests`)}
            </ExternalLink>
          </div>
          <Card
            className="h-full bg-dark-900 text-center"
            // backgroundImage="/images/defarms/deposit.png"
            title={i18n._(t`Benefits & Features`)}
            description={i18n._(
              `Early Withraw Fee, Permisionless, Battle-Tested, Exchange Listing, Nominal Fee, Sleek UI, Co-Marketing`
              // t`If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.`
            )} />
        </div>
      }
    >
      {children}
    </Layout>
  )
}

CreateFarm.Guard = NetworkGuard(Feature.DEFARM)