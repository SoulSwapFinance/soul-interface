import React from 'react'
import { useModalOpen, useToggleLuxorStatsModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import Image from 'next/image'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import ExternalLink from 'components/ExternalLink'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { useWrappedLumensContract, useLuxorContract } from 'hooks'
import { formatNumberScale } from 'functions'
import { LUX_ADDRESS, WLUM_ADDRESS } from 'constants/addresses'
// import QuestionHelper from '../../components/QuestionHelper'
import { useLuxTVL, useTVL, useVaultTVL } from 'hooks/useV2Pairs'
// import { Wrapper } from 'features/swap/styleds'
import { Button } from 'components/Button'
import { useActiveWeb3React } from 'services/web3'
import QuestionHelper from 'components/QuestionHelper'
import ModalHeader from 'components/Modal/Header'
import { concat } from 'lodash'
import { useLuxorPrice, useWrappedLumPrice } from 'hooks/getPrices'
import NavLink from 'components/NavLink'

const cache: { [key: string]: number } = {};

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export default function LuxorStatsModal(): JSX.Element | null {

  const { chainId, library, account } = useActiveWeb3React()
  const luxorStatsModalOpen = useModalOpen(ApplicationModal.LUXOR_STATS)
  const toggleLuxorStatsModal = useToggleLuxorStatsModal()
  let tokenInfo = useTokenInfo(useLuxorContract())
  let wrappedLumensInfo = useTokenInfo(useWrappedLumensContract())
  const luxorPrice = useLuxorPrice()
  const wLumPrice = useWrappedLumPrice()

  const farmInfo = useTVL()
  const vaultInfo = useVaultTVL()
  const luxInfo = useLuxTVL()

  let luxTvl = luxInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let vaultsTvl = vaultInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let farmsTvl = farmInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let tvl = farmsTvl

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
    <HeadlessUiModal.Controlled isOpen={luxorStatsModalOpen} onDismiss={toggleLuxorStatsModal}
      maxWidth={'md'}
    // maxWidth={672}
    >
    <ModalHeader header={''} onClose={toggleLuxorStatsModal} />
      <div className="mt-2 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between gap-2 flex-col-2 w-full">
            <div
              className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
              onClick={() => {
                const params: any = {
                  type: 'ERC20',
                  options: {
                    address: LUX_ADDRESS[chainId],
                    symbol: 'LUX',
                    decimals: 9,
                    image: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b/logo.png',
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
                        console.log('Successfully added LUX to MetaMask')
                      } else {
                        throw new Error('Something went wrong.')
                      }
                    })
                    .catch(console.error)
                }
              }}
            >
              <Image
                src="/images/tokens/LUX-transparent.png"
                alt="LUX"
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
                    address: WLUM_ADDRESS[chainId],
                    symbol: 'WLUM',
                    decimals: 9,
                    image: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208/logo.png',
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
                        console.log('Successfully added WLUM to MetaMask')
                      } else {
                        throw new Error('Something went wrong.')
                      }
                    })
                    .catch(console.error)
                }
              }}
            >
              <Image
                src="/images/tokens/wlumens-transparent.png"
                alt="WLUM"
                width="1600px"
                height="1600px"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
            {/* </QuestionHelper> */}

            {/* </div> */}
            {/* <div className="flex flex-1 flex-col"> */}
            {/* <div className="flex mt-4 flex-row justify-center"> */}
            {/* <div className="mt-6 flex justify-center text-3xl">{'LUX & WLUM'}</div> */}
            {/* <div className="flex items-center text-purple justify-between"> */}
          </div>
          {/* </div> */}
          {/* <div className="flex flex-col justify-between">
            <div className="flex items-center text-primary text-bold">
                <div className="text-primary text-base text-secondary text-2xl">{`${luxorPrice}`}</div>
                <div className="text-primary text-base text-secondary text-2xl">{`${wrappedLumensPrice}`}</div> */}
          {/* <div className="flex items-center text-primary text-bold">
              <div className="text-primary text-base text-secondary text-2xl">{`${luxorPrice}`}</div>
              </div>
                  <div className="text-primary text-base text-secondary text-2xl">{`${wrappedLumensPrice}`}</div> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      <div className="space-y-0">

        <div className="flex mt-1" />
        <Typography className='flex justify-center text-2xl leading-[28px] bg-dark-700'>{`Tokenomics Overview`}</Typography>
      </div>
      <div className="flex flex-col mt-2 mb-2 flex-nowrap gap-1.5 -m-1">
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
                      {formatNumberScale(Number(tokenInfo?.totalSupply) * 0.19, false)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                    - {' '} Total Staked
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold px-2 py-0.5">
                      {formatNumberScale(wrappedLumensInfo?.circulatingSupply, false)}
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
                        - Number(wrappedLumensInfo?.circulatingSupply)
                        - (Number(tokenInfo?.totalSupply) * 0.19) // TODO: make exact
                        , false)}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>,
          formatNumberScale(
            Number(tokenInfo?.totalSupply)
            - Number(wrappedLumensInfo?.circulatingSupply)
            - (Number(tokenInfo?.totalSupply) * 0.19) // TODO: make exact
            , false)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Total Market Cap`}
          </Typography>,
          formatCurrency(
            Number(tokenInfo?.totalSupply) * Number(luxorPrice))
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Protocol Liquidity`}
          </Typography>,
          concat(formatNumberScale(
            luxTvl, true)
            ,
            ` (${((luxTvl / tvl * 100).toFixed(0))}%)`)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Luxor Market Price`}
          </Typography>,
          formatCurrency(
            luxorPrice)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`wLumens Market Price`}
          </Typography>,
          formatCurrency(
           wLumPrice)
        )}
        <div className="flex mt-3" />
        {/* <div className="flex"> */}
        {/* <ExternalLink
                  href={
                    'https://exchange.soulswap.finance/bonds'
                  }
                  className="ring-6 text-purple bg-dark-800 ring-transparent ring-opacity-0"
                  startIcon={<LinkIcon size={16} />}
                >
                  <Typography className="text-xl hover:underline py-0.5 currentColor">
                    {`Mint`}
                  </Typography>
                  </ExternalLink> */}
        <Button
          color='yellow'
          type='outlined'
          size='xs'
          className="text-white"
        >
          <NavLink href={'/luxor/bonds'}>
            <a className="flex justify-center text-black text-xl transition rounded-md hover:pink">
              MINT LUX<span> ↗</span>
            </a>
          </NavLink>
        </Button>
        <Button
          color='yellow'
          type='outlined'
          size='xs'
          className="text-white"
        >
          <NavLink href={'/luxor/stake'}>
            <a className="flex justify-center text-black text-xl transition rounded-md hover:pink">
              STAKE LUX<span> ↗</span>
            </a>
          </NavLink>
        </Button>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


