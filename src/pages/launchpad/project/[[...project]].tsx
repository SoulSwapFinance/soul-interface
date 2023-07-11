import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import { classNames, formatNumber, formatPercent, tryParseAmount } from '../../../functions'
import Image from '../../../components/Image'
import { Button, ButtonConfirmed, ButtonError } from '../../../components/Button'
import { LAUNCHPAD_PROJECTS, PROJECT_STATUS } from '../../../constants/launchpad'
import Back from '../../../components/Back'
import NumericalInput from '../../../components/NumericalInput'
import { ApprovalState, useApproveCallback } from '../../../hooks'
import { useCurrency } from '../../../hooks/Tokens'
import { SOUL_ADDRESS, SOUL_FTM_PAIR, WNATIVE } from '../../../constants'
import Web3Connect from '../../../components/Web3Connect'
import { AutoRow, RowBetween } from '../../../components/Row'
import Loader from '../../../components/Loader'
import { SoulLaunchpad } from '../../../features/launchpad/SoulLaunchpad'
import { AboutProjectTab } from '../../../features/launchpad/AboutProjectTab'
import { ProjectHero } from '../../../features/launchpad/ProjectHero'
import { useLaunchpad, useLaunchInfo, useLaunchPools, useLaunchpadUserInfo } from '../../../features/launchpad/hooks'
import { useBlockNumber } from 'state/application/hooks'

import { useV2PairsWithPrice } from '../../../hooks/useV2Pairs'
import { useCurrencyBalance } from '../../../state/wallet/hooks'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { CurrencyAmount } from '../../../sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'services/web3'
import { useTimestampFromBlock } from 'hooks/useTimestampFromBlock'

const Menu = ({ children }) => {
  return (
    <div className="border border-b-1 border-t-0 border-r-0 border-l-0 border-dark-500 ">
      <div className={`pt-1 flex md:flex-row flex-col md:space-x-10 space-y-4 md:space-x-8 md:space-y-0 px-5`}>
        {children}
      </div>
    </div>
  )
}

const MenuItem = ({ tabName, title }) => {
  const router = useRouter()
  const id = router.query.project
  const tab = router.query.tab || 'about'

  return (
    <Typography
      variant="base"
      onClick={() =>
        router.push(
          {
            pathname: id.toString(),
            query: { tab: tabName },
          },
          undefined,
          { shallow: true }
        )
      }
      className={classNames(
        tab == tabName &&
          'font-bold bg-transparent border-transparent border-gradient-r-purple-dark-900 border border-t-0 border-r-0 border-l-0 border-b-2',
        'px-1 py-5'
      )}
    >
      {title}
    </Typography>
  )
}

