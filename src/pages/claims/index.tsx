import { Currency, CurrencyAmount, Token } from 'sdk'
import React, { useEffect, useState } from 'react'
import { useClaimCallback, useUserClaimData, useUserUnclaimedAmount } from 'state/claim/hooks'
import { useModalOpen, useToggleSelfClaimModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'components/Button'
import { ChevronRight } from 'react-feather'
import Container from 'components/Container'
import Dots from 'components/Dots'
import ExternalLink from 'components/ExternalLink'
import { Fraction } from 'entities/bignumber/Fraction'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Loader from 'components/Loader'
import QuestionHelper from 'components/QuestionHelper'
import { cloudinaryLoader } from 'functions/cloudinary'
import { formatNumber } from 'functions/format'
import { isAddress } from 'ethers/lib/utils'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'services/web3'

export default function Claims() {
  const { i18n } = useLingui()
  const vaultImg = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-closed.png'

  const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account } = useActiveWeb3React()

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // get user claim data
  const userClaimData = useUserClaimData(account)

  // monitor the status of the claim from contracts and txns
  const { claimCallback } = useClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedAmount(account)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  // const claimConfirmed = Boolean(claimTxn?.receipt)
  const claimConfirmed = false

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        // console.log(error)
      })
  }

  // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
  useEffect(() => {
    if (claimConfirmed && claimSubmitted && attempting) {
      setAttempting(false)
      if (!isOpen) {
        toggleClaimModal()
      }
    }
  }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal])

  const [userAllocation, setAllocation] = useState<string>()
  useEffect(() => {
    const fetchLockup = async () => {
      if (account) { // todo: update to prod
        fetch('https://raw.githubusercontent.com/SoulSwapFinance/soul-claims/main/scripts/claims/prod.json')
          .then((response) => response.json())
          .then((claimable) => {
            const userClaimableAmount = claimable[account] ? claimable[account] / 1e18 : claimable[account.toLowerCase()] / 1e18
            const userClaimable = userClaimableAmount.toString() // Fraction.from(BigNumber.from(userClaimableAmount), BigNumber.from(10).pow(18)).toString()
            setAllocation(userClaimable)
            console.log('userClaimable:', Number(userClaimable))
          })
          .catch((error) => {
            console.log(error)
          })
      }
      return []
    }
    fetchLockup()
  }, [account])

  // let vault = ''
  if (Number(unclaimedAmount?.toFixed(8)) > 0) {
    <Image alt="vault" unoptimized width="300" height="300" src={vaultImg} />
  } else if (Number(unclaimedAmount?.toFixed(8)) <= 0) {
    <Image alt="vault" unoptimized width="300" height="300" src={vaultImg} />
  } else {
    <Image alt="vault" unoptimized width="300" height="300" src={vaultImg} />
  }

  return (
    <Container id="claims-page" className="py-4 md:py-8 lg:py-12 m-auto w-full max-w-[900px]">
      <Head>
        <title>Claims | Soul</title>
        <meta key="description" name="description" content="SoulSwap Claims..." />
      </Head>
      <div className="flex px-0 sm:px-4 md:flex-row md:space-x-10 lg:space-x-20 md:px-10">
        <div className="hidden space-y-10 md:block">
          <Image unoptimized width="300" height="300" src={vaultImg} loader={cloudinaryLoader} alt="" />
          <div className="relative w-full p-4 overflow-hidden rounded bg-dark-900">
            <div className="font-bold text-white">{i18n._(t`Harvest Redistribution`)}</div>
            <div
              className="pt-2 text-sm font-bold text-gray-400"
              style={{
                maxWidth: '300px',
                minHeight: '300px',
              }}
            >
              <>
                {i18n._(t`Claims are executed within the guidelines outlined in`)}{' '}
                <ExternalLink href="https://ftmscan.com/address/0xA121b64fd62a99869767650879C5bEc776415a45#code">
                  Smart Contract
                </ExternalLink>
                .
                <br />
                <br />
                {i18n._(t`Please refer to the`)}{' '}
                <ExternalLink href="https://forum.soulswap.finance/t/farming-harvest-reward-solution/49/16">
                  {i18n._(t`forum discussion`)}
                </ExternalLink>{' '}
                {i18n._(t`for deliberations on additional points.`)}
                <br />
                <br />
                {i18n._(t`Additional records and merkle updates can be found on`)}{' '}
                <ExternalLink  href="https://github.com/SoulSwapFinance/soul-claims">Github</ExternalLink>
              </>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 max-w-[900px]">
          <div className="relative w-full overflow-hidden rounded bg-dark-900">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-row justify-between">
                <div className="font-bold text-white">{i18n._(t`Your Claimable SOUL`)}</div>
                <QuestionHelper text="Your SOUL will be released upon your claim and are claimable until February 28th. Claiming forfeits your ability to pose a counter-claim." />
              </div>
              {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
              <div className="flex flex-col items-baseline">
                <div className="font-bold text-white text-[36px]">
                  { 
                    unclaimedAmount?.toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                </div>
                {account ? (
                  <div className="text-sm text-secondary">
                    {userAllocation ? (
                      i18n._(t`Allocated: ${formatNumber(userAllocation)} SOUL`)
                    ) : (
                      <Dots>{i18n._(t`Claimable: Fetching Claimable Amount`)}</Dots>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-secondary">{i18n._(t`Total Locked: Connect Wallet`)}</div>
                )}
              </div>

              <Button
                color="gradient"
                disabled={
                  !isAddress(account ?? '') ||
                  claimConfirmed ||
                  !unclaimedAmount ||
                  Number(unclaimedAmount?.toFixed(8)) <= 0
                }
                size="lg"
                onClick={onClaim}
                className="inline-flex items-center justify-center"
              >
                {claimConfirmed ? i18n._(t`Claimed`) : i18n._(t`Claim SOUL`)}
                {attempting && (
                  <Loader
                    stroke="white"
                    style={{
                      marginLeft: '10px',
                    }}
                  />
                )}
              </Button>
            </div>
          </div>
          <div className="relative w-full overflow-hidden rounded bg-dark-900">
            <div className="flex flex-col gap-3 p-4">
              <div className="font-bold text-white">{i18n._(t`Things you may do with your SOUL`)}</div>
              <div className="p-4 rounded bg-dark-800">
                <Link href="/seance">
                  <a className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-white">{i18n._(t`Stake for Seance`)}</div>
                      <div className="text-sm text-secondary">
                        {t`Gain governance rights with SEANCE, while earning SOUL every second.`}
                      </div>
                    </div>
                    <div className="min-w-[32px]">
                      <ChevronRight />
                    </div>
                  </a>
                </Link>
              </div>
              <div className="p-4 rounded bg-dark-800">
                <Link href={`/mines`}>
                  <a className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-white">{i18n._(t`Farm with SOUL-FTM`)}</div>
                      <div className="text-sm text-secondary">
                        {t`Pair your SOUL with FTM and add to Farms for more SOUL and an enhanced AURA.`}
                        {/* {t`(COMING SOON) Stake into SEANCE add collateral as all in one click.`} */}
                      </div>
                    </div>
                    <div className="min-w-[32px]">
                      <ChevronRight />
                    </div>
                  </a>
                </Link>
              </div>
              <div className="p-4 rounded bg-dark-800">
              <Link href={`/bond`}>
                  <a className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-white">{i18n._(t`Mint SOUL with Liquidity`)}</div>
                      <div className="text-sm text-secondary">
                        {t`Pair your SOUL and add to Bonds for more SOUL at record-high returns.`}
                        {/* {t`(COMING SOON) Stake into SEANCE add collateral as all in one click.`} */}
                      </div>
                    </div>
                    <div className="min-w-[32px]">
                      <ChevronRight />
                    </div>
                  </a>
                </Link>
                </div>
              {/* <div className="p-4 rounded bg-dark-800">
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-white">{i18n._(t`Enter the Underworld`)}</div>
                  <div className="text-sm text-secondary">
                    {t`(COMING SOON) Accrue automatic yield through flash loans and SOUL strategies.`}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
