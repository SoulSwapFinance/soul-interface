import React, { useState } from 'react'
import { CurrencyAmount, Token, JSBI } from 'sdk'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Disclosure, Switch, Tab, Transition } from '@headlessui/react'
import { CurrencyLogo } from '../../components/CurrencyLogo'
import DoubleLogo from '../../components/DoubleLogo'
import Badge from '../../components/Badge'
import {
  classNames,
  formatNumberScale,
  formatNumber,
  formatPercent,
  formatCurrencyAmount,
  tryParseAmount,
} from '../../functions'
import Input from '../../components/Input'
import { Button, ButtonError } from '../../components/Button'
import Settings from '../../components/Settings'
import ExternalLink from '../../components/ExternalLink'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import QuestionHelper from '../../components/QuestionHelper'
import { useCurrency } from '../../hooks/Tokens'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { getAddress } from '@ethersproject/address'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { ApprovalState, useApproveCallback } from '../../hooks'
import Dots from '../../components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { usePendingAmount, useClaimableAmount, useBondContract, useRemainingVesting } from 'features/bonds/hooks'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from 'services/web3'
import { LUX_ADDRESS } from 'constants/addresses'
import { DAI } from 'constants/tokens'

const BondItem = ({ bond, ...rest }) => {
  const { i18n } = useLingui()
  const [toggle, setToggle] = useState(false)
  const { account } = useActiveWeb3React()
  // const { deposit, claim, luxorDeposit } = useBondContract()
  const { deposit, claim, luxorDeposit } = useBondContract()

  const addTransaction = useTransactionAdder()

  const remainingVesting = bond ? useRemainingVesting : ''
  const principal = useCurrency(bond?.principal)
  const principalToken = DAI[250]
  // const principalToken = new Token(250, getAddress(bond?.principal), bond?.decimals, bond?.symbol)
  const luxorToken = new Token(250, getAddress(LUX_ADDRESS[250]), 18, 'LUX')

  const [depositValue, setDepositValue] = useState('')
  const parsedDepositValue = tryParseAmount(depositValue, principalToken)
  const [approvalState, approve] = useApproveCallback(parsedDepositValue)

  const [luxorDepositValue, setLuxorDepositValue] = useState('')
  const parsedLuxorDepositValue = tryParseAmount(luxorDepositValue, luxorToken)
  const [luxorApprovalState, luxorApprove] = useApproveCallback(parsedLuxorDepositValue)

  const claimableAmount = bond
    ? useClaimableAmount(luxorToken)
    : CurrencyAmount.fromRawAmount(luxorToken, JSBI.BigInt('0'))
  const pendingAmount = bond
    ? usePendingAmount(luxorToken)
    : CurrencyAmount.fromRawAmount(luxorToken, JSBI.BigInt('0'))
  const purchasedAmount = bond
    ? CurrencyAmount.fromRawAmount(principalToken, Number(bond?.purchased | 0))
    : CurrencyAmount.fromRawAmount(luxorToken, JSBI.BigInt('0'))
  const balance = useCurrencyBalance(account, principalToken)
  const luxorAvailableAmount = bond
    ? CurrencyAmount.fromRawAmount(luxorToken, Number(bond?.luxorAvailable | 0))
    : CurrencyAmount.fromRawAmount(luxorToken, JSBI.BigInt('0'))
  const luxorFromParsedAmount =
    bond && parsedDepositValue
      ? CurrencyAmount.fromRawAmount(
          luxorToken,
          JSBI.divide(
            JSBI.multiply(JSBI.BigInt(parsedDepositValue.quotient.toString()), JSBI.BigInt(bond?.luxorPerPrincipal)),
            JSBI.BigInt(bond.ratioPrecision)
          )
        )
      : CurrencyAmount.fromRawAmount(luxorToken, JSBI.BigInt('0'))
  const maxPrincipalAmount = bond
    ? CurrencyAmount.fromRawAmount(
        principalToken,
        Number(luxorAvailableAmount) 
        * (bond?.luxorPerPrincipal / bond.ratioPrecision) | 0)
      //   JSBI.multiply(
      //     JSBI?.divide(JSBI.BigInt(
      //       Number(luxorAvailableAmount?.quotient.toString())), JSBI.BigInt(Number(b | 0))),
      //     JSBI.BigInt(bond.ratioPrecision)
      //   ))
      // )
    : CurrencyAmount?.fromRawAmount(luxorToken, JSBI.BigInt('0')
    )

  const depositError = !parsedDepositValue
    ? 'Enter Amount'
    : balance?.lessThan(parsedDepositValue)
    ? 'Insufficient Balance'
    : luxorAvailableAmount.lessThan(luxorFromParsedAmount)
    ? 'Exceeds Max'
    : undefined
  const isDepositValid = !depositError

  return (
    <Disclosure {...rest}>
      {({ open }) => (
        <div className="rounded-8 shadow-4 bg-dark-1000 w-full">
          <Disclosure.Button className={'w-full p-6 text-left cursor-pointer select-none text-sm md:text-base'}>
            <div className="grid grid-cols-3 md:grid-cols-7 relative gap-y-38 md:gap-y-0 gap-x-3 md:gap-x-0">
              <div className="flex bg-dark-1000 col-span-3 md:col-span-3 space-x-4">
                {bond?.isLp ? (
                  <DoubleLogo
                    currency0={useCurrency(bond?.token0_id)}
                    currency1={useCurrency(bond?.token1_id)}
                    size={44}
                  />
                ) : (
                  <CurrencyLogo currency={ DAI[250] } size={44} />
                )}
                <div className="flex flex-col bg-dark-1000 justify-center">
                  <Typography variant="base" weight={600} lineHeight={24} fontFamily={'semi-bold'}>
                    {bond?.isLp ? bond?.token0_symbol + ' - ' + bond?.token1_symbol : bond?.symbol}
                  </Typography>
                  <div className="flex gap-2">
                    {bond?.isBoosted && (
                      <Badge 
                      // size="small"
                        color="gray" value="Boosted" 
                    //   textColor="yellow" className="uppercase"
                      >
                        Boosted
                      </Badge>
                    )}
                    {bond?.isNew && (
                      <Badge 
                    //   size="small" 
                      color="purple" value="New" 
                    //   textColor="purple" 
                      className="uppercase text-purple"
                      >
                        New
                      </Badge>
                    )}
                    {Number(formatCurrencyAmount(luxorAvailableAmount, 1)) < 10 && (
                      <Badge 
                      // size="small" 
                    color="red" value='Out'
                    // textColor="red" 
                    className="uppercase"
                    >

                    </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex bg-dark-1000 flex-col items-start justify-center">
                <Typography
                  variant={'xxs'}
                  lineHeight={14}
                  fontFamily={'medium'}
                  className={'text-white'}
                >
                  Bond Price
                </Typography>
                <Typography
                  className="flex gap-1 bg-dark-1000 items-center text-xs md:text-base leading-4 md:leading-6"
                  fontFamily={'medium'}
                >
                  {formatNumber(bond?.bondPrice, true)}
                  <QuestionHelper
                    // width={'small'}
                    text={
                      <div className="flex flex-col space-y-2">
                        The current LUX token price when purchased via bonding.
                      </div>
                    }
                  />
                </Typography>
              </div>
              <div className="flex flex-col bg-dark-1000 tems-start justify-center">
                <Typography
                  variant={'xxs'}
                  lineHeight={14}
                  fontFamily={'medium'}
                  className={'text-white'}
                >
                  ROI
                </Typography>
                <Typography
                  className="flex gap-1 bg-dark-1000 items-center text-xs md:text-base leading-4 md:leading-6"
                  fontFamily={'medium'}
                >
                  {formatPercent((bond?.luxorPrice / bond?.bondPrice) * 100 - 100)}
                  <QuestionHelper
                    // width={'small'}
                    text={
                      <div className="flex bg-dark-1000 flex-col space-y-2">
                        {i18n._(t`Your net return over the total investment.`)}
                      </div>
                    }
                  />
                </Typography>
              </div>
              <div className="flex flex-col items-start justify-center">
                <Typography
                  variant={'xxs'}
                  lineHeight={14}
                  fontFamily={'medium'}
                  className={'text-black-40 dark:text-black-70'}
                >
                  Vesting Term
                </Typography>
                <Typography
                  className="flex gap-1 items-center text-xs md:text-base leading-4 md:leading-6"
                  fontFamily={'medium'}
                >
                  {bond.vestingDays} Days
                  <QuestionHelper
                    // width={'small'}
                    text={
                      <div className="flex flex-col space-y-2">
                        {i18n._(
                          t`The time remaining until the LUX bond fully matures and 100% of the vested LUX is claimable.  Vesting is linear, with a portion of vested tokens released every second.`
                        )}
                        <br />
                        <br />
                        <p>
                          <strong className="text-accent bold">Note:&nbsp;</strong>
                          The unvested portion can be claimed as it becomes available.
                        </p>
                      </div>
                    }
                  />
                </Typography>
              </div>
              <div className="flex-col items-start justify-center hidden md:flex">
                <Typography
                  variant={'xxs'}
                  lineHeight={14}
                  fontFamily={'medium'}
                  className={'text-black-40 dark:text-black-70'}
                >
                  Purchased
                </Typography>
                <Typography className={'text-xs md:text-base leading-4 md:leading-6'} fontFamily={'medium'}>
                  {formatNumber(Number(purchasedAmount.toExact()) * bond?.principalPrice, true)}
                </Typography>
              </div>
              {!open && (
                <span className="absolute right-0 top-2 md:block hidden">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.00055 8.7496C7.38982 8.36033 8.02085 8.35998 8.41055 8.74883L12.2952 12.625L16.1798 8.74883C16.5695 8.35998 17.2005 8.36033 17.5898 8.7496C17.9794 9.13917 17.9794 9.77079 17.5898 10.1604L12.8406 14.9095C12.5394 15.2108 12.051 15.2108 11.7497 14.9095L7.00055 10.1604C6.61098 9.77079 6.61098 9.13917 7.00055 8.7496Z"
                      fill="#8B88A8"
                    />
                  </svg>
                </span>
              )}
              {open && (
                <span className="absolute right-0 top-2 md:block hidden">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.5898 14.7503C17.2005 15.1396 16.5695 15.14 16.1798 14.7511L12.2952 10.875L8.41055 14.7511C8.02085 15.14 7.38982 15.1396 7.00055 14.7503C6.61098 14.3608 6.61098 13.7291 7.00055 13.3396L11.7497 8.59041C12.051 8.28916 12.5394 8.28916 12.8406 8.59041L17.5898 13.3396C17.9794 13.7291 17.9794 14.3608 17.5898 14.7503Z"
                      fill="#8B88A8"
                    />
                  </svg>
                </span>
              )}
            </div>
          </Disclosure.Button>

          {open && (
            <Transition
              show={true}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="px-3">
                <Disclosure.Panel
                  className="flex w-full border-t-0 md:border-t rounded rounded-t-none dark:border-black-20"
                  static
                >
                  <div className="flex flex-col w-full py-3 relative">
                    <Tab.Group>
                      <Tab.List className="flex flex-col md:flex-row items-center mb-3 space-x-2 p-3px text-black-70">
                        <div className="flex items-center">
                          <Tab
                            className={({ selected }) =>
                              `${
                                selected ? 'bg-transparent text-black dark:text-white-10' : ''
                              } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border-transparent border-1 rounded-8 hover:text-black dark:hover:text-white-10`
                            }
                          >
                            {/* {i18n._(t`Bond`)} */}
                          </Tab>
                          {/*
                              <Tab
                              className={({ selected }) =>
                              `${
                              selected ? 'gradient-20 text-black dark:text-white-10' : ''
                              } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border-transparent border-1 rounded-8 hover:text-black dark:hover:text-white-10`
                              }
                              >
                              {i18n._(t`Liquidity`)}
                              </Tab>
                              */}
                        </div>
                        <div className="hidden md:block spacer-element"></div>
                        {/* <div className="flex items-center mt-3 md:mt-0">
                           <Button variant={'link'} color={'accent'} className={'flex gap-2 dark:text-accent'}>
                            <ExternalLink
                              startIcon={
                                <svg
                                  className="blue-dark-theme-pink"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <style>{`
                                    .blue-dark-theme-pink path { fill: #1043ff; }
                                    .dark .blue-dark-theme-pink path { fill: #24FFCA; }
                                    `}</style>
                                  <path d="M15.8333 15.8333H4.16667V4.16667H10V2.5H4.16667C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V10H15.8333V15.8333ZM11.6667 2.5V4.16667H14.6583L6.46667 12.3583L7.64167 13.5333L15.8333 5.34167V8.33333H17.5V2.5H11.6667Z" />
                                </svg>
                              }
                              href={250 && bond && getExplorerLink(250, bond.address, 'address')}
                              className="flex gap-2 no-underline cursor-pointer hover:no-underline focus:no-underline active:no-underline text-blue dark:text-accent"
                            >
                              {i18n._(t`View Contract`)}
                            </ExternalLink>
                          </Button>
                          <Button variant={'link'} color={'gray'}>
                            <QuestionHelper
                            //   title={i18n._(t`How it works`)}
                            //   width={'small'}
                              text={
                                <div className="flex flex-col space-y-2">
                                  <div className="flex flex-col">
                                    <Typography variant="sm">
                                      <strong className="text-accent bold">1.&nbsp;</strong>
                                      {i18n._(t`Bond your`)}{' '}
                                      {bond?.isLp ? bond?.token0_symbol + ' - ' + bond?.token1_symbol : bond?.symbol}{' '}
                                      {i18n._(t`tokens.`)}
                                    </Typography>
                                  </div>
                                  <div className="flex flex-col">
                                    <Typography variant="sm">
                                      <strong className="text-accent bold">2.&nbsp;</strong>
                                      {i18n._(t`Claim your LUX tokens during or after vesting period.`)}
                                    </Typography>
                                  </div>
                                </div>
                              }
                            />
                          </Button>
                        </div> */}
                      </Tab.List>
                      <Tab.Panel className={'outline-none'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-dark-1000 rounded-8 p-3">
                          <div className="flex flex-col items-start justify-center bg-dark-1000 w-full vertical-separator relative">
                            <div className="flex items-center">
                              <Typography variant={'xs'} lineHeight={16} className={'text-white'}>
                                Your {bond?.isLp ? bond?.token0_symbol + ' - ' + bond?.token1_symbol : bond?.symbol}{' '}
                                Balance:&nbsp;
                              </Typography>
                              <Typography className={'text-white'} fontFamily={'semi-bold'}>
                                {account ? formatCurrencyAmount(balance, 4) : '-'}
                              </Typography>
                            </div>
                            <div className="flex flex-row items-start font-bold md:text-base gap-3 w-full">
                              <div className="flex-grow inline-flex bg-dark-1000 p-2 rounded-8 border border-gradient">
                                <Input.Numeric
                                  id="token-amount-input"
                                  value={depositValue}
                                  onUserInput={(value) => setDepositValue(value)}
                                  className="w-full text-sm leading-5 bg-dark-1000"
                                  disabled={!account}
                                />
                                <Button
                                  onClick={() =>
                                    maxPrincipalAmount.lessThan(balance)
                                      ? setDepositValue(maxPrincipalAmount.toExact())
                                      : setDepositValue(balance.toExact())
                                  }
                                  size="xs"
                                  variant={'outlined'}
                                  color={'accent'}
                                  disabled={!account}
                                  className={'text-accent'}
                                >
                                  {i18n._(t`MAX`)}
                                </Button>
                              </div>
                              {isDepositValid &&
                              (approvalState === ApprovalState.NOT_APPROVED ||
                                approvalState === ApprovalState.PENDING) ? (
                                <Button onClick={approve} disabled={approvalState !== ApprovalState.NOT_APPROVED}>
                                  {approvalState === ApprovalState.PENDING ? (
                                    <Dots>{i18n._(t`Approving`)}</Dots>
                                  ) : (
                                    i18n._(t`Approve`)
                                  )}
                                </Button>
                              ) : (
                                <ButtonError
                                  onClick={async () => {
                                    try {
                                      const tx = await deposit(BigNumber.from(parsedDepositValue.quotient.toString()))
                                      addTransaction(tx, {
                                        summary: `Bond ${
                                          bond?.isLp ? bond?.token0_symbol + ' - ' + bond?.token1_symbol : bond?.symbol
                                        }`,
                                      })
                                    } catch (error) {
                                      console.error(error)
                                    }
                                  }}
                                  disabled={!isDepositValid || !account}
                                  error={!isDepositValid && !!parsedDepositValue}
                                >
                                  {depositError || i18n._(t`Bond`)}
                                </ButtonError>
                              )}
                            </div>
                            {account === '0xC40d16C47394a506D451475C8A7c46c1175C1DA1' ||
                            account === '0x999e77396E78e0B842f2b4622E3Ef3164218b7a6' ? (
                              <div className="flex flex-row items-start bg-dark-800 font-bold md:text-base gap-3 w-full">
                                <div className="flex-grow inline-flex bg-dark-800 dark:border-purple-80 p-2 rounded-8 border border-gradient">
                                  <Input.Numeric
                                    id="token-amount-input"
                                    value={luxorDepositValue}
                                    onUserInput={(value) => setLuxorDepositValue(value)}
                                    className="w-full text-sm leading-5 bg-transparent"
                                  />
                                </div>
                                {luxorApprovalState === ApprovalState.NOT_APPROVED ||
                                luxorApprovalState === ApprovalState.PENDING ? (
                                  <Button
                                    onClick={luxorApprove}
                                    disabled={luxorApprovalState !== ApprovalState.NOT_APPROVED}
                                  >
                                    {luxorApprovalState === ApprovalState.PENDING ? (
                                      <Dots>{i18n._(t`Approving`)}</Dots>
                                    ) : (
                                      i18n._(t`Approve`)
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={async () => {
                                      try {
                                        const tx = await luxorDeposit(
                                          BigNumber.from(parsedLuxorDepositValue.quotient.toString())
                                        )
                                      } catch (error) {
                                        console.error(error)
                                      }
                                    }}
                                  >
                                    {i18n._(t`DEPOSIT LUX`)}
                                  </Button>
                                )}
                              </div>
                            ) : (
                              ''
                            )}
                            <div className="flex flex-row items-start font-bold md:text-base bg-dark-1000 gap-5 w-full pt-3 pl-3">
                              <div className="flex flex-col">
                                <Typography variant={'xxs'} lineHeight={14} className={'text-accent text-white'}>
                                  You Will Get
                                </Typography>
                                <Typography className={'text-white'} variant={'base'} lineHeight={24} fontFamily={'medium'}>
                                  {formatCurrencyAmount(luxorFromParsedAmount, 4)} LUX
                                </Typography>
                              </div>
                              <div className="flex flex-col">
                                <Typography variant={'xxs'} lineHeight={14} className={'text-accent text-white'}>
                                  Max You Can Buy
                                </Typography>
                                <Typography variant={'base'} lineHeight={24} fontFamily={'medium'}>
                                  {formatCurrencyAmount(luxorAvailableAmount, 4)} LUX
                                </Typography>
                              </div>
                            </div>
                          </div>
                          <div className="h-px my-1 md:hidden bg-dark-1000" />
                          <div className="flex flex-col bg-dark-1000 items-start justify-center w-full relative">
                            <div className="flex items-center bg-dark-800">
                              <Typography variant={'xs'} lineHeight={16} className={'text-white'}>
                                Claimable Rewards:&nbsp;
                              </Typography>
                              <Typography className={'text-white'} fontFamily={'semi-bold'}>
                                {account ? formatCurrencyAmount(claimableAmount, 6) : '-'} LUX
                              </Typography>
                            </div>
                            <div className="flex flex-row items-center font-bold bg-dark-800 md:text-base gap-3 w-full">
                              <Button
                                onClick={async () => {
                                  try {
                                    const tx = await claim(false)
                                    addTransaction(tx, {
                                      summary: `Claim LUX`,
                                    })
                                  } catch (error) {
                                    console.error(error)
                                  }
                                }}
                                disabled={!account}
                                className="flex-1"
                              >
                                {i18n._(t`Claim`)}
                              </Button>
                              <Button
                                onClick={async () => {
                                  try {
                                    const tx = await claim(true)
                                    addTransaction(tx, {
                                      summary: `Claim & Stake LUX`,
                                    })
                                  } catch (error) {
                                    console.error(error)
                                  }
                                }}
                                disabled={!account}
                                className="flex-1"
                              >
                                {i18n._(t`Claim and Autostake`)}
                              </Button>
                              <QuestionHelper
                                // width={'small'}
                                text={
                                  <div className="flex flex-col space-y-2">
                                    The claimed amount will be staked and autocompounded on the Staking page
                                    https://app.luxor.fi/stake
                                  </div>
                                }
                              />
                            </div>
                            <div className="flex flex-row items-start bg-dark-1000 font-bold md:text-base gap-5 w-full pt-3 pl-3">
                              <div className="flex flex-col">
                                <Typography variant={'xxs'} lineHeight={14} 
                                className={'text-accent'}
                                >
                                  Pending Rewards
                                </Typography>
                                <Typography variant={'base'} lineHeight={24} fontFamily={'medium'}>
                                  {account ? formatCurrencyAmount(pendingAmount, 6) : '-'} LUX
                                </Typography>
                              </div>
                              <div className="flex flex-col">
                                <Typography variant={'xxs'} lineHeight={14} className={'text-accent'}>
                                  Time Until Fully Vested
                                </Typography>
                                <Typography variant={'base'} lineHeight={24} fontFamily={'medium'}>
                                  {remainingVesting}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel className={'outline-none'}>
                        <div className="flex flex-col space-y-3 gradient-10 rounded-8 px-4 py-3">
                          <div className="flex justify-between pb-2">
                            <Switch.Group>
                              <div className="flex items-center">
                                <Switch
                                  checked={toggle}
                                  onChange={() => setToggle(!toggle)}
                                  disabled={true}
                                  className={`${
                                    !toggle ? 'bg-blue dark:bg-blue-dark' : 'bg-pink'
                                  } elative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none disabled:opacity-50`}
                                >
                                  <span
                                    className={`${
                                      !toggle
                                        ? 'translate-x-5 text-blue dark:text-blue-dark'
                                        : 'translate-x-0 text-accent'
                                    } translate-y-0 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white dark:bg-black-15 shadow transform ring-0 transition ease-in-out duration-200`}
                                  >
                                    {toggle ? (
                                      <span
                                        className={classNames(
                                          !toggle
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity font-bold'
                                        )}
                                        aria-hidden="true"
                                      >
                                        -
                                      </span>
                                    ) : (
                                      <span
                                        className={classNames(
                                          !toggle
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100',
                                          'absolute inset-0 h-full w-full flex items-start justify-center transition-opacity font-bold'
                                        )}
                                        aria-hidden="true"
                                      >
                                        +
                                      </span>
                                    )}
                                  </span>
                                </Switch>
                                <Switch.Label className="ml-3">
                                  {!toggle ? i18n._(t`Add Liquidity`) : i18n._(t`Remove Liquidity`)}
                                </Switch.Label>
                              </div>
                            </Switch.Group>
                            <Settings />
                          </div>
                          {!toggle ? (
                            <div className="flex flex-col space-y-4">
                              <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                  <CurrencyInputPanel
                                    label={''}
                                    showMaxButton={true}
                                    onUserInput={() => {}}
                                    onMax={() => {}}
                                    id="liquidity-currency-input"
                                  />
                                </div>
                                <div className="flex-1">
                                  <CurrencyInputPanel
                                    label={''}
                                    showMaxButton={true}
                                    onUserInput={() => {}}
                                    onMax={() => {}}
                                    id="liquidity-currency-output"
                                  />
                                </div>
                              </div>
                              <div>
                                <Button className="w-full">Approve</Button>
                              </div>
                            </div>
                          ) : (
                            'TODO'
                          )}
                        </div>
                      </Tab.Panel>
                    </Tab.Group>
                  </div>
                </Disclosure.Panel>
              </div>
            </Transition>
          )}
        </div>
      )}
    </Disclosure>
  )
}

export default BondItem
