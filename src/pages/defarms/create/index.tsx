// import { defaultAbiCoder } from '@ethersproject/abi'
import { ethers } from 'ethers'
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
import Typography from 'components/Typography'
import Modal from 'components/DefaultModal'
import ModalHeader from 'components/Modal/Header'
import { i18n } from '@lingui/core'
import { useDeFarmInfo, useUserTokenInfo } from 'hooks/useAPI'
import { computePairAddress, FACTORY_ADDRESS, MANIFESTER_ADDRESS, SOUL_ADDRESS, Token, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
import { formatNumber } from 'functions'
import Input from 'components/Input'
import useApprove from 'hooks/useApprove'
// import { formatNumber } from 'functions'

const CreateFarm = () => {
  const { account, chainId } = useActiveWeb3React()
  const manifesterContract = useManifesterContract()
  const addTransaction = useTransactionAdder()
  const router = useRouter()

  // KEY DATA INPUT //
  const [rewardAsset, setRewardAsset] = useState<Token>()
  const [assetSet, setAsset] = useState(false)
  const [feeDays, setFeeDays] = useState(14)
  const [feeSet, setFee] = useState(false)
  const [dailyReward, setDailyReward] = useState(0)
  const [enchanterId, setEnchanterId] = useState(0)
  const [rewardSet, setReward] = useState(false)
  const [rewardDays, setRewardDays] = useState(30)
  const [durationSet, setDuration] = useState(false)
  // const [campaignId, setCampaignId] = useState(0)
  const [depositCalculated, setDeposit] = useState(false)
  // const [sacrifice, setSacrifice] = useState(0)
  const [totalReward, setTotalReward] = useState(0)

  const [approved, setApproved] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // const { independentField, typedValue } = useCreateState()
  const { onCurrencySelection, onUserInput } = useCreateFarmActionHandlers()

  const { currencies, inputError } = useDerivedCreateFarmInfo()
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(rewardAsset?.wrapped.address)

  // DEFARM POOL INFO //
  const { defarmInfo } = useDeFarmInfo()
  const bloodSacrifice = Number(defarmInfo?.bloodSacrifice) / 1E18 / 100 // converts to %
  const { userTokenInfo } = useUserTokenInfo(account, SOUL_ADDRESS[chainId])
  const balance = Number(userTokenInfo?.balance) / 1E18
  // const campaignLength = Number(defarmInfo?.poolLength)
  const campaignReady = Boolean(rewardSet && durationSet && feeSet)
  // const maxUint = ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1))

  // const pairAddress =
  //   rewardAsset &&
  //   computePairAddress({
  //     factoryAddress: FACTORY_ADDRESS[chainId],
  //     tokenA: rewardAsset.wrapped,
  //     tokenB: WNATIVE[chainId]
  //   })

  const handleRewardSelect = useCallback(
    (rewardCurrency: Token) => {
      onCurrencySelection(Field.REWARD, rewardCurrency)
      setRewardAsset(rewardCurrency)
      setAsset(true)
      },
    [onCurrencySelection, setRewardAsset, setAsset]
  )

  const handleDailyRewards = useCallback(
    (dailyReward) => {
      onUserInput(Field.REWARD, dailyReward.toString())
      setDailyReward(dailyReward)
      setReward(true)
      console.log({ dailyReward })
      console.log({ balance })
    },
    [onUserInput, setDailyReward, setReward]
  )

  const handleEnchanterId = useCallback(
    (enchanterId) => {
      onUserInput(Field.ENCHANTER, enchanterId.toString())
      setEnchanterId(enchanterId)
      console.log({ enchanterId })
    },
    [onUserInput, setRewardDays, setDuration]
  )

  const handleRewardDays = useCallback(
    (rewardDays) => {
      onUserInput(Field.DURATION, rewardDays.toString())
      setRewardDays(rewardDays)
      setDuration(true)
      console.log({ rewardDays })
    },
    [onUserInput, setRewardDays, setDuration]
  )

  const handleWithdrawFee = useCallback(
    (feeDays) => {
      onUserInput(Field.FEE, feeDays.toString())
      setFeeDays(Number(feeDays))
      setFee(true)
      console.log({ feeDays })
    },
    [onUserInput, setFeeDays]
  )

  // const calculateDeposit = useCallback(
  //   () => {
  //     setTotalReward(Number(dailyReward) * Number(rewardDays))
  //     setSacrifice(Number(dailyReward) * Number(rewardDays) * Number(bloodSacrifice))
  //     setDeposit(true)
  //     console.log({ feeDays })
  //   },
  //   [setTotalReward, setSacrifice, setDeposit]
  // )

  // const handleCreateRewards = useCallback(
  //   (dailyReward, rewardDays) => {
  //     onUserInput(Field.REWARD, dailyReward.toString())
  //     setDailyReward(dailyReward)
  //     setRewardDays(rewardDays)
  //     setSacrifice(bloodSacrifice * rewardDays * dailyReward / 100)
  //     console.log({dailyReward})
  //   },
  //   [onUserInput, setDailyReward]
  // )

  const rewardSelected = Boolean(currencies[Field.REWARD])
  // const feeSelected = Boolean(currencies[Field.FEE])
  // const createReady = Boolean(rewardSelected && feeSelected)

  // checks: approval for defarm to move tokens.
  const fetchApproval = async () => {
    if (!account) {
      // alert('Connect Wallet')
    } else {
      // Checks if ManifestationContract can move tokens
      const amount = await erc20Allowance(account, MANIFESTER_ADDRESS[chainId])
      if (Number(amount) > 0) setApproved(true)
      return amount
    }
  }
  // approves DeFarm to move RewardToken
  const handleApprove = async () => {
    try {
      let tx
      tx = await erc20Approve(MANIFESTER_ADDRESS[chainId])
      await tx?.wait().then(await fetchApproval())
    } catch (e) {
      console.log(e)
      return
    }
  }

  const handleCreate = async () => {
    try {
      if (!rewardSelected) return

      // const defarmData = defaultAbiCoder.encode(
      //   ['address', 'uint', 'uint', 'uint'],
      //   [
      //     currencies[Field.REWARD].wrapped.address, // rewardAddress
      //     rewardDays,                               // duraDays
      //     feeDays,                                  // feeDays
      //     dailyReward                               // dailyReward
      //   ]
      // )

      // console.log([
      currencies[Field.REWARD].wrapped.address,
      enchanterId,
        rewardDays,
        // feeDays,
        dailyReward
      // ])

      const tx = await manifesterContract?.createManifestation(
        // chainId && MANIFESTER_ADDRESS[chainId], 
        // defarmData
        // pairAddress,                             // depositAddress
        currencies[Field.REWARD].wrapped.address,   // rewardAddress
        enchanterId,                                //  enchanterId 
        // true,                                    // isNative
        rewardDays,                                 // duraDays
        feeDays,                                    // feeDays
        dailyReward                                 // dailyReward
      )

      addTransaction(tx, {
        summary: `Create Farm ${currencies[Field.REWARD].symbol}`,
      })
      // router.push('/defarms')
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
          <Card.Header className="bg-dark-800 justify-center">
            <div className="text-3xl text-high-emphesis font-bold justify-center">Create DeFarm Campaign</div>
          </Card.Header>
        }
      >
        <Container maxWidth="full" className="space-y-6">
          {/* START: DAILY REWARD INPUT */}
          <Typography
            className={`font-bold text-xl text-center mb-4 border border-2 ${rewardSet && assetSet ? `border-purple` : `border-neonGreen`} m-2 p-2 rounded rounded-2xl`}
          >
            {`${!assetSet 
                ? `Select Reward Asset` 
                  : !rewardSet 
                    ? `Set Daily Rewards` 
                      : `Daily Reward`}`}
          </Typography>
          <div className="grid grid-cols-1 grid-rows-1 gap-4 md:grid-rows-1 md:grid-cols-1">
            <CurrencyInputPanel
              chainId={chainId}
              label="Reward Asset"
              hideBalance={true}
              // onMax={async () => await onMax(balance)}
              value={dailyReward.toString()}
              hideInput={false} // 
              currency={currencies[Field.REWARD]}
              onCurrencySelect={handleRewardSelect}
              onUserInput={handleDailyRewards}
              showCommonBases={false}
              allowManageTokenList={false}
              showSearch={true}
              id="defarms-currency-reward"
            />
          </div>
          {/* END: DAILY REWARD INPUT */}

          {/* START: ENCHANTER INPUT */}
          <div className={
            `flex flex-cols-2 border border-2 ${`border-purple`} rounded rounded-2xl p-2 m-2 justify-center text-center font-bold text-sm md:text-lg`}
          >
            <Typography className={`w-full text-sm md:text-lg font-bold`}>
              {`Referral Code`}
            </Typography>
            <Input.Numeric
              value={enchanterId}
              onUserInput={handleEnchanterId}
              className={`text-white bg-dark-1000 w-[1/5] mr-3 text-center`}
            />
          </div>
          {/* END: ENCHANTER INPUT */}

          {/* START: REWARD DURATION INPUT */}
          <div className={
            `flex flex-cols-2 border border-2 ${durationSet ? `border-purple` : `border-neonGreen`} rounded rounded-2xl p-2 m-2 justify-center text-center font-bold text-sm md:text-lg`}
          >
            <Typography className={`w-full text-sm md:text-lg font-bold`}>
              {`${!durationSet ? `Set` : ``} Reward Duration`}
            </Typography>
            <Input.Numeric
              value={rewardDays}
              onUserInput={handleRewardDays}
              className={`text-white bg-dark-1000 w-[1/5] mr-3 text-center`}
            />
            {`Days`}
          </div>
          {/* START: WITHDRAW FEE INPUT */}
          <div className={
            `flex flex-cols-2 border border-2 ${feeSet ? `border-purple` : `border-neonGreen`} rounded rounded-2xl p-2 m-2 justify-center text-center font-bold text-sm md:text-lg`}
          >
            <Typography className={`w-full text-sm md:text-lg font-bold`}>
              {`${!feeSet ? `Set` : ``} Withdraw Fee Duration`}
            </Typography>
            <Input.Numeric
              value={feeDays}
              onUserInput={handleWithdrawFee}
              className={`text-white bg-dark-1000 w-[1/5] mr-3 text-center`}
            />
            {`Days`}
          </div>
          {/* END: WITHDRAW FEE INPUT */}
          <div className={`flex flex-col bg-dark-1000 p-3 border border-1 
            ${feeSet && rewardSet && assetSet ? `border-purple` : `border-dark-700`} 
            w-full rounded rounded-2xl space-y-1`}
          >
            <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Reward Asset`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {rewardAsset?.wrapped.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Daily Reward`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {formatNumber(dailyReward, false, true)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Campaign Days`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {`${rewardDays} Days`}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Fee Duration`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {`${feeDays} Days`}
              </Typography>
            </div>
          </div>

          {/* <Button
            color={rewardSet && durationSet ? `neonGreen` : `avaxRed`}
            variant={`outlined`}
            className={`w-full px-4 py-3 text-base rounded text-high-emphesis text-white border 
          ${rewardSet && durationSet ? `border-neonGreen` : `border-avaxRed`}`}
            onClick={calculateDeposit}
            disabled={!rewardSelected || !durationSet || !rewardSet}
          >
            <Typography
            // className={`text-white font-bold`}
            >
              {!rewardSet ? `SETUP REWARDS`
                : !durationSet ? `SETUP DURATION`
                  : 'CALCULATE DEPOSIT'}
            </Typography>
          </Button> */}
          <div className={`flex flex-col bg-dark-1000 p-3 border border-1 
            ${rewardSet && assetSet && durationSet && feeSet ? `border-purple` : `border-dark-700`} 
            w-full rounded rounded-2xl space-y-1`}
          >
          <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Campaign Rewards`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {`${formatNumber(dailyReward * rewardDays, false, true)} ${rewardAsset?.wrapped.symbol}`}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Creation Fee (${bloodSacrifice * 100}%)`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {`${formatNumber(dailyReward * rewardDays * bloodSacrifice, false, true)} ${rewardAsset?.wrapped.symbol}`}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Creation Deposit`)}
              </Typography>
              <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                {`${formatNumber(
                  // campaign rewards
                  (dailyReward * rewardDays) +
                  // creation fee
                  (dailyReward * rewardDays * bloodSacrifice), false, true)} ${rewardAsset?.wrapped.symbol}`}
              </Typography>
            </div>
            </div>
          <Button
            color={rewardSet && assetSet && durationSet && feeSet ? `neonGreen` : `avaxRed`}
            variant={`outlined`}
            className={`w-full px-4 py-3 text-base rounded text-high-emphesis font-bold border
          ${rewardSet && assetSet && durationSet && feeSet ? `border-neonGreen` : `border-avaxRed`}`}
            onClick={() => setShowConfirmation(true)}
            disabled={!campaignReady}
          >
            <Typography
            // className={`text-white font-bold`}
            >        
          {rewardSet && assetSet && durationSet && feeSet ? `LAUNCH CAMPAIGN` : `MISSING CAMPAIGN SETUP`}
            </Typography>
          </Button>

          {showConfirmation && (
            <Modal isOpen={showConfirmation} onDismiss={
              () => setShowConfirmation(false)}>
              <div className="space-y-4">
                <ModalHeader header={`DeFarm Campaign Confirmation`} onClose={() => setShowConfirmation(false)} />
                <Typography variant="sm">
                  <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-dark-600">
                    {i18n._(t`Campaign Details`)}
                  </div>
                  • <b> {i18n._(t`Daily Reward`)}</b>: {`${formatNumber(dailyReward, false, true)} ${rewardAsset.wrapped.symbol} Daily`} <br />
                  • <b> {i18n._(t`Campaign Duration`)}</b>: {`${rewardDays} Days`}<br />
                  • <b> {i18n._(t`Early Withdraw Fee`)}</b>: {`${feeDays}% Day One, 1% less daily.`}<br />
                  • <b> {i18n._(t`Total Deposit`)}</b>: {`${formatNumber(
                    // campaign rewards
                    (dailyReward * rewardDays) +
                    // creation fee
                    (dailyReward * rewardDays * bloodSacrifice), false, true)} ${rewardAsset?.wrapped.symbol}`}
                  <br />

                  {/* <div className="mt-6 text-center">
                  <i><b> {i18n._(t`Update Logo? Submit PR (or just DM Buns)`)}</b></i>.
              </div> */}

                  {/* <b>100% of the fee</b> goes towards building our protocol-owned liquidity, which brings about long-term sustainability to our platform. */}
                </Typography>
                <Typography variant="sm" className="font-medium text-center">
                  {i18n._(t`QUESTIONS OR CONCERNS?`)}
                  <a href="mailto:soulswapfinance@gmail.com">
                    {' '}  {i18n._(t`CONTACT US`)}
                  </a>
                </Typography>
                {approved &&
                  <Button
                    color="neonGreen"
                    variant={`outlined`}
                    className="w-full px-4 py-3 text-base rounded text-high-emphesis"
                    onClick={() => handleApprove()}
                    disabled={!rewardSet || !assetSet || !durationSet || !feeSet}
                  >
                    {inputError || `Approve ${rewardAsset.wrapped.symbol}`}
                  </Button>
                }
                {/* {approved && */}
                  <Button
                    color="purple"
                    variant={`bordered`}
                    className="w-full px-4 py-3 rounded text-white font-bold"
                    onClick={() => handleCreate()}
                    disabled={!rewardSet || !assetSet || !durationSet || !feeSet}
                  >
                    <Typography
                      className={`text-white`}
                    >
                      {inputError || 'Confirm Creation'}
                    </Typography>
                  </Button>
                {/* } */}
              </div>
            </Modal>
          )}
        </Container>
      </Card>
    </CreateFarmLayout>
  )
}

// LAYOUT //
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

export default CreateFarm

CreateFarm.Guard = NetworkGuard(Feature.DEFARM)


