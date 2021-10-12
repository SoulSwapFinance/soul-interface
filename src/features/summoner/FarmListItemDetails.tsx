import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ChainId, SOUL_SUMMONER_ADDRESS, Token, ZERO } from '../../sdk'
import { Chef, PairType } from './enum'
import { Disclosure, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { usePendingSoul, useUserInfo } from './hooks'

import Button from '../../components/Button'
import Dots from '../../components/Dots'

import { Input as NumericalInput } from '../../components/NumericalInput'
import { formatNumber, formatNumberScale, formatPercent } from '../../functions'
import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import useMasterChef from './useSummoner'
import usePendingReward from './usePendingReward'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useToken } from '../../hooks/Tokens'
import { isMobile } from 'react-device-detect'

const FarmListItem = ({ farm }) => {
  const { i18n } = useLingui()

  const { account, chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const addTransaction = useTransactionAdder()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    farm.pair.token1 ? 18 : farm.pair.token0 ? farm.pair.token0.decimals : 18,
    farm.pair.token1 ? farm.pair.symbol : farm.pair.token0.symbol,
    farm.pair.token1 ? farm.pair.name : farm.pair.token0.name
  )

  // User liquidity token balance
  const balance = useTokenBalance(account, liquidityToken)

  // TODO: Replace these
  const { amount } = useUserInfo(farm, liquidityToken) // nextHarvestUntil

  const pendingSoul = usePendingSoul(farm)

  const reward = usePendingReward(farm)

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, SOUL_SUMMONER_ADDRESS[chainId])

  const { deposit, withdraw, harvest, stake, unstake, claimStake } = useMasterChef()

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-0"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Disclosure.Panel className="flex flex-col w-full border-t-0 rounded rounded-t-none bg-dark-800" static>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="col-span-2 text-center md:col-span-1">
            {/* {farm.depositFeeBP && (
              <div className="pr-4 mb-2 text-left cursor-pointer text-red">{`${i18n._(t`Deposit Fee`)}: ${formatPercent(
                farm.depositFeeBP / 100
              )}`}</div>
            )} */}
            {account && (
              <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                {i18n._(t`Wallet Balance`)}: {balance?.toSignificant(8)}
                {/* {farm.lpPrice && balance
                  ? ` (` + formatNumberScale(farm.lpPrice * Number(balance?.toFixed(18) ?? 0), true, 2) + `)`
                  : ``} */}
              </div>
            )}
            <div className="relative flex items-center w-full mb-4">
              <NumericalInput
                className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-dark-purple"
                value={depositValue}
                onUserInput={setDepositValue}
              />
              {account && (
                <Button
                  variant="outlined"
                  color="blue"
                  size="xs"
                  // disabled={farm?.id === '1'}
                  onClick={() => {
                    if (!balance.equalTo(ZERO)) {
                      if (liquidityToken?.symbol == 'SOUL') {
                        try {
                          const minValue = 1 / 10 ** (liquidityToken?.decimals - 10)
                          const newValue = parseFloat(balance.toFixed(liquidityToken?.decimals)) - minValue
                          setDepositValue(newValue.toFixed(liquidityToken?.decimals))
                        } catch (e) {
                          setDepositValue(balance.toFixed(liquidityToken?.decimals))
                        }
                      } else {
                        setDepositValue(balance.toFixed(liquidityToken?.decimals))
                      }
                    }
                  }
                }
                  className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                >
                  {i18n._(t`MAX`)}
                </Button>
              )}
            </div>
            { farm.pair.token1 && (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
              <Button
                className="w-full"
                size="sm"
                variant="outlined"
                color="gradient"
                disabled={approvalState === ApprovalState.PENDING}
                onClick={approve}
              >
                {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : i18n._(t`Approve`)}
              </Button>
            ) : (
              <Button
                className="w-full"
                size="sm"
                variant="outlined"
                color="gradient"
                disabled={pendingTx || !typedDepositValue || balance.lessThan(typedDepositValue)}
                onClick={async () => {
                  setPendingTx(true)
                  try {
                    // KMP decimals depend on asset, SLP is always 18
                    const tx = farm.pair.token1 ?
                      await deposit(farm?.id, depositValue.toBigNumber(liquidityToken?.decimals))
                      : await stake(depositValue.toBigNumber(18))

                    addTransaction(tx, {
                      summary: `${i18n._(t`Deposit`)} ${
                        farm.pair.token1
                          ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                          : farm.pair.token0.symbol
                      }`,
                    })
                  } catch (error) {
                    console.error(error)
                  }
                  setPendingTx(false)
                }}
              >
                {i18n._(t`Stake`)}
              </Button>
            )}
           
          </div>
          <div className="col-span-2 text-center md:col-span-1">
            {/* {farm.depositFeeBP && !isMobile && (
              <div className="pr-4 mb-2 text-left cursor-pointer text-secondary" style={{ height: '24px' }} />
            )} */}
            {account && (
              <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                {i18n._(t`Deposited`)}: {amount?.toSignificant(8)}
                {/* {farm.lpPrice && amount
                  ? ` (` + formatNumberScale(farm.lpPrice * Number(amount?.divide(1E18).toSignificant(18) ?? 0), true, 2) + `)`
                  : ``} */}
              </div>
            )}
            <div className="relative flex items-center w-full mb-4">
              <NumericalInput
                className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                value={withdrawValue}
                onUserInput={setWithdrawValue}
              />
              {account && (
                <Button
                  variant="outlined"
                  color="pink"
                  size="xs"
                  onClick={() => {
                    if (!amount.equalTo(ZERO)) {
                      setWithdrawValue(amount.toFixed(liquidityToken?.decimals))
                    }
                  }}
                  className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                >
                  {i18n._(t`MAX`)}
                </Button>
              )}
            </div>
            { farm.pair.token1 && pendingSoul && pendingSoul.greaterThan(ZERO) && (

            <Button
              className="w-full"
              size="sm"
              variant="outlined"
              color="gradient"
              disabled={pendingTx || !typedWithdrawValue || amount.lessThan(typedWithdrawValue)}
              onClick={async () => {
                setPendingTx(true)
                try {
                  // KMP decimals depend on asset, SLP is always 18
                  const tx = await withdraw(farm?.id, withdrawValue.toBigNumber(liquidityToken?.decimals))
                  addTransaction(tx, {
                    summary: `${i18n._(t`Withdraw`)} ${
                      farm.pair.token1
                        ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                        : farm.pair.token0.symbol
                    }`,
                  })
                } catch (error) {
                  console.error(error)
                }

                setPendingTx(false)
              }}
            >
              {i18n._(t`Unstake`)}
            </Button>
            
            )}
            { !farm.pair.token1 && pendingSoul && pendingSoul.greaterThan(ZERO) && (

            <Button
              className="w-full"
              size="sm"
              variant="outlined"
              color="gradient"
              disabled={pendingTx || !typedWithdrawValue || amount.lessThan(typedWithdrawValue)}
              onClick={async () => {
                setPendingTx(true)
                try {
                  // KMP decimals depend on asset, SLP is always 18
                  const tx = await unstake(withdrawValue.toBigNumber(18))
                  addTransaction(tx, {
                    summary: `${i18n._(t`Withdraw`)} ${
                      farm.pair.token1
                        ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                        : farm.pair.token0.symbol
                    }`,
                  })
                } catch (error) {
                  console.error(error)
                }

                setPendingTx(false)
              }}
            >
              {i18n._(t`Unstake`)}
            </Button>

            )}
            </div>
          </div>
        {farm.pair.token1 && pendingSoul && pendingSoul.greaterThan(ZERO) && (
          <div className="px-4 pb-4">
            <Button
              color="gradient"
              className="w-full"
              // variant={'filled'}
              // variant={!!nextHarvestUntil && nextHarvestUntil > Date.now() ? 'outlined' : 'filled'}
              // disabled={!!nextHarvestUntil && nextHarvestUntil > Date.now()}
              onClick={async () => {
                setPendingTx(true)
                try {
                  const tx = await harvest(farm.id)
                  addTransaction(tx, {
                    summary: `${i18n._(t`Harvest`)} ${
                      farm.pair.token1
                        ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                        : farm.pair.token0.symbol
                    }`,
                  })
                } catch (error) {
                  console.error(error)
                }
                setPendingTx(false)
              }}
            >
              {i18n._(t`Harvest ${formatNumber(pendingSoul.toFixed(18))} SOUL`)}
            </Button>
          </div>
        )}
        { !farm.pair.token1 && pendingSoul && pendingSoul.greaterThan(ZERO) && (
          <div className="px-4 pb-4">
            <Button
              color="gradient"
              className="w-full"
              // variant={'filled'}
              // variant={!!nextHarvestUntil && nextHarvestUntil > Date.now() ? 'outlined' : 'filled'}
              // disabled={!!nextHarvestUntil && nextHarvestUntil > Date.now()}
              onClick={async () => {
                setPendingTx(true)
                try {
                  const tx = await claimStake(10**18 * 0)
                  addTransaction(tx, {
                    summary: `${i18n._(t`Harvest`)} ${
                      farm.pair.token1
                        ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                        : farm.pair.token0.symbol
                    }`,
                  })
                } catch (error) {
                  console.error(error)
                }
                setPendingTx(false)
              }}
            >
              {i18n._(t`Harvest ${formatNumber(pendingSoul.toFixed(18))} SOUL`)}
            </Button>
          </div>
        )}
      </Disclosure.Panel>
    </Transition>
  )
}

export default FarmListItem
