import React, { useContext } from 'react'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useToggleTokenStatsModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import Image from 'next/image'
import styled from 'styled-components'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import Typography from '../../components/Typography'
import ExternalLink from '../../components/ExternalLink'
import { PriceContext } from '../../contexts/priceContext'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useTokenInfo } from '../../features/summoner/hooks'
import ISoulSwapPairABI from '../../constants/abis/soulswap/ISoulSwapPair.json'
import { useContract, useSeanceContract, useSoulContract } from '../../hooks'
import { formatNumberScale } from '../../functions'
import axios from 'axios'
import { LUX_ADDRESS, SEANCE_ADDRESS, SOUL_ADDRESS } from '../../constants/addresses'
import { ethers } from 'ethers'
import { soul } from '@soulswap/soul-data'
import { NEVER_RELOAD, useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useHelperContract, usePriceHelperContract } from '../../features/bond/hooks/useContract'
import QuestionHelper from '../../components/QuestionHelper'

const CloseIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const HeaderRow = styled.div`
  margin-bottom: 1rem;
`

const UpperSection = styled.div`
  position: relative;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }
  h5:last-child {
    margin-bottom: 0px;
  }
  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`
const HideOnMobile = styled.div`
  @media screen and (max-width: 420px) {
    display: none;
  }
`;

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
}

const cache: { [key: string]: number } = {};

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export default function TokenStatsModal(): JSX.Element | null {

  const { chainId, library, account } = useActiveWeb3React()
  const tokenStatsModalOpen = useModalOpen(ApplicationModal.SOUL_STATS)
  const toggleTokenStatsModal = useToggleTokenStatsModal()
  const modalOpen = useModalOpen(ApplicationModal.SOUL_STATS)
  const priceHelperContract = usePriceHelperContract()
  let tokenInfo = useTokenInfo(useSoulContract())
  let seanceInfo = useTokenInfo(useSeanceContract())
  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  console.log(Number(rawSoulPrice))
  const soulPrice = formatCurrency(Number(rawSoulPrice) / 1E18, 3)
  console.log(soulPrice)

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  console.log(Number(rawLuxPrice))
  const luxPrice = formatCurrency(Number(rawLuxPrice) / 1E18, 2)
  console.log(luxPrice)

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
    <Modal isOpen={tokenStatsModalOpen} onDismiss={toggleTokenStatsModal} maxWidth={672}>
      <div className="space-y-8">
        <div className="space-y-4">
          <ModalHeader title={''} onClose={toggleTokenStatsModal} />
          <Image
                    src="/soul2lux.gif"
                    alt="SOUL"
                    width="1600px"
                    height="1600px"
                    objectFit="contain"
                    className="rounded-md"
                    />
          <div className="flex flex-row w-full py-4">
            {/* <QuestionHelper text={`Add LUX to MetaMask`}>
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
                  src="/images/tokens/LUXOR.svg"
                  alt="LUX"
                  width="80px"
                  height="80px"
                  objectFit="contain"
                  className="rounded-md"
              />
            </div>
          </QuestionHelper> */}

            <QuestionHelper text={`Add to MetaMask`}>
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
                <div
                  className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                  onClick={() => {
                    const params: any = {
                      type: 'ERC20',
                      options: {
                        address: SOUL_ADDRESS[chainId],
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
                <div
                  className="rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                  onClick={() => {
                    const params: any = {
                      type: 'ERC20',
                      options: {
                        address: SEANCE_ADDRESS[chainId],
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
                  {/* <HideOnMobile>
                    <Image
                    src="/images/tokens/LUXOR.svg"
                    alt="LUX"
                    width="40px"
                    height="40px"
                    objectFit="contain"
                    className="rounded-md"
                    />
                    </HideOnMobile>
                    </div>
                    <HideOnMobile>
                    <Image
                    src="/images/tokens/soul.png"
                    alt="SOUL"
                    width="40px"
                    height="40px"
                    objectFit="contain"
                    className="rounded-md"
                    />
                  </HideOnMobile> */}
                  
                    </div>
                  </div> 
                  </div>
            </QuestionHelper>

            <div className="flex flex-1 flex-col">
              <div className="flex flex-row items-center px-3">
                <div className="text-primary text-2xl">{'SOUL & LUXOR'}</div>
              </div>
              <div className="flex items-center justify-between space-x-3 gap-2">
                <ExternalLink
                  href={
                    'https://app.luxor.money'
                  }
                  // href={
                  //   'https://ftmscan.com/address/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'
                  // }
                  className="px-3 ring-0 ring-transparent ring-opacity-0"
                  color="purple"
                  startIcon={<LinkIcon size={16} />}
                >
                  {/* <HideOnMobile> */}
                    <Typography variant="sm" className="hover:underline py-0.5 currentColor">
                      {`Luxor Bonds`}
                    </Typography>
                  {/* </HideOnMobile> */}
                  <ExternalLink
                    href={
                      'https://app.soulswap.finance/seance'
                    }
                    // href={
                    //   'https://ftmscan.com/address/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'
                    // }
                    className="px-2 ring-0 ring-transparent ring-opacity-0"
                    color="purple"
                    startIcon={<LinkIcon size={16} />}
                  >
                    {/* <HideOnMobile> */}
                      <Typography variant="sm" className="hover:underline py-0.5 currentColor">
                        {`Stake`}
                      </Typography>
                    {/* </HideOnMobile> */}
                  </ExternalLink>
                </ExternalLink>
              </div>
            </div>
            <div className="flex items-center text-primary text-bold">
              <div className="span-full">
                <div className="text-primary text-base text-secondary text-xl">{`${luxPrice}`}</div>
                <div className="text-primary text-base text-secondary text-xl">{`${soulPrice}`}</div>
                {/* <div className="flex items-center text-primary text-bold">
              <div className="text-primary text-base text-secondary text-2xl">{`${luxPrice}`}</div>
              </div>
                  <div className="text-primary text-base text-secondary text-2xl">{`${soulPrice}`}</div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Typography weight={700}>{`Supply & Market Cap`}</Typography>
        </div>
      </div>
      <div className="flex flex-col flex-nowrap gap-1 -m-1">
        {getSummaryLine(
          <div className="flex items-center">
            <Typography variant="sm" className="flex items-center py-0.5">
              {`Circulating Supply`}
            </Typography>
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2 py-1 px-3 w-full">
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      Total Supply
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      {formatNumberScale(tokenInfo.totalSupply, false, 2)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      DAO Treasury
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      - {formatNumberScale(Number(tokenInfo.totalSupply) * 0.125, false, 2)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      Total Staked
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      - {formatNumberScale(seanceInfo.totalSupply, false, 2)}
                    </Typography>
                  </div>
                  <hr></hr>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      Circulating
                    </Typography>
                    <Typography variant="sm" className="flex items-center font-bold py-0.5">
                      {formatNumberScale(
                        Number(tokenInfo.totalSupply)
                        - Number(seanceInfo.totalSupply)
                        - (Number(tokenInfo.totalSupply) * 0.125)
                        , false, 2)}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>,
          formatNumberScale(
            Number(tokenInfo.totalSupply)
            - Number(seanceInfo.totalSupply)
            - (Number(tokenInfo.totalSupply) * 0.125)
            , false, 2)
        )}
        {getSummaryLine(
          <Typography variant="sm" className="flex items-center py-0.5">
            {`Total Market Cap`}
          </Typography>,
          formatCurrency(
            Number(tokenInfo.totalSupply) * Number(rawSoulPrice) / 1E18, 2)
        )}
      </div>
    </Modal>
  )
}


