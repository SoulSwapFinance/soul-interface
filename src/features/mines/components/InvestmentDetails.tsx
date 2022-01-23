import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, JSBI, Token, USD, ZERO } from 'sdk'
import { Button } from 'components/Button'
import { CurrencyLogo } from 'components/CurrencyLogo'
import Typography from 'components/Typography'
import { easyAmount, formatNumber, tryParseAmount } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { PairType } from '../enum'
import { usePendingSoul, useUserInfo } from '../hooks'
import useSummoner from 'features/summoner/useSummoner'
import usePendingReward from '../hooks/usePendingReward'
import { SOUL, SOUL_ADDRESS, WNATIVE } from '../../../constants'
import { usePriceHelperContract } from 'features/bond/hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'

const InvestmentDetails = ({ farm }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [depositValue, setDepositValue] = useState('')

  const { harvest, stake } = useSummoner()
  const router = useRouter()
  const addTransaction = useTransactionAdder()
  const [pendingTx, setPendingTx] = useState(false)

  let token0 = useCurrency(farm.pair.token0?.id)
  let token1 = useCurrency(farm.pair.token1?.id)

  const priceHelperContract = usePriceHelperContract()

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log('soul price:%s', soulPrice)

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const liquidityToken = new Token(
    chainId,
    getAddress(farm?.lpToken),
    farm.pair.token1 ? 18 : farm.pair.token0 ? farm.pair.token0.decimals : 18,
    farm.pair.token1 ? farm.pair.symbol : farm.pair.token0.symbol,
    farm.pair.token1 ? farm.pair.name : farm.pair.token0.name
  )

  const stakedAmount = useUserInfo(farm, liquidityToken)
  const [selectedFarm, setSelectedFarm] = useState<string>(null)

  let [data] = useV2PairsWithPrice([[token0, token1]])
  let [state, pair, pairPrice] = data

  const pendingSoul = usePendingSoul(farm)
  const pendingReward = usePendingReward(farm)

  const positionFiatValue = (
    // USD[chainId], stakedAmount
    // )
    USD[chainId],
      JSBI.BigInt(
          ((Number(stakedAmount?.toExact()) * farm.pair.reserveUSD) / farm.pair.totalSupply)
            .toFixed(USD[chainId].decimals)
            .toBigNumber(USD[chainId].decimals)
        )
  )
  const typedDepositValue = tryParseAmount(depositValue, liquidityToken)

  function getTvl() {
    let lpPrice = 0
    let decimals = 18
    if (farm.lpToken.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase()) {
      lpPrice = Number(soulPrice)
      decimals = farm.pair.token0?.decimals
    } else if (farm.lpToken.toLowerCase() == WNATIVE[chainId].toLowerCase()) {
      lpPrice = Number(ftmPrice)
    } else if (farm.lpToken.toLowerCase() == '0x124B06C5ce47De7A6e9EFDA71a946717130079E6'.toLowerCase()) {
      lpPrice = Number(seancePrice)
    } else {
      lpPrice = pairPrice
    }

    farm.lpPrice = lpPrice
    farm.soulPrice = Number(soulPrice)

    return Number(farm.totalLp / 10 ** decimals) * lpPrice
  }

  const tvl = getTvl()


  const rewardValue =
    (farm?.rewards?.[0]?.rewardPrice ?? 0) * Number(pendingSoul?.toExact() ?? 0) +
    (farm?.rewards?.[1]?.rewardPrice ?? 0) * Number(pendingReward ?? 0)

  async function onHarvest() {
    setPendingTx(true)
    try {
      const tx = await harvest(farm.id)
      addTransaction(tx, {
        summary: i18n._(t`Harvest ${farm.pair.token0.name}/${farm.pair.token1.name}`),
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }
  
  async function claimStaking() {
    setPendingTx(true)
    try {
      const tx = await stake(farm.id)
      addTransaction(tx, {
        summary: i18n._(t`Harvest SOUL`),
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between font-bold">
          <div className="text-lg cursor-pointer">{i18n._(t`Deposited`)}:</div>
          <Typography className="font-bold">

            {formatNumber(stakedAmount?.toSignificant(6) ?? 0)} &nbsp;
            {farm.pair.token0?.symbol}-{farm.pair.token1?.symbol}
            {liquidityToken?.symbol}

          </Typography>
        </div>
        <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <CurrencyLogo currency={token0} size="30px" />
              {/* {(
                <Typography>
                {formatNumber((farm.pair?.reserve0 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair?.totalSupply)}
                </Typography>
              )} */}
              <Typography>{token0?.symbol}</Typography>
               { token1?.symbol ?
              <Typography>{' ('}{formatNumber(Number(pairPrice) / 2 * Number(stakedAmount?.toSignificant(2)), true)}{') '}</Typography>
              : <Typography>{' ('}{formatNumber(Number(soulPrice) * Number(stakedAmount?.toSignificant(2)), true)}{') '}</Typography>
              }
            </div>
            {token1?.symbol ?
             <div className="flex items-center space-x-2">
           <CurrencyLogo currency={token1} size="30px" />
               {/* <Typography>
                  {formatNumber((farm.pair?.reserve1 * Number(stakedAmount) ?? 0) / farm.pair.totalSupply)}
                </Typography> */}
               <Typography>{token1?.symbol}</Typography>
              <Typography>{' ('}{formatNumber(Number(pairPrice) / 2 * Number(stakedAmount?.toSignificant(2)), true)}{') '}</Typography>
            </div>
                : ''}
          </div>

          {/* MULTIPLY PRICE PER ASSET * AMOUNT LP */}
          { pair?.token1 ?
          <Typography>{formatNumber(Number(pairPrice) * Number(stakedAmount?.toSignificant(2)), true)}</Typography>
          :
          <Typography>{formatNumber(Number(soulPrice) * Number(stakedAmount?.toSignificant(2)), true)}</Typography> 
          }
          </div>
      </div>
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between">
          <div className="text-lg font-bold cursor-pointer">{i18n._(t`Pending Rewards`)}:</div>
          {((pendingSoul && pendingSoul.greaterThan(ZERO)) || (pendingReward && Number(pendingReward) > 0)) && 
          farm.pair?.token1 ?
          (
            <button
              className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
              disabled={pendingTx}
              onClick={onHarvest}
            >
              {i18n._(t`Harvest Rewards`)}
            </button>
          ) : (
            <button
            className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
            disabled={pendingTx}
            onClick={claimStaking}
          >
            {i18n._(t`Harvest Rewards`)}
          </button>
          )
        
        }
        </div>
        <div className="w-full bg-transparent border border-b-0 border-transparent rounded h-0font-bold text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col space-y-2">
            {farm?.rewards?.map((reward, i) => (
              <div key={i} className="flex items-center space-x-2">
                <CurrencyLogo currency={SOUL[chainId]} size="30px" className="rounded-md" />
                {i === 0 && <Typography>{formatNumber(pendingSoul?.toSignificant(4) ?? 0)}</Typography>}
                {i === 1 && <Typography>{formatNumber(pendingReward)}</Typography>}
                <Typography>{reward.token}</Typography>
              </div>
            ))}
          </div>
          <Typography>{formatNumber(rewardValue / 1e18, true)}</Typography>
        </div>
      </div>
    </div>
  )
}

export default InvestmentDetails
