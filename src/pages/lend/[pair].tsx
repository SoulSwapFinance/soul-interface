import { Tab } from '@headlessui/react'
import Card from 'components/Card'
import Image from 'components/Image'
// import QuestionHelper from 'components/QuestionHelper'
import { Feature } from 'enums'
import { Deposit, PairTools, Strategy, Withdraw } from 'features/lending'
import { useUnderworldPairInfo } from 'hooks/useAPI'
import { formatNumber, formatPercent } from 'functions/format'
import { e10 } from 'functions/math'
import NetworkGuard from 'guards/Network'
import { useRedirectOnChainId } from 'hooks/useRedirectOnChainId'
import Layout from 'layouts/Underworld'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { RecoilRoot } from 'recoil'
import { useUnderworldPair } from 'features/lending/hooks'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
// import { useSingleCallResult } from 'state/multicall/hooks'

export default function Pair() {
  useRedirectOnChainId('/lend')

  const router = useRouter()
  // const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const pair = useUnderworldPair(router.query.pair as string)
  const { underworldPairInfo } = useUnderworldPairInfo(router.query.pair)

  /*
  const { underworldPairInfo } = useUnderworldPairInfo(pair?.address)
  const assetDecimals = Number(underworldPairInfo.assetDecimals)
  const assetSymbol = underworldPairInfo.assetTicker
  const oracle = underworldPairInfo.oracle
  const assetURL = underworldPairInfo.assetLogoURI
  const collateralURL = underworldPairInfo.collateralLogoURI
  */
 
if (!pair) return <div />
const assetDecimals = Number(underworldPairInfo.assetDecimals)
// const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
const assetPrice = Number(underworldPairInfo.assetPrice)
// const collateralPrice = Number(underworldPairInfo.collateralPrice)
// const lpDecimals = Number(underworldPairInfo.decimals)
// const assetAddress = underworldPairInfo.assetAddress

// format tickers //
const aTicker = underworldPairInfo.assetTicker
const bTicker = underworldPairInfo.collateralTicker

const assetSymbol 
    = aTicker == 'WAVAX' ? 'AVAX'
      : aTicker == 'WFTM' ? 'FTM'
        : aTicker == 'WETH.e' ? 'ETH'
        : aTicker == 'WBTC.e' ? 'BTC'
        : aTicker

const collateralSymbol 
    = bTicker == 'WAVAX' ? 'AVAX'
      : bTicker == 'WFTM' ? 'FTM'
        : bTicker == 'WETH.e' ? 'ETH'
        : bTicker == 'WBTC.e' ? 'BTC'
        : bTicker
  // const assetSymbol = pair?.asset.tokenInfo.symbol
  // const collateralSymbol = pair?.collateral.tokenInfo.symbol
  // const assetDecimals = pair?.asset.tokenInfo.decimals
  const assetAddress = pair?.asset.tokenInfo.address
  const collateralAddress = pair?.collateral.tokenInfo.address
  // const oracle = pair?.oracle.address
  // const assetDecimals = Number(underworldPairInfo.assetDecimals)
  // const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  // const assetPrice = Number(underworldPairInfo.assetPrice)
  // const collateralPrice = Number(underworldPairInfo.collateralPrice)
  // const totalAssets = Number(underworldPairInfo.supply)
  // const assetPrice = pair?.asset.usd / 1e18
  const userDepositAmount = pair?.userAssetFraction / 10**(assetDecimals)
  const userDepositValue = userDepositAmount * assetPrice
  const blockchain = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
  const assetURL = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${blockchain}/assets/${assetAddress}/logo.png`
  //pair?.asset.tokenInfo.logoURI
  const collateralURL = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${blockchain}/assets/${collateralAddress}/logo.png`

  return (
    <PairLayout>
      <Head>
              <title>Lend {pair.asset.tokenInfo.symbol} | Soul</title>
        <meta key="description" name="description" content={`Lend ${pair.asset.tokenInfo.symbol} in the Underworld`} />
        <meta key="og:description" property="og:description" content={`Lend ${pair.asset.tokenInfo.symbol} in the Underworld`} />
      </Head>
      <Card
        className="bg-dark-900"
        header={
          <Card.Header className="border-b-8 bg-dark-blue border-blue">
            <div className="flex items-center">
              <div className="flex items-center mr-4 space-x-2">
                {pair && (
                  <>
                    <Image
                      height={48}
                      width={48}
                      src={assetURL}
                      className="w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={assetSymbol}
                    />
                    <Image
                      height={48}
                      width={48}
                      src={collateralURL}
                      className="w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={collateralSymbol}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-high-emphesis">
                    {`Lend`} {pair && assetSymbol}
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 text-sm text-secondary">{`Collateral`}:</div>
                    <div className="mr-2 text-sm text-high-emphesis">{pair && collateralSymbol}</div>
                    {/* <div className="mr-1 text-sm text-secondary">{`Oracle`}:</div> */}
                    {/* <div className="text-sm text-high-emphesis">{pair && oracle}</div> */}
                  </div>
                </div>
              </div>
            </div>
          </Card.Header>
        }
      >
        <div className="flex justify-between p-4 mb-8 xl:p-0">
          <div>
            <div className="text-center text-md sm:text-lg text-secondary">Deposited</div>
            <div className="text-lg sm:text-2xl text-blue">
              {formatNumber(pair.userAssetFraction / 10**(assetDecimals))} {assetSymbol}
            </div>
            <div className="text-center text-md sm:text-lg text-high-emphesis">{formatNumber(userDepositValue, true)}</div>
            </div>
          <div>
            <div className="text-center text-md sm:text-lg text-secondary">{`Utilization`}</div>
            <div className="text-center text-lg sm:text-2xl text-high-emphesis">{
                formatPercent(
                  ((pair?.userAssetFraction.div(e10(assetDecimals))) -
                    (pair?.userAssetFraction.sub(pair?.currentUserLentAmount.value).div(e10(assetDecimals))))
                  / (pair?.userAssetFraction.div(e10(assetDecimals))) * 100
                )
              }</div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-center text-md sm:text-lg text-secondary">{`APR`}</div>
              <div className="text-center text-lg sm:text-2xl text-high-emphesis">
                {/* {formatPercent(pair.supplyAPR.string)} */}
                {formatPercent(pair.currentSupplyAPR.stringWithStrategy)}
                </div>
              {/* <div className="text-center text-lg sm:text-2xl text-high-emphesis">{formatPercent(pair.supplyAPR.string)}</div> */}
            </div>
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="flex p-1 rounded bg-dark-800">
            <Tab
              className={({ selected }) =>
                `${selected ? 'bg-blue text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-1 py-1 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none`
              }
            >
              {`Deposit`} {assetSymbol}
            </Tab>
            <Tab
              className={({ selected }) =>
                `${selected ? 'bg-blue text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-1 py-1 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none`
              }
            >
              {`Withdraw`} {assetSymbol}
            </Tab>
          </Tab.List>
          <Tab.Panel>
            <Deposit pair={pair} />
          </Tab.Panel>
          <Tab.Panel>
            <Withdraw pair={pair} />
          </Tab.Panel>
        </Tab.Group>
      </Card>
    </PairLayout>
  )
}

Pair.Provider = RecoilRoot

const PairLayout = ({ children }) => {
  const router = useRouter()
  // const { i18n } = useLingui()
  const pair = useUnderworldPair(router.query.pair as string)

  // const lpDecimals = Number(underworldPairInfo.decimals)
  // const assetAddress = underworldPairInfo.assetAddress
  

  

  // const oracle = underworldPairInfo.oracle
  // const interestPerSecond = underworldPairInfo.interestPerSecond
  // const interestPerYear = Number(interestPerSecond) * 86_400 * 365 / 1e18
  
  const oracle = pair?.oracle.name
  
  const assetDecimals = pair?.asset.tokenInfo.decimals
  const aTicker = pair?.asset.tokenInfo.symbol
  const cTicker = pair?.collateral.tokenInfo.symbol

  const assetSymbol 
      = aTicker == 'WAVAX' ? 'AVAX'
          : aTicker == 'WETH.e' ? 'ETH'
          : aTicker == 'WBTC.e' ? 'BTC'
          : aTicker

  const collateralSymbol 
      = cTicker == 'WAVAX' ? 'AVAX'
          : cTicker == 'WETH.e' ? 'ETH'
          : cTicker == 'WBTC.e' ? 'BTC'
          : cTicker

  const interestPerYear = pair?.interestPerYear.string
  console.log('interestPerYear:%s', interestPerYear)

  return pair ? (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/underworld/deposit.png"
          title={`Lend assets for interest from borrowers.`}
          description={
            `Have assets you want to earn additional interest on? Lend them in isolated markets and earn interest from borrowers.`
          }
        />
      }
      right={
        <Card className="h-full p-4 bg-dark-900 xl:p-0">
          <div className="flex-col space-y-2">
          <div className="flex justify-between">
              <div className="text-xl text-high-emphesis">{`Market`}</div>
            </div>
            {/* <div className="flex justify-between">
              <div className="text-lg text-secondary">{`% APR`}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formatPercent(interestPerYear)}</div>
              </div>
            </div> */}
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`% LTV`}</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Total Assets`}</div>
              <div className="text-lg text-high-emphesis">
              </div>
              {/* {formatNumber(pair?.totalAsset.base.div(e10(assetDecimals)))} {assetSymbol} */}
              {formatNumber(pair?.totalAsset.base / 10**(assetDecimals))} {assetSymbol}
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Oracle`}</div>
              <div className="text-lg text-high-emphesis">
              </div>
              {/* {formatNumber(pair?.totalAsset.base.div(e10(assetDecimals)))} {assetSymbol} */}
              { oracle }
            </div>
            <div className="flex justify-between">
              <div className="text-green text-lg text-secondary">{`Available`}</div>
              <div className="flex items-center">
                <div className="text-green text-lg text-high-emphesis">
                {formatPercent(100-
                ((pair?.totalAsset.base / 10**(assetDecimals)) -
                  (pair?.totalAsset.base.sub(pair?.totalBorrow.base) / 10**(assetDecimals)))
                  / (pair?.totalAsset.base / 10**(assetDecimals)) * 100
                )}</div>
              </div>
            </div>
            {/* <div className="flex justify-between">
              <div className="text-lg text-secondary">{`Borrowed`}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis"> */}
                  {/* AVAILABLE - TOTAL / TOTAL * 100 */}
                {/* {formatPercent(
                ((pair?.totalAsset.base.div(e10(assetDecimals))) -
                  (pair?.totalAsset.base.sub(pair?.totalBorrow.base).div(e10(assetDecimals))))
                  / (pair?.totalAsset.base.div(e10(assetDecimals))) * 100
                )}</div>
              </div>
            </div> */}

            <div className="flex justify-between">
              <div className="text-xl mt-4 text-high-emphesis">{``}</div>
            </div>
            <PairTools pair={pair} />

            {/* <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{`CoffinBox`}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{`${assetSymbol} Strategy`}</div>
              <div className="flex flex-row text-lg text-high-emphesis">
                {pair.asset.strategy ? (
                  `Active`
                ) : (
                  <>
                    {`None`}
                    <QuestionHelper
                      text={
                        `CoffinBox strategies can create yield for your liquidity while it is not lent out. This token does not yet have a strategy in the CoffinBox.`
                      }
                    />{' '}
                  </>
                )}
              </div>
            </div> */}

            <Strategy token={pair.asset} />
          </div>
        </Card>
      }
    >
      {children}
    </Layout>
  ) : null
}

// Pair.Layout = PairLayout

Pair.Guard = NetworkGuard(Feature.UNDERWORLD)