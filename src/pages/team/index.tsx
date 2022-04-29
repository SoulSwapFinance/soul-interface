import { Currency, CurrencyAmount, Token, ZERO } from 'sdk'
import React, { useEffect, useState } from 'react'
import { useClaim, claimableAmount } from 'state/team/hooks'
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
import { useActiveWeb3React } from 'services/web3'
import { useTeamContract } from 'hooks/useContract'

export default function Team() {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const TeamContract = useTeamContract()
  const [unclaimedBalance, setUnclaimedBalance] = useState(0)
  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // monitor the status of the claim from contracts and txns
  const { claim } = useClaim()

  function onClaim(index) {
    setAttempting(true)
    claim(index)
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        // console.log(error)
      })
  }

  const [userAllocation, setAllocation] = useState<string>()


  /**
   * Runs only on initial render/mount
   */
   useEffect(() => {
    fetchBals()
  }, [])

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        fetchBals()
      }, 3000)
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    } catch (err) {
      console.warn(err)
    }
  })

    const fetchBals = async () => {
        try {
            const bal = await TeamContract.userBalance(0)
            const unclaimedBal = bal / 1e18
            console.log('unclaimedBal:%s', Number(unclaimedBal))
            setUnclaimedBalance(unclaimedBal)

          return [unclaimedBal]
        } catch (err) {
            console.warn(err)
        }
    }

  return (
    <Container id="claims-page" className="py-4 md:py-8 lg:py-12 m-auto w-full max-w-[900px]">
      <Head>
        <title>Team | Soul</title>
        <meta key="description" name="description" content="SoulSwap Claims..." />
      </Head>
      <div className="flex px-0 sm:px-4 md:flex-row md:space-x-10 lg:space-x-20 md:px-10">
        <div className="flex flex-col gap-3 max-w-[900px]">
          <div className="relative w-full overflow-hidden rounded bg-dark-900">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-row justify-center">
                <div className="font-bold text-center text-white">{i18n._(t`Claimable SOUL`)}</div>
              </div>
              {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
              <div className="flex text-center justify-center items-baseline">
                <div className="flext font-bold text-white text-center justify-center text-[24px]">
                  { formatNumber(unclaimedBalance.toFixed(2), false, true) }
                </div>
                {/* {account ? (
                  <div className="text-sm text-secondary">
                    {unclaimedBalance ? (
                      i18n._(t`Allocated: ${formatNumber(unclaimedBalance)} SOUL`)
                    ) : (
                      <Dots>{i18n._(t`Claimable: Fetching Claimable Amount`)}</Dots>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-secondary">{i18n._(t`Total Locked: Connect Wallet`)}</div>
                )} */}
              </div>

              <Button
                color="gradient"
                size="sm"
                onClick={onClaim}
                className="inline-flex items-center justify-center"
              >
                {
                // claimConfirmed ? i18n._(t`Claimed`) : 
                i18n._(t`Claim SOUL`)
                }
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
          </div>
          </div>
          </Container>
          )
        }