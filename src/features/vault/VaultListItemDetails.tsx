import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ChainId, SUMMONER_ADDRESS, Token, ZERO } from '../../sdk'
import { Disclosure, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { usePendingSoul, useUserInfo } from './hooks'
import { Button } from '../../components/Button'
import Dots from '../../components/Dots'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { formatNumber, formatNumberScale, formatPercent } from '../../functions'
import { getAddress } from '@ethersproject/address'
import { tryParseAmount } from '../../functions/parse'
import useMasterChef from './useSummoner'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import Modal from 'components/DefaultModal'
import Typography from '../../components/Typography'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'services/web3'
import ModalHeader from 'components/Modal/Header'

const VaultListItem = ({ farm }) => {

  const { account, chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')
  const [currentAction, setCurrentAction] = useState({ action: null, callback: null }) // lockup: null,
  const [showConfirmation, setShowConfirmation] = useState(false)

  const addTransaction = useTransactionAdder()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    farm.pair.token1 ? 18 : farm.pair.token0 ? farm.pair.token0.decimals : 18,
    farm.pair.token1 ? farm.pair.symbol : farm.pair.token0.symbol,
    farm.pair.token1 ? farm.pair.name : farm.pair.token0.name
  )

  // User liquidity token balance
  const balance = useTokenBalance(chainId, account, liquidityToken)

  // TODO: Replace these
  const { amount } = useUserInfo(farm, liquidityToken) // nextHarvestUntil, userLockedUntil

  const pendingSoul = usePendingSoul(farm)

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)
  const [approvalState, approve] = useApproveCallback(typedDepositValue, SUMMONER_ADDRESS[chainId ?? ChainId.FANTOM])
  const { deposit, withdraw, harvest } = useMasterChef()

  return (
    <>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader
            header={`Confirm ${currentAction.action == 'deposit' ? 'Staking' : 'Harvesting'}`}
            onClose={() => setShowConfirmation(false)}
          />
          <Typography variant="sm" className="font-medium mt-2 pb-4">
            {`Everytime you stake or claim rewards your lock time renews.`}
          </Typography>
          <Button
            color="red"
            size="lg"
            onClick={() => {
              if (
                window.prompt(
                  `Please type the word "confirm" to ${
                      currentAction.action == 'deposit' ? 'stake' : 'harvest'
                    } and withdraw your tokens after 14 days or incur a fee`
                    // } and lock your tokens for ${currentAction.lockup}.`
                  )
                 === 'confirm'
              ) {
                currentAction.callback()
                setShowConfirmation(false)
              }
            }}
          >
            {/* <Typography variant="lg">
              {`${currentAction.action == 'deposit' ? 'Stake' : 'Harvest'} & Lock for ${currentAction.lockup}`}
            </Typography> */}
          </Button>
        </div>
      </Modal>
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
              {account && (
                <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                  {`Wallet Balance`}:{' '}
                  {formatNumber(balance, false, true)}
                  {farm.lpPrice && balance
                    ? ` (` + formatNumberScale(farm.lpPrice * Number(balance?.toFixed(18) ?? 0), true) + ``
                    : ``}
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
                    color="purple"
                    size="xs"
                    onClick={() => {
                      if (!balance.equalTo(ZERO)) {
                        setDepositValue(balance.toFixed(liquidityToken?.decimals))
                      }
                    }}
                    className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                  >
                    {`MAX`}
                  </Button>
                )}
              </div>
              {approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
                <Button
                  className="w-full"
                  size="sm"
                  variant="outlined"
                  color="gradient"
                  disabled={approvalState === ApprovalState.PENDING}
                  onClick={approve}
                >
                  {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : `Approve`}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="sm"
                  variant="outlined"
                  color="gradient"
                  disabled={pendingTx || !typedDepositValue || balance.lessThan(typedDepositValue)}
                  onClick={async () => {
                    const fn = async () => {
                      setPendingTx(true)
                      try {
                        // KMP decimals depend on asset, SLP is always 18
                        const tx = await deposit(farm?.id, 
                          new BigNumber(depositValue, liquidityToken?.decimals.toString()))
                          // .toBigNumber(liquidityToken?.decimals))

                        addTransaction(tx, {
                          summary: `${`Deposit`} ${
                            farm.pair.token1
                              ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                              : farm.pair.token0.symbol
                          }`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                      setPendingTx(false)
                    }
                    // if (farm?.lockupDuration == 0) {
                    //   fn()
                    // } else
                    {
                      setCurrentAction({
                        action: 'deposit',
                        // lockup: `${farm?.lockupDuration / 86400} days`,
                        callback: fn,
                      })
                      setShowConfirmation(true)
                    }
                  }}
                >
                  {`Stake`}
                </Button>
              )}
            </div>
            <div className="col-span-2 text-center md:col-span-1">
              {/* {farm.depositFeeBP && !isMobile && (
                <div className="pr-4 mb-2 text-left cursor-pointer text-secondary" style={{ height: '24px' }} />
              )} */}
              {account && (
                <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                  {`Your Staked`}: {formatNumberScale(amount?.toSignificant(6)) ?? 0}
                  {farm.lpPrice && amount
                    ? ` (` + formatNumberScale(farm.lpPrice * Number(amount?.toSignificant(18) ?? 0), true) + ``
                    : ``}
                </div>
              )}
              <div className="relative flex items-center w-full mb-4">
                <NumericalInput
                  className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-dark-purple"
                  value={withdrawValue}
                  onUserInput={setWithdrawValue}
                />
                {account && (
                  <Button
                    variant="outlined"
                    color="purple"
                    size="xs"
                    onClick={() => {
                      if (!amount.equalTo(ZERO)) {
                        setWithdrawValue(amount.toFixed(liquidityToken?.decimals))
                      }
                    }}
                    className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                  >
                    {`MAX`}
                  </Button>
                )}
              </div>
              <Button
                className="w-full"
                size="sm"
                variant="outlined"
                color="gradient"
                disabled={
                  pendingTx ||
                  !typedWithdrawValue ||
                  amount.lessThan(typedWithdrawValue) ||
                  (amount && !amount.equalTo(ZERO) // &&
                    // farm?.lockupDuration > 0 &&
                    // moment.unix(userLockedUntil / 1000).isAfter(new Date())
                  )}
                onClick={async () => {
                  setPendingTx(true)
                  try {
                    // KMP decimals depend on asset, SLP is always 18
                    const tx = await withdraw(farm?.id, 
                      new BigNumber(withdrawValue, liquidityToken?.decimals.toString()))
                      // .toBigNumber(liquidityToken?.decimals))
                    addTransaction(tx, {
                      summary: `${`Withdraw`} ${
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
                {amount &&
                !amount.equalTo(ZERO) &&
                // farm?.lockupDuration > 0 &&
                // moment.unix(userLockedUntil / 1000).isAfter(new Date())
                  // ? `Fee Ends ${moment.unix(userLockedUntil / 1000).fromNow()} (${moment
                      // .unix(userLockedUntil / 1000)
                      // .format()})`
                  // : 
                  `Unstake`}
              </Button>
            </div>
          </div>
          {pendingSoul && pendingSoul.greaterThan(ZERO) && (
            <div className="px-4 pb-4">
              <Button
                color="gradient"
                className="w-full"
                // variant={!!nextHarvestUntil && nextHarvestUntil > Date.now() ? 'outlined' : 'filled'}
                // disabled={!!nextHarvestUntil && nextHarvestUntil > Date.now()}
                onClick={async () => {
                  const fn = async () => {
                    setPendingTx(true)
                    try {
                      const tx = await harvest(farm.id)
                      addTransaction(tx, {
                        summary: `${`Harvest`} ${
                          farm.pair.token1
                            ? `${farm.pair.token0.symbol}/${farm.pair.token1.symbol}`
                            : farm.pair.token0.symbol
                        }`,
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    setPendingTx(false)
                  }

                  if (farm?.lockupDuration == 0) {
                    fn()
                  } else {
                    setCurrentAction({
                      action: 'harvest',
                      // lockup: `${farm?.lockupDuration / 86400} days`,
                      callback: fn,
                    })
                    setShowConfirmation(true)
                  }
                }}
              >
                {`Harvest ${formatNumber(pendingSoul.toFixed(18))} SOUL`}
              </Button>
            </div>
          )}
        </Disclosure.Panel>
      </Transition>
    </>
  )
}

export default VaultListItem
