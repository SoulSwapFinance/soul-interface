import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { CurrencyAmount, JSBI, SOUL_SUMMONER_ADDRESS, Token, USD } from 'sdk'
import AssetInput from 'components/AssetInput'
import { Button } from 'components/Button'
import { HeadlessUiModal } from 'components/Modal'
import Switch from 'components/Switch'
import Typography from 'components/Typography'
import Web3Connect from 'components/Web3Connect'
// import { OLD_FARMS } from 'config/farms'
import { useMineListItemDetailsModal } from 'features/mines/MineListItemDetails'
import { setMinesModalOpen } from 'features/mines/minesSlice'
import { classNames, tryParseAmount } from 'functions'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import React, { useState } from 'react'

// import { PairType } from '../enum'
import { useUserInfo } from '../hooks'
import useMasterChef from '../hooks/useMasterChef'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { SOUL_ADDRESS } from 'constants/addresses'
import { usePrice } from 'hooks/usePrice'

// @ts-ignore TYPE NEEDS FIXING
const ManageBar = ({ farm }) => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const { setContent } = useMineListItemDetailsModal()
  const [toggle, setToggle] = useState(true)
  // const [value, setValue] = useState<string>()
  const [withdrawValue, setWithdrawValue] = useState<string>()
  const [depositValue, setDepositValue] = useState<string>()
  const { deposit, withdraw, enterStaking, leaveStaking } = useMasterChef()
  const addTransaction = useTransactionAdder()
  

  const liquidityToken = 
  
  farm.pair.token1 ? new Token(
    250,
    getAddress(farm.lpToken),
    18,
    'SOUL-LP'
    // farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    // farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP'
  ) : new Token(
    250,
    getAddress(farm.lpToken),
    18,
    'SOUL'
    // farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    // farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP'
  )

  const balance = useCurrencyBalance(account ?? undefined, liquidityToken)
  const stakedAmount = useUserInfo(farm, liquidityToken)
  // const parsedValue = tryParseAmount(value, liquidityToken)
  const parsedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const parsedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)
  const [approvalState, approve] = useApproveCallback(parsedDepositValue, SOUL_SUMMONER_ADDRESS[250])
  
  let token0 = useCurrency(farm.pair.token0?.id)
  let token1 = useCurrency(farm.pair.token1?.id)
  
  let [data] = useV2PairsWithPrice([[token0, token1]])
  let [state, pair, pairPrice] = data

  const depositError = !parsedDepositValue
    ? 'Enter Amount'
    : balance?.lessThan(parsedDepositValue)
    ? 'Insufficient Balance'
    : undefined
  const isDepositValid = !depositError
  const withdrawError = !parsedWithdrawValue
    ? 'Enter Amount'
    : stakedAmount?.lessThan(parsedWithdrawValue)
    ? 'Insufficient Balance'
    : undefined
  const isWithdrawValid = !withdrawError
  
  // const txnError = !parsedValue
  //   ? 'Enter Amount'
  //   : stakedAmount?.lessThan(parsedValue)
  //   ? 'Insufficient Balance'
  //   : undefined
  // const isWithdrawValid = !withdrawError

  const soulPrice = usePrice(SOUL_ADDRESS[250])

  const balanceFiatValueRaw
  = pair?.token1 ? Number(pairPrice) * Number(balance?.toSignificant())
  : Number(soulPrice) * Number(balance?.toSignificant())

const stakedAmountFiatValueRaw
  = pair?.token1 ? Number(pairPrice) * Number(stakedAmount?.toSignificant())
  : Number(soulPrice) * Number(stakedAmount?.toSignificant())

