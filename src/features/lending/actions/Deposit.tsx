import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
import { Button } from 'components/Button'
import UnderworldCooker from 'entities/UnderworldCooker'
// import { Direction, TransactionReview } from 'entities/TransactionReview'
import { Warnings } from 'entities/Warnings'
// import { formatNumber } from 'functions/format'
import { e10, ZERO } from 'functions/math'
import { useCoffinBoxContract } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'
import React, { useState } from 'react'

import { UnderworldApproveButton, TokenApproveButton } from '../components/Button'
import SmartNumberInput from '../components/SmartNumberInput'
// import TransactionReviewList from '../components/TransactionReview'
import WarningsList from '../components/WarningsList'
import { useUnderworldPairInfo } from 'hooks/useAPI'
// import { SubmitButton, Wrap } from 'features/underworld/Styles'
import NavLink from 'components/NavLink'
// import AssetInput from 'components/AssetInput'
// import Typography from 'components/Typography'

export default function Deposit({ pair }: any): JSX.Element {
  const { account, chainId } = useActiveWeb3React()
  const assetToken = useCurrency(pair.asset.address) || undefined
  const coffinBoxContract = useCoffinBoxContract()
  const { i18n } = useLingui()
  const { underworldPairInfo } = useUnderworldPairInfo(pair.address)
  // const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  // const assetDecimals = Number(underworldPairInfo.assetDecimals)
  // format tickers //
  const aTicker = underworldPairInfo.assetTicker
  // const bTicker = underworldPairInfo.collateralTicker

  const assetSymbol
    = aTicker == 'WAVAX' ? 'AVAX'
      : aTicker == 'WFTM' ? 'FTM'
      : aTicker == 'WETH.e' ? 'ETH'
        : aTicker == 'WBTC.e' ? 'BTC'
          : aTicker == 'LINK.e' ? 'LINK'
            : aTicker
  // const collateralSymbol
  //   = bTicker == 'WAVAX' ? 'AVAX'
  //     : bTicker == 'WFTM' ? 'FTM'
  //     : bTicker == 'WETH.e' ? 'ETH'
  //       : bTicker == 'WBTC.e' ? 'BTC'
  //         : bTicker == 'LINK.e' ? 'LINK'
  //           : bTicker

            // const assetDecimals = Number(underworldPairInfo.assetDecimals)
  // const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  // const assetPrice = Number(underworldPairInfo.assetPrice)
  // const collateralPrice = Number(underworldPairInfo.collateralPrice)
  
  // State
  // const [useCoffin, setUseCoffin] = useState<boolean>(Number(pair.asset.coffinBalance) > 0)
  const [useCoffin, setUseCoffin] = useState<boolean>(false)
  const [value, setValue] = useState('')

  // Calculated
  const assetNative = WNATIVE[chainId].address === pair.asset.address

  const ethBalance = useETHBalances(assetNative ? [account] : [])

  // const balance = useCoffin
  //   ? pair.asset.coffinBalance
  //   : assetNative
  //     ? //  @ts-ignore TYPE NEEDS FIXING
  //     BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
  //     : pair.asset.balance

  const max = useCoffin
    ? pair.asset.coffinBalance
    : assetNative
      ? // @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
      : pair.asset.balance

  const warnings = new Warnings()

  // Handlers
  async function onExecute(cooker: UnderworldCooker): Promise<string> {
    if (pair.currentExchangeRate.isZero()) {
      cooker.updateExchangeRate(false, ZERO, ZERO)
    }
    const amount = value.toBigNumber(pair.asset.tokenInfo.decimals)

    const deadBalance = await coffinBoxContract.balanceOf(
      pair.asset.address,
      '0x000000000000000000000000000000000000dead'
    )

    cooker.addAsset(amount, useCoffin, deadBalance.isZero())

    return `${i18n._(t`Deposit`)} ${pair.asset.tokenInfo.symbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis" />
      <SmartNumberInput
        color="blue"
        token={pair.asset}
        value={value}
        setValue={setValue}
        useCoffinTitleDirection="down"
        useCoffinTitle="from"
        useCoffin={useCoffin}
        setUseCoffin={setUseCoffin}
        maxTitle={`${assetSymbol}`}
        max={max}
        showMax={true}
      />
      {/* <AssetInput
        size="sm"
        id="add-collateral-input"
        value={value}
        currency={assetToken}
        onChange={setValue}
        className="!mt-0"
        showMax={true}
        spendFromWallet={!useCoffin}
      /> */}
      <WarningsList warnings={warnings} />
      {/* <TransactionReviewList transactionReview={transactionReview} /> */}
      <UnderworldApproveButton
        color="blue"
        content={(onCook: any) => (
          <TokenApproveButton value={value} token={assetToken} needed={!useCoffin}>
            <Button
              onClick={() => onCook(pair, onExecute)}
              disabled={Number(value) <= 0 || warnings.broken}
              className="w-full"
            >
                {`Deposit ${assetSymbol}`}
            </Button>
          </TokenApproveButton>
        )}
      />

    {/* const swapRoute = useCallback(() => {
        // wrapped-only
        bond.assetAddress == WFTM_ADDRESS[chainId]
            // implies: pair
            || bond.token2Address
            // use generic swap path.
            ? router.push(`/exchange/swap`)
            // else: use specified swap path.
            : router.push(`/exchange/swap?inputCurrency=${NATIVE[250].symbol}&outputCurrency=${bond.assetAddress}`)
    }, []) */}
        <NavLink
            href={`/swap/?inputCurrency=${NATIVE[chainId].symbol}&outputCurrency=${pair.asset.address}`}
        >
          <Button variant="bordered" className={pair.asset.address == WNATIVE_ADDRESS[chainId] ? `hidden` : 'mt-2'} color={'blue'}>
              <div className={`flex font-bold text-white justify-center`}>
                {/* <ArrowLeftIcon className={'mt-1 mr-1'} width="1em" height="1em" /> */}
                {`Acquire ${assetSymbol}`}
              </div>
          </Button>
          </NavLink>
    </>
  )
}