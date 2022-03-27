import React from 'react'
import { useModalOpen, useToggleTokenStatsModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import Image from 'next/image'
import styled from 'styled-components'
import Typography from 'components/Typography'
import ExternalLink from 'components/ExternalLink'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { useSeanceContract, useSoulContract } from 'hooks'
import { formatNumber, formatNumberScale, formatPercent } from 'functions'
import { SOUL_ADDRESS, SEANCE_ADDRESS } from 'constants/addresses'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { AURA } from '../../constants'
import QuestionHelper from '../../components/QuestionHelper'
import { useBondTVL, useTVL, useSoulTVL, useVaultTVL } from 'hooks/useV2Pairs'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import ModalHeader from 'components/Modal/Header'
import { usePrice } from 'hooks/usePrice'
import { HeadlessUiModal } from 'components/Modal'
import { concat } from 'lodash'
import { SOUL } from 'sdk'
import { useSeancePrice, useSoulPrice } from 'hooks/getPrices'

const cache: { [key: string]: number } = {};

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export default function SoulStatsModal(): JSX.Element | null {

  const { chainId, library, account } = useActiveWeb3React()
  const soulStatsModalOpen = useModalOpen(ApplicationModal.SOUL_STATS)
  const toggleSoulStatsModal = useToggleTokenStatsModal()
  let tokenInfo = useTokenInfo(useSoulContract())
  let seanceInfo = useTokenInfo(useSeanceContract())
  // let auraInfo = useTokenInfo(useAuraContract())
    
  const auraBalance = useTokenBalance(account ?? undefined, AURA[250])
   
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const tvlInfo = useTVL()
  const bondInfo = useBondTVL()
  const vaultInfo = useVaultTVL()
  const soulInfo = useSoulTVL()

  let bondsTvl = bondInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let vaultsTvl = vaultInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let soulTvl = soulInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let farmsTvl = tvlInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let podl = bondsTvl + soulTvl
  let tvl = farmsTvl + vaultsTvl
  let percPodl = formatPercent(podl / farmsTvl * 100)

  function getSummaryLine(title, value) {
    return (
      <div className="flex flex-col gap-2 bg-dark-800 rounded py-1 px-3 w-full">
        <div className="flex items-center justify-between">
          {title}
          <Typography variant="sm" className="flex items-center font-bold py-0.5">
            {value}
          </Typography>
        </div>
      </div>
    )
  }
  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled isOpen={soulStatsModalOpen}
      onDismiss={toggleSoulStatsModal}
      maxWidth={'md'}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          {/* <Wrapper className="flex flex-col-2 justify-between" > */}
          <div className="flex justify-between flex-col-2 w-full">
          <ModalHeader header={''} onClose={toggleSoulStatsModal} />
            {/* <div className="block"> */}
            {/* <QuestionHelper text={`Add to MetaMask`}/> */}
            <div
              className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
              onClick={() => {
                const params: any = {
                  type: 'ERC20',
                  options: {
                    address: SOUL[chainId].address,
                    symbol: 'SOUL',
                    decimals: 18,
                    image: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png',
                  },
                }
                if (library && library.provider.isMetaMask && library.provider.request) {
                  library.provider
                    .request({
                      method: 'wallet_watchAsset',
                      params,
                    })
                    .then((success) => {
                      if (success) {
                        console.log('Successfully added SOUL to MetaMask')
                      } else {
                        throw new Error('Something went wrong.')
                      }
                    })
                    .catch(console.error)
                }
              }}
            >
              <Image
                src="https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png"
                alt="SOUL"
                width="1600px"
                height="1600px"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
            <div
              className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
              onClick={() => {
                const params: any = {
                  type: 'ERC20',
                  options: {
                    address: SEANCE_ADDRESS[250],
                    symbol: 'SEANCE',
                    decimals: 18,
                    image: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x124B06C5ce47De7A6e9EFDA71a946717130079E6/logo.png',
                  },
                }
                if (library && library.provider.isMetaMask && library.provider.request) {
                  library.provider
                    .request({
                      method: 'wallet_watchAsset',
                      params,
                    })
                    .then((success) => {
                      if (success) {
                        console.log('Successfully added SEANCE to MetaMask')
                      } else {
                        throw new Error('Something went wrong.')
                      }
                    })
                    .catch(console.error)
                }
              }}
            >
              <Image
                src="https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x124B06C5ce47De7A6e9EFDA71a946717130079E6/logo.png"
                alt="SEANCE"
                width="1600px"
                height="1600px"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-0">

        <div className="flex mt-1" />
        <Typography className='flex justify-center text-2xl leading-[28px] bg-dark-700'>{`Tokenomics Overview`}</Typography>
      </div>
      <div className="flex flex-col mt-2 mb-2 flex-nowrap gap-1.5 -m-1">
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Voting Power`}
          </Typography>,
        auraBalance?.toSignificant(4).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            )}
         {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Maximum Supply`}
          </Typography>,
          formatNumberScale(
            Number(250_000_000), false)
            )}
          {getSummaryLine(
            <div className="flex items-center">
            <Typography variant="sm" className="flex items-center py-0.5">
              {`Circulating Supply`}
            </Typography>
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2 py-1 px-3 w-full">
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Total Supply
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(tokenInfo?.totalSupply, false)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      - {' '} DAO Treasury
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(Number(tokenInfo?.totalSupply) * 0.125, false)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      - {' '} Total Staked
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(seanceInfo?.totalSupply, false)}
                    </Typography>
                  </div>
                  <hr></hr>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Circulating
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(
                        Number(tokenInfo?.totalSupply)
                        - Number(seanceInfo?.totalSupply)
                        - (Number(tokenInfo?.totalSupply) * 0.125)
                        , false)}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>,
          formatNumberScale(
            Number(tokenInfo?.totalSupply)
            - Number(seanceInfo?.totalSupply)
            - (Number(tokenInfo?.totalSupply) * 0.125)
            , false)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Total Market Cap`}
          </Typography>,
          formatCurrency(
            Number(tokenInfo?.totalSupply) * soulPrice
          // +  Number(seanceInfo?.totalSupply) * seancePrice
        ))}
        {getSummaryLine(
          <div className="flex items-center">
            <Typography variant="sm" className="flex items-center py-0.5">
              {`Total Value Locked`}
            </Typography>
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2 py-1 px-3 w-full">
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Farming
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(farmsTvl - vaultsTvl, true)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Staked
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(vaultsTvl, true)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Bonded
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(bondsTvl, true)}
                    </Typography>
                  </div>
                  <hr></hr>
                  <div />
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Total Value
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(
                        Number(farmsTvl-vaultsTvl) // FARMS ONLY
                        + Number(vaultsTvl) // STAKED ONLY
                        + Number(bondsTvl) // BONDS ONLY
                        , true)}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>,
          formatCurrency(
            Number(farmsTvl + bondsTvl), 0)
        )}
        {getSummaryLine(
          <div className="flex items-center">
            <Typography variant="sm" className="flex items-center py-0.5">
              {`Protocol Liquidity`}
            </Typography>
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2 py-1 px-3 w-full">
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Bonded
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(bondsTvl, true)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      DAO
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(soulTvl, true)}
                    </Typography>
                  </div>
                  <hr></hr>
                  <div />
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      Total Value
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(
                        Number(bondsTvl)
                        // + Number(soulTvl)
                        , true)}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>,
          concat(formatNumberScale(
            Number(bondsTvl + soulTvl), true)
            , 
            ` (${((podl / farmsTvl * 100).toFixed(0))}%)`
        ))}
        {/* {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Percent PODL`}
          </Typography>,
            percPodl
        )} */}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Soul Market Price`}
          </Typography>,
          formatCurrency(
            soulPrice, 2)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Seance Market Price`}
          </Typography>,
          formatCurrency(
            seancePrice, 2)
        )}
        <div className="flex mt-3" />
        <Button
          color='purple'
          type='flexed'
          size='xs'
          className="text-white"
        >
          <NavLink href={'/bonds'}>
            <a className="flex justify-center text-black text-xl transition rounded-md hover:pink">
              MINT SOUL<span> ↗</span>
            </a>
          </NavLink>
        </Button>
        <Button
          color='purple'
          type='flexed'
          size='xs'
          className="text-white"
        >
          <NavLink href={'/seance'}>
            <a className="flex justify-center text-black text-xl transition rounded-md hover:pink">
              STAKE SOUL<span> ↗</span>
            </a>
          </NavLink>
        </Button>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