const balanceFiatValue
  = CurrencyAmount.fromRawAmount(
    USD[250],
    JSBI.BigInt(balanceFiatValueRaw.toFixed(USD[250].decimals).toBigNumber(USD[250].decimals))
  )

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {toggle ? i18n._(t`Deposit Liquidity`) : i18n._(t`Withdraw Liquidity`)}
            </Typography>
            <Switch
              size="sm"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              checkedIcon={<PlusIcon className="text-dark-1000" />}
              uncheckedIcon={<MinusIcon className="text-dark-1000" />}
            />
          </div>

          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Use one of the buttons to set a percentage or enter a value manually using the input field.`)}
          </Typography>
        </div>

        <div className="flex justify-end gap-2">
          {['25', '50', '75', '100'].map((multiplier, i) => (
            <Button
              variant="outlined"
              size="xs"
              color={toggle ? 'blue' : 'purple'}
              key={i}
              onClick={() => {
                toggle
                  ? balance
                    ? setDepositValue(balance.multiply(multiplier).divide(100).toExact())
                    : undefined
                  : stakedAmount
                  ? setWithdrawValue(stakedAmount.multiply(multiplier).divide(100).toExact())
                  : undefined
              }}
              className={classNames(
                'text-md border border-opacity-50',
                toggle ? 'focus:ring-blue border-blue' : 'focus:ring-purple border-purple'
              )}
            >
              {multiplier === '100' ? 'MAX' : multiplier + '%'}
            </Button>
          ))}
        </div>
        <AssetInput
          currencyLogo={false}
          currency={liquidityToken}
          value={toggle ? depositValue : withdrawValue}
          onChange={toggle ? setDepositValue : setWithdrawValue}
          // onChange={setDepositValue}
          balance={toggle ? balance : stakedAmount}
          showMax={true}
        />
          {/* <CurrencyInputPanel
            value={depositValue}
            currency={liquidityToken}
            id="add-liquidity-input-tokenb"
            hideIcon
            onUserInput={(value) => setDepositValue(value)}
            currencyBalance={toggle ? undefined : stakedAmount}
            fiatValue={balanceFiatValue}
            showMaxButton={false}
          /> */}
      </HeadlessUiModal.BorderedContent>
      {toggle ? (
        !account ? (
          <Web3Connect size="lg" color="blue" />
        ) : isDepositValid &&
          (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
          <Button
            fullWidth
            loading={approvalState === ApprovalState.PENDING}
            color="gradient"
            onClick={approve}
            disabled={approvalState !== ApprovalState.NOT_APPROVED}
          >
            {i18n._(t`Approve`)}
          </Button>
        ) : 
        ( farm.pair.token1 ? (
          <Button
            fullWidth
            color={!isDepositValid && !!parsedDepositValue ? 'red' : 'blue'}
            onClick={async () => {
              try {
                // KMP decimals depend on asset, SLP is always 18
                const tx = await deposit(farm.id, BigNumber.from(parsedDepositValue?.quotient.toString()))
                if (tx?.hash) {
                  setContent(
                    <HeadlessUiModal.SubmittedModalContent
                      txHash={tx?.hash}
                      header={i18n._(t`Success!`)}
                      subheader={i18n._(t`Success! Transaction successfully submitted`)}
                      onDismiss={() => dispatch(setMinesModalOpen(false))}
                    />
                  )
                  addTransaction(tx, {
                    summary: `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                }
              } catch (error) {
                console.error(error)
              }
            }}
            disabled={!isDepositValid}
          >
            {depositError || i18n._(t`Confirm Deposit`)}
          </Button>
          ) : (
          <Button
            fullWidth
            color={!isDepositValid && !!parsedDepositValue ? 'red' : 'blue'}
            onClick={async () => {
              try {
                // KMP decimals depend on asset, SLP is always 18
                const tx = await enterStaking(BigNumber.from(parsedDepositValue?.quotient.toString()))
                if (tx?.hash) {
                  setContent(
                    <HeadlessUiModal.SubmittedModalContent
                      txHash={tx?.hash}
                      header={i18n._(t`Success!`)}
                      subheader={i18n._(t`Success! Transaction successfully submitted`)}
                      onDismiss={() => dispatch(setMinesModalOpen(false))}
                    />
                  )
                  addTransaction(tx, {
                    summary: `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                }
              } catch (error) {
                console.error(error)
              }
            }}
            disabled={!isDepositValid}
          >
            {depositError || i18n._(t`Confirm Deposit`)}
          </Button>
        )
      )
      ) : !account ? (
        <Web3Connect color="blue" className="w-full" />
      ) : (
        farm.pair.token1 ?
        <Button
          fullWidth
          color={!isWithdrawValid && !!parsedWithdrawValue ? 'red' : 'blue'}
          onClick={async () => {
            try {
              // KMP decimals depend on asset, SLP is always 18
              // @ts-ignore TYPE NEEDS FIXING
              const tx = await withdraw(farm.id, BigNumber.from(parsedWithdrawValue?.quotient.toString()))
              if (tx?.hash) {
                setContent(
                  <HeadlessUiModal.SubmittedModalContent
                    txHash={tx?.hash}
                    header={i18n._(t`Success!`)}
                    subheader={i18n._(t`Success! Transaction successfully submitted`)}
                    onDismiss={() => dispatch(setMinesModalOpen(false))}
                  />
                )
                addTransaction(tx, {
                  summary: `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                })
              }
            } catch (error) {
              console.error(error)
            }
          }}
          disabled={!isWithdrawValid}
        >
          {withdrawError || i18n._(t`Confirm Withdraw`)}
        </Button>
      : 
      <Button
      fullWidth
      color={!isWithdrawValid && !!parsedWithdrawValue ? 'red' : 'blue'}
      onClick={async () => {
        try {
          // KMP decimals depend on asset, SLP is always 18
          // @ts-ignore TYPE NEEDS FIXING
          const tx = await leaveStaking(BigNumber.from(parsedWithdrawValue?.quotient.toString()))
          if (tx?.hash) {
            setContent(
              <HeadlessUiModal.SubmittedModalContent
                txHash={tx?.hash}
                header={i18n._(t`Success!`)}
                subheader={i18n._(t`Success! Transaction successfully submitted`)}
                onDismiss={() => dispatch(setMinesModalOpen(false))}
              />
            )
            addTransaction(tx, {
              summary: `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
            })
          }
        } catch (error) {
          console.error(error)
        }
      }}
      disabled={!isWithdrawValid}
    >
      {withdrawError || i18n._(t`Confirm Withdraw`)}
    </Button>
      )}
    </>
  )
}

export default ManageBar