const Pool = ({ project, poolInfo, launchpadInfo }) => {
  const { account, chainId } = useActiveWeb3React()
  const [value, setValue] = useState('')
  const [valueUnstake, setValueUnstake] = useState('')

  const assetToken = useCurrency(SOUL_FTM_PAIR[chainId | 250]) || undefined

  const typedDepositValue = tryParseAmount(value, assetToken)

  const selectedCurrencyBalance = useCurrencyBalance(chainId, account ?? undefined, assetToken ?? undefined)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, project.launchpadContract)
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingWithdrawTx, setPendingWithdrawTx] = useState(false)

  const addTransaction = useTransactionAdder()

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const eligible = launchpadInfo?.userInfo?.eligible

  const poolRaise = project.raise * (poolInfo.raisingAmount / launchpadInfo.totalRaise)

  const totalCommitted = (poolInfo.totalAmountPool / 1e18) * launchpadInfo.pairPrice
  const totalCommittedPercent = (totalCommitted / poolRaise) * 100
  const multiplier = launchpadInfo?.userInfo?.multiplier
  const stakingInOtherPools = launchpadInfo?.userInfo?.pools?.find((p) => p.amount > 0 && p.id !== poolInfo.id)
  const stakingPool = launchpadInfo?.userInfo?.pools?.find((p) => p.id == poolInfo.id)

  const committed =
    (stakingPool?.amount && assetToken && CurrencyAmount.fromRawAmount(assetToken, stakingPool?.amount)) || 0

  const userCommittedAmount = stakingPool?.amount / 1e18
  const maxUserCommitAmount = (poolInfo.baseLimitInLP / 1e18) * multiplier - userCommittedAmount
  const maxUserCommitValue = maxUserCommitAmount * launchpadInfo.pairPrice

  const errorMessage = stakingInOtherPools
    ? `You're participating in another pool`
    : isNaN(parseFloat(value)) || parseFloat(value) == 0
    ? 'Enter Amount'
    : parseFloat(value) > parseFloat(selectedCurrencyBalance.toExact())
    ? 'Insufficient Balance'
    : poolInfo?.baseLimitInLP > 0 && parseFloat(value) > maxUserCommitAmount
    ? 'Amount Exceeds User Limit'
    : ''

  const allInfoSubmitted = errorMessage == ''
  const saleMessage =
    project.status == PROJECT_STATUS.COMPLETED
      ? 'Sale ended'
      : project.status == PROJECT_STATUS.UPCOMING
      ? 'Sale is not active'
      : !eligible && stakingPool?.amount == 0
      ? `You're not eligible`
      : null

  const unstakeErrorMessage = stakingInOtherPools
    ? `You're participating in another pool`
    : isNaN(parseFloat(valueUnstake)) || parseFloat(valueUnstake) == 0
    ? 'Enter Amount'
    : parseFloat(valueUnstake) > userCommittedAmount
    ? 'Insufficient Amount'
    : ''

  const unstakeAllInfoSubmitted = unstakeErrorMessage == ''

  const handleApprove = useCallback(async () => {
    await approve()
  }, [approve])

  const { deposit, withdraw } = useLaunchpad(project.launchpadContract)

  return (
    <div className={'w-full text-left rounded  bg-dark-800 text-primary text-sm md:text-lg'}>
      <div className="flex">
        <div className={`flex flex-row justify-center items-center rounded-t`}>
          <Image
            src={`${project.baseUrl}/${poolInfo.baseLimitInLP == 0 ? 'unlimited.png' : 'basic.png'}`}
            width="1440"
            height="788"
            className="rounded-t"
            alt={project.name}
          />
        </div>
      </div>
      <div className="px-4 py-6 -mt-8">
        <div className="grid grid-cols-1 space-y-4">
          <div className="flex flex-col">
            <Typography variant="h3" className="font-bold  mt-4">
              {poolInfo?.baseLimitInLP == 0 ? 'Unlimited Sale' : 'Basic Sale'}
            </Typography>
          </div>
          <div className={`flex flex-row space-x-10`}>
            <div className="flex flex-col">
              <Typography variant="base">Total Raise</Typography>
              <Typography variant="lg" className="font-bold text-right">
                {formatNumber(poolRaise, true, false)}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-base inline-block">Total Committed</span>
                </div>
                <div className="text-right">
                  <span className="text-base text-purple">
                    {formatNumber(totalCommitted, true, false)} ({formatPercent(totalCommittedPercent)})
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-dark-500">
                <div
                  style={{ width: totalCommittedPercent > 100 ? '100%' : totalCommittedPercent.toFixed(0) + '%' }}
                  className="rounded bg-gradient-to-r from-light-purple  to-purple"
                ></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Typography variant="h3" className="font-bold mt-4">
              Participate
            </Typography>
          </div>
          {saleMessage ? (
            <Typography variant="base">{saleMessage}</Typography>
          ) : (
            <>
              <div>
                <div className="flex mb-2 items-center justify-between ">
                  <div>
                    <span className="text-base inline-block">SOUL/FTM to commit</span>
                  </div>
                  {poolInfo?.baseLimitInLP > 0 && (
                    <div className="flex flex-col">
                      <div
                        className="text-right text-xs cursor-pointer text-purple"
                        onClick={() => {
                          let max = maxUserCommitAmount.toString()
                          if (selectedCurrencyBalance) {
                            if (maxUserCommitAmount > parseFloat(selectedCurrencyBalance.toExact())) {
                              max = selectedCurrencyBalance.toFixed()
                            }
                          }
                          setValue(max)
                        }}
                      >
                        Max {formatNumber(maxUserCommitValue, true, false)} (
                        {formatNumber(maxUserCommitAmount, false, false)})
                      </div>
                    </div>
                  )}
                </div>
                <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                  <NumericalInput
                    className={'p-3 text-base bg-transparent'}
                    id="token-amount-input"
                    value={value}
                    onUserInput={(val) => {
                      setValue(val)
                    }}
                  />
                  {assetToken && selectedCurrencyBalance ? (
                    <div className="flex flex-col">
                      <div className="flex flex-col">
                        <div
                          onClick={() => setValue(selectedCurrencyBalance.toFixed())}
                          className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                        >
                          Wallet: {formatNumber(selectedCurrencyBalance.toSignificant(4))}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div
                          onClick={() => setValue(selectedCurrencyBalance.toFixed())}
                          className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                        >
                          ≈{' '}
                          {formatNumber(
                            parseFloat(selectedCurrencyBalance.toExact()) * launchpadInfo.pairPrice,
                            true,
                            false
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={'flex items-center w-full'}>
                {!account ? (
                  // <Web3Connect size="lg" color="gradient" className="w-full" />
                  <Button 
                  size="lg" color="avaxRed" className="w-full" 
                  disabled
                >
                  { `Connect Wallet` }
                </Button>
                ) : !allInfoSubmitted ? (
                  <ButtonError className="font-bold" style={{ width: '100%' }} disabled={!allInfoSubmitted}>
                    {errorMessage}
                  </ButtonError>
                ) : (
                  <RowBetween>
                    {approvalState !== ApprovalState.APPROVED && (
                      <ButtonConfirmed
                        onClick={handleApprove}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted || !allInfoSubmitted
                        }
                      >
                        {approvalState === ApprovalState.PENDING ? (
                          <div className={'p-2'}>
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          </div>
                        ) : (
                          <span>Approve</span>
                        )}
                      </ButtonConfirmed>
                    )}
                    {approvalState === ApprovalState.APPROVED && (
                      <ButtonError
                        className="font-bold text-light"
                        onClick={async () => {
                          setPendingTx(true)
                          try {
                            const tx = await deposit(
                              new BigNumber(value, '18'),
                              // .toBigNumber(18), 
                              poolInfo?.id)
                            addTransaction(tx, { summary: 'Commit' })
                          } catch (error) {
                            console.error(error)
                          }
                          setPendingTx(false)
                        }}
                        style={{
                          width: '100%',
                        }}
                        disabled={approvalState !== ApprovalState.APPROVED || !allInfoSubmitted || pendingTx}
                      >
                        {pendingTx ? (
                          <div className={'p-2'}>
                            <AutoRow gap="6px" justify="center">
                              Commit <Loader stroke="white" />
                            </AutoRow>
                          </div>
                        ) : (
                          <span>Commit</span>
                        )}
                      </ButtonError>
                    )}
                  </RowBetween>
                )}
              </div>
              <>
                <div>
                  <div className="flex mb-2 items-center justify-between ">
                    <div>
                      <span className="text-base inline-block">Your Commitment</span>
                    </div>
                  </div>
                  <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                    <NumericalInput
                      className={'p-3 text-base bg-transparent'}
                      id="token-amount-input"
                      value={valueUnstake}
                      onUserInput={(val) => {
                        setValueUnstake(val)
                      }}
                    />
                    {userCommittedAmount ? (
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <div
                            onClick={() => {
                              if (committed) {
                                setValueUnstake(committed.toFixed(18))
                              }
                            }}
                            className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                          >
                            Committed: {formatNumber(userCommittedAmount, false, false)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div
                            onClick={() => {
                              if (committed) {
                                setValueUnstake(committed.toFixed(18))
                              }
                            }}
                            className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                          >
                            ≈ {formatNumber(userCommittedAmount * launchpadInfo.pairPrice, true, false)}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className={'flex items-center w-full'}>
                  {!account ? (
                    // <Web3Connect size="lg" color="gradient" className="w-full" />
                    <Button 
                    size="lg" color="avaxRed" className="w-full" 
                    disabled
                  >
                    { `Connect Wallet` }
                  </Button>
                  ) : !unstakeAllInfoSubmitted ? (
                    <ButtonError className="font-bold" style={{ width: '100%' }} disabled={!unstakeAllInfoSubmitted}>
                      {unstakeErrorMessage}
                    </ButtonError>
                  ) : (
                    <RowBetween>
                      <ButtonError
                        className="font-bold text-light"
                        onClick={async () => {
                          setPendingWithdrawTx(true)
                          try {
                            const tx = await withdraw(
                              new BigNumber(valueUnstake, '18'),
                              // .toBigNumber(18), 
                              poolInfo?.id)
                            addTransaction(tx, { summary: 'Withdraw' })
                          } catch (error) {
                            console.error(error)
                          }
                          setPendingWithdrawTx(false)
                        }}
                        style={{
                          width: '100%',
                        }}
                        disabled={!unstakeAllInfoSubmitted || pendingWithdrawTx}
                      >
                        {pendingWithdrawTx ? (
                          <div className={'p-2'}>
                            <AutoRow gap="6px" justify="center">
                              Withdraw <Loader stroke="white" />
                            </AutoRow>
                          </div>
                        ) : (
                          <span>Withdraw</span>
                        )}
                      </ButtonError>
                    </RowBetween>
                  )}
                </div>
              </>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const ClaimItem = ({ project, launchpadInfo, releaseBlock, releaseTime, k }) => {
  const { account } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const blockTimestamp = useTimestampFromBlock(blockNumber)

  const [pendingTx, setPendingTx] = useState(false)

  const addTransaction = useTransactionAdder()

  const { harvest } = useLaunchpad(project.launchpadContract)

  const claimEnabled = launchpadInfo.claimEnabled

  const userPoolId = launchpadInfo?.userInfo?.pools?.find((r) => r.amount > 0)

  return (
    <div className="grid py-1 grid-cols-3 border border-t-0 border-r-0 border-l-0 items-center border-thin border-dark-600">
      <a
        className="text-emphesis font-xs"
        href={'https://ftmscan.com/block/countdown/' + releaseBlock?.toString()}
        target="_blank"
        rel="noreferrer"
      >
        {releaseTime?.toString()}
      </a>
      <Typography variant="base" className="text-emphesis text-right">
        {formatPercent(launchpadInfo?.harvestReleasePercent[k] / 1e2)}
      </Typography>
      {!account || !claimEnabled || !userPoolId ? (
        <div className="flex justify-end px-6">
          <Typography variant="base" className="text-emphesis text-center">
            {!claimEnabled ? 'Locked' : !userPoolId ? 'Not eligible' : 'Connect wallet'}
          </Typography>
        </div>
      ) : (
        <div className="flex justify-end">
          <ButtonError
            className="font-bold text-emphesis text-center px-6"
            onClick={async () => {
              setPendingTx(true)
              try {
                const tx = await harvest(userPoolId?.id?.toString(), k.toString())
                addTransaction(tx, { summary: 'Harvest' })
              } catch (error) {
                console.error(error)
              }
              setPendingTx(false)
            }}
            style={{
              width: '150px',
            }}
            size="xs"
            disabled={releaseTime > blockTimestamp || !claimEnabled || userPoolId?.claimed?.[k] || pendingTx}
          >
            {pendingTx ? (
              <div className="flex items-center justify-center">
                <div className="pr-2">Claim</div> <Loader stroke="white" size="12px" />
              </div>
            ) : releaseTime > blockTimestamp ? (
              'Locked'
            ) : userPoolId?.claimed?.[k] ? (
              'Claimed'
            ) : (
              'Claim'
            )}
          </ButtonError>
        </div>
      )}
    </div>
  )
}

const Claim = ({ project, launchpadInfo }) => {
  const { account } = useActiveWeb3React()

  const errorMessage = !account ? 'Connect your wallet' : ''
  const allInfoSubmitted = errorMessage === ''

  return (
    <div className={`bg-light-glass md:px-6 px-4 py-4 md:rounded`}>
      <div className="mb-2 text-2xl text-emphesis">{`Launchpad #${parseInt(project.id) + 1} - ${project.name}`}</div>
      <div className="mb-4 text-base">
        <Typography variant="base" className="text-emphesis">
          Here you can claim your offering tokens, and your refund (if there is overflow). The rest of the tokens are
          gradually released following the vesting schedule.
        </Typography>
      </div>
      <>
        <div className="flex flex-col mt-4">
          <Typography variant="h3" className="text-emphesis mt-2 mb-2">
            Vesting Schedule
          </Typography>
        </div>
        <div className={'flex flex-col mt-1'}>
          {!allInfoSubmitted ? (
            <Typography variant="base" className="text-secondary">
              {errorMessage}
            </Typography>
          ) : (
            <div className={'bg-dark-700 rounded flex-col p-4 '}>
              <div className="grid  py-1 grid-cols-3 border border-t-0 border-r-0 border-l-0 border-thin border-dark-600">
                <Typography variant="base" className="text-light font-bold">
                  Timestamp
                </Typography>
                <Typography variant="base" className="text-light text-right  font-bold">
                  %
                </Typography>
                <Typography variant="base" className="text-light text-center  font-bold"></Typography>
              </div>
              {launchpadInfo?.harvestReleaseTimestamps?.map((releaseTime, k) => {
                return (
                  <ClaimItem releaseTime={releaseTime} key={k} k={k} launchpadInfo={launchpadInfo} project={project} releaseBlock={undefined} />
                )
              })}
            </div>
          )}
        </div>
      </>
    </div>
  )
}

const UserInfo = ({ project, pools, launchpadInfo }) => {
  const { account } = useActiveWeb3React()

  const eligible = launchpadInfo?.userInfo?.eligible

  const userPoolId = launchpadInfo?.userInfo?.pools?.find((r) => r.amount > 0)
  const pool = pools[userPoolId?.id]
  const committed = !userPoolId ? 0 : (userPoolId?.amount / 1e18) * launchpadInfo.pairPrice
  const participation = !userPoolId ? 0 : userPoolId?.allocation / 1e12

  console.log(userPoolId)

  return (
    <div className={`bg-light-glass px-6 py-4 rounded`}>
      <div className="mb-2 text-2xl text-emphesis">{`Launchpad #${parseInt(project.id) + 1} - ${project.name}`}</div>
      <div className="mb-4 text-base">
        <br/>
        <Typography variant="base" className="text-secondary">
          Before Sale
        </Typography>
        <Typography variant="base" className="text-emphesis">
          Stake 1,000 SOUL (or more) in one of the Vaults to be eligible. Multiplier boosts are tiered, you can
          read more about it{' '}
          <a
            className="underline"
            href="https://soulswapfinance.medium.com/soulswap-launchpad-everything-you-need-to-know"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          {' for full details regarding the launch event.'}
        </Typography>
        <br/>
        <Typography variant="base" className="text-secondary mt-2">
          During Launch Event
        </Typography>
        <Typography variant="base" className="text-emphesis">
            Create <b>SOUL-FTM LP</b> to commit to the pool of your choice (Basic vs. Unlimited).
            The IDO contract will renew all the user vaults upon commitment.
        </Typography>
        <br/>
        <Typography variant="base" className="text-secondary mt-2">
          After Launch Event
        </Typography>
        <Typography variant="base" className="text-emphesis">
          You can claim your offering tokens. The rest of the tokens are gradually released following the vesting schedule.
        </Typography>
      </div>
      <div className="flex flex-col">
        <Typography variant="h3" className="text-emphesis mt-4 mb-2">
          Eligibility Status
        </Typography>
      </div>
      {!account ? (
        // <Web3Connect size="lg" color="gradient" className="w-full" />
        <Button 
        size="lg" color="avaxRed" className="w-full" 
        disabled
      >
        { `Connect Wallet` }
      </Button>
      ) : (
        <>
          <div className={`flex flex-col  space-x-10 mb-4`}>
            <div className="grid grid-cols-3 justify-between">
              <div>
                <Typography variant="base" className="text-secondary">
                  Status
                </Typography>
                <Typography variant="base" className="text-emphesis">
                  {eligible ? 'Eligible' : 'Not Eligible'}
                </Typography>
              </div>
              <div>
                <Typography variant="base" className="text-secondary">
                  Multiplier
                </Typography>
                <Typography variant="base" className=" text-emphesis">
                  {eligible ? `${launchpadInfo?.userInfo?.multiplier}x` : '--'}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Typography variant="h3" className="text-emphesis mt-4 mb-2">
              Participation
            </Typography>
          </div>
          <div className={`flex flex-col  space-x-10 pb-2`}>
            <div className="grid grid-cols-3 justify-between">
              <div>
                <Typography variant="base" className="text-secondary">
                  Pool
                </Typography>
                <Typography variant="base" className="text-emphesis">
                  {userPoolId ? (pool.baseLimitInLP > 0 ? 'Basic' : 'Unlimited') : '--'}
                </Typography>
              </div>
              <div>
                <Typography variant="base" className="text-secondary">
                  Committed
                </Typography>
                <Typography variant="base" className=" text-emphesis">
                  {userPoolId ? `${formatNumber(committed, true, false)}` : '--'}
                </Typography>
              </div>
              <div>
                <Typography variant="base" className="text-secondary">
                  Allocation
                </Typography>
                <Typography variant="base" className="text-emphesis">
                  {userPoolId ? `${formatPercent(participation * 100)}` : '--'}
                </Typography>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function LaunchpadProject(): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const blockNumber = useBlockNumber()
  const blockTimestamp = useTimestampFromBlock(blockNumber)

  const id = router.query.project
  const tab = router.query.tab || 'about'

  const projectInfo = LAUNCHPAD_PROJECTS[parseInt(id.toString())]
  const project = {
    id,
    ...projectInfo,
    status:
      blockTimestamp >= projectInfo.startTime && blockTimestamp < projectInfo.endTime
        ? PROJECT_STATUS.LIVE
        : blockTimestamp >= projectInfo.endTime
        ? PROJECT_STATUS.COMPLETED
        : PROJECT_STATUS.UPCOMING,
  }

  const launchpadInfo = useLaunchInfo(project.launchpadContract)
  const launchpadPools = useLaunchPools(project.launchpadContract)
  const launchpadUserInfo = useLaunchpadUserInfo(project.launchpadContract)

  let token0 = useCurrency(SOUL_ADDRESS[chainId | 250])
  let token1 = useCurrency(WNATIVE[chainId | 250])
  const [data] = useV2PairsWithPrice([[token0, token1]])
  let [state, pair, pairPrice] = data

  if (projectInfo?.pairPrice) {
    pairPrice = projectInfo?.pairPrice
  }
  const totalRaise = launchpadPools?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.raisingAmount * 1
  }, 0)

  const totalCommitted =
    launchpadPools?.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.totalAmountPool / 1e18
    }, 0) * pairPrice

  const extraLaunchpadInfo = {
    ...launchpadInfo,
    totalRaise,
    totalCommitted,
    pairPrice,
    userInfo: {
      ...launchpadUserInfo,
    },
  }

  return (
    <>
      <Head>
        <title>Launchpad | SoulSwap</title>
        <meta key="description" name="description" content="Launchpad" />
      </Head>

      <SoulLaunchpad />

      <div className="container mx-auto pb-6 -mt-48 px-2 md:px-0 mb-20 md:mb-10">
        <div className="relative w-full">
          <div className={`grid grid-cols-1 md:grid-cols-12 gap-2 min-h-1/2`}>
            <div className="block mb-10">
              <Back />
            </div>
            <div className={`col-span-1 md:col-span-12`}>
              <ProjectHero project={project} totalCommitted={totalCommitted} />
              <Card
                className="bg-dark-900 z-4 rounded"
                header={
                  <Menu>
                    <MenuItem tabName="about" title="Description" />
                    <MenuItem tabName="join" title="Join" />
                    <MenuItem tabName="claim" title="Claim" />
                  </Menu>
                }
                // removePadding
              >
                <div className="md:p-6 min-h-[400px]">
                  {!project ? (
                    <Typography variant="base" className={'max-w-xl m-auto text-center mb-2 text-gray-400'}>
                      Project Not Found
                    </Typography>
                  ) : (
                    <>
                      {tab == 'about' && <AboutProjectTab project={project} />}
                      {tab == 'join' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4 md:mt-0">
                          {launchpadPools.map((pool, idx) => {
                            return <Pool key={idx} project={project} poolInfo={pool} launchpadInfo={extraLaunchpadInfo} />
                          })}
                          <UserInfo project={project} pools={launchpadPools} launchpadInfo={extraLaunchpadInfo} />
                        </div>
                      )}
                      {tab == 'claim' && <Claim project={project} launchpadInfo={extraLaunchpadInfo} />}
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
