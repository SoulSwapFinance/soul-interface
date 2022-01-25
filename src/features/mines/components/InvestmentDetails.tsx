import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { JSBI, Token, USD, ZERO } from 'sdk'
import { CurrencyLogo } from 'components/CurrencyLogo'
import Typography from 'components/Typography'
import { formatNumber, tryParseAmount } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { usePendingSoul, useUserInfo } from '../hooks'
import useSummoner from 'features/summoner/useSummoner'
import usePendingReward from '../hooks/usePendingReward'
import { SOUL, SEANCE_ADDRESS, SOUL_ADDRESS, WNATIVE } from '../../../constants'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'
import { usePrice } from 'hooks/usePrice'
import { Button } from 'components/Button'

const InvestmentDetails = ({ farm }) => {
  const { i18n } = useLingui()
  // const { account, 250 } = useActiveWeb3React()
  // const [depositValue, setDepositValue] = useState('')

  const { harvest, stake } = useSummoner()
  const router = useRouter()
  const addTransaction = useTransactionAdder()
  const [pendingTx, setPendingTx] = useState(false)

  let token0 = useCurrency(farm.pair.token0?.id)
  let token1 = useCurrency(farm.pair.token1?.id)

  const soulPrice = usePrice(SOUL_ADDRESS[250])

  const liquidityToken = new Token(
    250,
    getAddress(farm.lpToken),
    18,
    // farm.pair.token1 ? 18 : farm.pair.token0 ? farm.pair.token0.decimals : 18,
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
    // USD[250], stakedAmount
    // )
    USD[250],
      JSBI.BigInt(
          ((Number(stakedAmount?.toExact()) * farm.pair.reserveUSD) / farm.pair.totalSupply)
            .toFixed(18)
            .toBigNumber(18)
        )
  )
  // const typedDepositValue = tryParseAmount(depositValue, liquidityToken)

  // function getTvl() {
  //   let lpPrice = 0
  //   let decimals = 18
  //   if (farm.lpToken.toLowerCase() == SOUL_ADDRESS[250].toLowerCase()) {
  //     lpPrice = Number(soulPrice)
  //     decimals = farm.pair.token0?.decimals
  //   } else if (farm.lpToken.toLowerCase() == WNATIVE[250].toLowerCase()) {
  //     lpPrice = Number(ftmPrice)
  //   } else if (farm.lpToken.toLowerCase() == '0x124B06C5ce47De7A6e9EFDA71a946717130079E6'.toLowerCase()) {
  //     lpPrice = Number(seancePrice)
  //   } else {
  //     lpPrice = pairPrice
  //   }

  //   farm.lpPrice = lpPrice
  //   farm.soulPrice = Number(soulPrice)

  //   return Number(farm.totalLp / 10 ** decimals) * lpPrice
  // }

  // const tvl = getTvl()


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
        <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-purple-dark-800 opacity-20" />
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
          <div className="text-lg font-bold cursor-pointer">{i18n._(t`Rewards`)}:</div>
          {((pendingSoul && pendingSoul.greaterThan(ZERO)) || (pendingReward && Number(pendingReward) > 0)) && 
          farm.pair?.token1 ?
          (
            <Button
            color="blue"
            className="text-emphasis"
            // variant={'flexed'}
            variant="outlined"
            size={"sm"}              
            disabled={pendingTx}
            onClick={onHarvest}
            >
              {i18n._(t`Harvest`)}
            </Button>
          ) : (
            <Button
            color="blue"
            variant="outlined"
            disabled={pendingTx}
            onClick={claimStaking}
          >
            {i18n._(t`Harvest`)}
          </Button>
          )
        
        }
        </div>
        <div className="w-full bg-transparent border border-b-0 border-transparent rounded h-0font-bold text-high-emphesis border-gradient-r-blue-purple-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col space-y-2">
            {farm?.rewards?.map((reward, i) => (
              <div key={i} className="flex items-center space-x-2">
                <CurrencyLogo currency={SOUL[250]} size="30px" className="rounded-md" />
                {i === 0 && <Typography>{formatNumber(pendingSoul?.toSignificant(4) ?? 0)}</Typography>}
                {i === 1 && <Typography>{formatNumber(pendingReward)}</Typography>}
                <Typography>{reward.token}</Typography>
              </div>
            ))}
          </div>
          <Typography>{formatNumber(rewardValue, true)}</Typography>
        </div>
      </div>
    </div>
  )
}

export default InvestmentDetails
