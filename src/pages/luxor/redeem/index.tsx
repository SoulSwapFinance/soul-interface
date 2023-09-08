import React, { useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { Tab } from '@headlessui/react'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { Button, ButtonError } from 'components/Button'
import StableInputPanel from 'components/StableInputPanel'
import { AutoColumn } from 'components/Column'
import { ApprovalState, useApproveCallback, useLuxorRefunderContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { Token, LUX_ADDRESS, ChainId, LUXOR_REEFUNDER_ADDRESS, REFUNDER_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
import { formatNumber, tryParseAmount } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'services/web3/hooks'
import NavLink from 'components/NavLink'
import { SunsetBanner } from 'components/Banner'
import { LUXOR, WFTM } from 'constants/tokens'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import { useUserTokenInfo } from 'hooks/useAPI'

function Redeem() {
  const addTransaction = useTransactionAdder()

  const [inputAmount, setInputAmount] = useState('')

  const { account, chainId } = useActiveWeb3React()
  const luxorToken = new Token(chainId, getAddress(LUX_ADDRESS[chainId ?? ChainId.FANTOM]), 9, 'LUX')

  const luxorBalance = useCurrencyBalance(ChainId.FANTOM, account, luxorToken)
  const LuxorRefunderContract = useLuxorRefunderContract()

  const parsedInputValue = tryParseAmount(inputAmount, LUXOR[ChainId.FANTOM])
  // const parsedOutputValue = tryParseAmount(outputAmount, WFTM[ChainId.FANTOM])

  const [approvalState, setApproval] = useApproveCallback(
    parsedInputValue,
    LUXOR_REEFUNDER_ADDRESS[chainId ?? ChainId.FANTOM]
  )

  const refunderError = !parsedInputValue
    ? 'Enter Amount'
    : luxorBalance?.lessThan((parsedInputValue))
      ? 'Insufficient Balance'
      : undefined

  const isRefundValid = !refunderError

  const CONVERSION_RATE = 0.12
  const { userTokenInfo } = useUserTokenInfo(REFUNDER_ADDRESS[ChainId.FANTOM], WNATIVE_ADDRESS[ChainId.FANTOM])
  const remainingFunds = formatNumber(Number(userTokenInfo?.balance) / 1E18, false, true)

  return (
    <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
      <LuxorGlowShadow>
        <Head>
          <title>Redeem | Luxor</title>
          <meta key="description" name="description" />
        </Head>
        <SunsetBanner />
        <div className="flex ml-2 mr-2 mb-4 mt-4 gap-1 items-center justify-center">
          {/* <Button variant="filled" color="yellow" size="lg">
            <NavLink href={'/luxor/bonds'}>
              <div className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                {'Bond'}
              </div>
            </NavLink>
          </Button> */}
          <Button variant="filled" color="yellow" size="lg">
            <NavLink href={'/luxor/stake'}>
              <div className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                {'Unstake'}
              </div>
            </NavLink>
          </Button>
          <Button variant="filled" color="yellow" size="lg">
            <NavLink href={'/luxor/wrap'}>
              <div className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                {'Unwrap'}
              </div>
            </NavLink>
          </Button>
        </div>
        <div className="p-6 space-y-6 bg-dark-900 rounded z-1 relative">
          <Tab.Group>
            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
              <div className="grid grid-cols-1 w-[95%] rounded-md p-2px bg-dark-900">
                <Tab
                  className={({ selected }) =>
                    `${selected ? 'border-b-2 border-accent p-2 border-green text-white' : 'bg-dark-900 text-white'
                    } flex items-center justify-center px-3 rounded-2xl py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                  }
                >
                  {`REDEEM WFTM`}
                </Tab>
              </div>
            </Tab.List>

            {/* REFUND TAB */}
            <Tab.Panel className={'outline-none'}>
              <StableInputPanel
                value={inputAmount}
                showLogo={true}
                showMaxButton={true}
                onUserInput={(value) => setInputAmount(value)}
                onMax={() => setInputAmount(luxorBalance.toExact())}
                currency={LUXOR[ChainId.FANTOM]}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-input"
              />
              <AutoColumn justify="space-between" className="py-2 -my-4">
                <div className="flex justify-center -mt-0 -mb-0 z-0">
                  <div
                    role="button"
                    className="p-1.5 rounded-full bg-dark-1000 border shadow-md border-dark-700 hover:border-yellow"
                  >
                    <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
                  </div>
                </div>
              </AutoColumn>
              <StableInputPanel
                value={(Number(inputAmount) * CONVERSION_RATE).toString()}
                showLogo={true}
                showMaxButton={false}
                currency={WFTM[ChainId.FANTOM]}
                disableCurrencySelect={true}
                locked={true}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-yellow rounded-2xl border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-center">
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {`1 LUX = ${CONVERSION_RATE} WFTM`}
                  </Typography>
                </div>
              </div>
              {/* <div className="flex flex-col bg-dark-1000 mt-4 p-3 border border-1 border-green rounded-2xl border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-center">
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {`Max Redeemable: ${remainingFunds?.toString()} WFTM`}
                  </Typography>
                </div>
              </div> */}
              <div className="mt-6 flex items-center gap-2">
                {isRefundValid &&
                  (approvalState === ApprovalState.NOT_APPROVED ||
                    approvalState === ApprovalState.PENDING) ? (
                  <Button
                    color="yellow"
                    type="filled"
                    onClick={setApproval}
                    disabled={approvalState !== ApprovalState.NOT_APPROVED}
                  >
                    {approvalState === ApprovalState.PENDING ? (
                      <Dots
                        className="text-black"
                      >{`Approving`}</Dots>
                    ) : (
                      <Typography
                        className="text-black font-bold"
                      >
                        {`Approve`}
                      </Typography>
                    )}
                  </Button>
                ) : (
                  <ButtonError
                    variant="filled" color="green"
                    className="text-black"
                    onClick={async () => {
                      try {
                        const tx = await LuxorRefunderContract.refund(
                          // inputAmount
                          BigNumber.from(parsedInputValue.quotient.toString())
                        )
                        addTransaction(tx, {
                          summary: `Redeem WFTM`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!account}
                    error={!!parsedInputValue}
                  >
                    <Typography
                      className="text-black"
                    >
                      {refunderError || `Redeem ${formatNumber((Number(inputAmount) * CONVERSION_RATE), false, true)} WFTM`}
                    </Typography>
                  </ButtonError>
                )}
              </div>
            </Tab.Panel>
          </Tab.Group>
        </div>
      </LuxorGlowShadow>
    </Container>
  )
}

export default Redeem

Redeem.Guard = NetworkGuard(Feature.LUXOR)
