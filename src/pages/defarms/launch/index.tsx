import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import { useManifesterContract } from 'hooks'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import NavLink from 'components/NavLink'
import Card from 'components/Card'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { useTransactionAdder } from 'state/transactions/hooks'
import { Disclosure } from '@headlessui/react'
// import moment from 'moment'
import { Button } from 'components/Button'
// import { useManifestationInfo } from 'hooks/useAPI'
import useDefarm from 'features/defarms/useDefarm'
// import { useActiveWeb3React } from 'services/web3'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Manifestations(): JSX.Element {
    const router = useRouter()
    // const { account, chainId } = useActiveWeb3React()
    // const [id, setID] = useState(0)
    // const [idSelected, selectID] = useState(false)
    // const [delayDays, setDelayDays] = useState(0)
    // const [delayDaysSet, selectDelayDays] = useState(false)
    const [defarms, setDefarm] = useState([])
    // const token = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
    const [pendingTx, setPendingTx] = useState(false)
    const addTransaction = useTransactionAdder()
    // const [manifestations, setManifestations] = useState([])

  const ManifesterContract = useManifesterContract()
  const manifesterContract = useDefarm()

//   function getAddress(id) {
//     const { defarmPoolInfo } = useManifestationInfo(id)
//     const mAddress = defarmPoolInfo.mAddress
//     return mAddress
// }

  // check if user has gone through approval process, used to show two step buttons, reset on token change
//   const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

//   useEffect(() => {
//     if (approvalState === ApprovalState.PENDING) {
//       setApprovalSubmitted(true)
//     }
//   }, [approvalState, approvalSubmitted])

  // useEffect(() => {
  //   // if (idSelected) {
  //   ManifesterContract.getInfo(id).then((r) => {
  //       if (r.length > 0) {
  //           setManifestations(r)
  //           // setManifestations(r.filter((x) => (true)))
  //           console.log({id})
  //       //   setManifestations(r.filter((x) => x.startTime == 0))
  //       }
  //     })
  //   // }
  // }, [id, ManifesterContract])
  useEffect(() => {
      manifesterContract.getDefarmByManifester().then((r) => {
        if (r.length > 0) {
          // only shows those farms which have not yet been launched.
          // setDefarm(r.filter((x) => x.startTime == 0))
          setDefarm(r.filter((x) => x.startTime >= 0))
        }
        // console.log('defarm: %s', r)
      })
    }, [manifesterContract])

//   const handleApprove = useCallback(async () => {
//     await approve()
//   }, [approve])

  const handleLaunch = useCallback(
    async (
        id: string, 
        // delayDays: Number
    ) => {
      setPendingTx(true)

      try {
        // const mAddress = // await ManifesterContract.manifestations(id)
        // console.log({mAddress})
        // const ManifestationContract = useManifestationContract(mAddress)
        const tx = await ManifesterContract.setDelay(id, 0)
        // const tx = await ManifestationContract.setDelay(delayDays.toString())
        addTransaction(tx, {
          summary: `${`Launched DeFarm ${id}`}`,
        })
      } catch (error) {
        console.error(error)
      }
      setPendingTx(false)
    },
    [addTransaction, ManifesterContract]
  )

  return (
    <>
    <Head>
        <title>Launch DeFarm | SoulSwap</title>
          <meta name="description" content="Providing protocols with the opportunity to incentivize their communities to provide liquidity." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="Providing protocols with the opportunity to incentivize their communities to provide liquidity." />
      </Head>
      <div className="container px-0 mx-auto pb-6">
        <div className={`mb-2 pb-4 grid grid-cols-12 gap-4`}>
          <div className="flex justify-center items-center col-span-12 lg:justify">
          </div>
        </div>
        <DoubleGlowShadowV2 maxWidth={false} opacity={'0.3'}>
          <div className={`grid grid-cols-12 gap-2 min-h-1/2`}>
            <div className={`col-span-12 flex flex-row gap-2 md:space-x-2 mt-3 items-center justify-center`}>
              <NavLink
                exact
                href={'/defarms'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
              >
                <Button
                  variant={`outlined`}
                  color={`ftmBlue`}
                >
                <div className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent text-white rounded cursor-pointer">
                  {`View DeFarms`}
                </div>
                </Button>
              </NavLink>
              <NavLink
                exact
                href={'/defarms/create'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
              >
                <Button
                  variant={`outlined`}
                  color={`ftmBlue`}
                >
                <div className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent text-white rounded cursor-pointer">
                  {`Create DeFarm`}
                </div>
                </Button>
              </NavLink>
            </div>
            <div className={`col-span-12`} style={{ minHeight: '35rem' }}>
              <Card className="h-full rounded bg-dark-900">
                {defarms.length == 0 && (
                  <div className="flex justify-center items-center col-span-12 lg:justify mt-20">
                    <span>
                      <NavLink href="/defarms/create">
                        <Button
                          variant={'outlined'}
                          color={'ftmBlue'}
                        >
                          { `Create DeFarm` }
                        </Button>
                      </NavLink>{' '}
                    </span>
                  </div>
                )} 
                {defarms.length > 0 && (
                  <div className="grid grid-cols-5 text-base font-bold text-primary mt-10 mb-2">
                    {/* <div className="flex items-center col-span-2 px-2">
                      <div className="hover:text-high-emphesis">{`Token`}</div>
                    </div> */}
                    <div className="flex items-center ml-3">{`ID`}</div>
                    <div className="flex items-center">{`Logo`}</div>
                    <div className="flex items-center">{`Symbol`}</div>
                    <div className="flex items-center mr-3">{`Address`}</div>
                    <div className="items-center justify-end px-2 flex ">{``}</div>
                  </div>
                )}
                <div className="flex-col">
                  {defarms.map((defarm, index) => {
                    return (
                      <Disclosure key={index}>
                        {() => (
                          <div className="mb-4">
                            <Disclosure.Button
                              className={classNames(
                                'w-full px-4 py-6 text-left rounded select-none bg-dark-700  text-primary text-sm md:text-lg'
                              )}
                            >
                              <div className="grid grid-cols-5">
                                {/* <div className="flex col-span-2 items-center"> */}
                                {/* </div> */}
                                <div className="flex flex-col justify-center">
                                 {index.toString()}
                                </div>
                              <div className="flex col-span items-center">
                                 <Image className={'flex justify-center'} 
                                    src={defarm.logoURI}
                                    width={36}
                                    height={36}
                                    alt={`logo for defarm reward asset`}
                                  />
                              </div>
                                <div className="flex flex-col justify-center">
                                    {defarm?.symbol}
                                </div>
                                <div 
                                  className="flex flex-col justify-center"
                                  onClick={() => router.push('https://ftmscan.com/address/' + defarm.mAddress.toString())}
                                >
                                  { '-' + defarm?.mAddress.substr(length - 5) }
                                  </div>
                                <div className="flex flex-col items-end justify-center">
                                  <div className="text-xs text-right md:text-base text-secondary">
                                    <Button
                                      variant="outlined"
                                      color={ defarm?.startTime > 0 ? `avaxRed` : `ftmBlue` }
                                      style={{ width: '100%' }}
                                      disabled={Number(defarm?.startTime) > 0}
                                      onClick={async () => await handleLaunch(index.toString())}
                                      // disabled={
                                      //   // NOTE: ensure delay days has been selected, otherwise it's start immediately //
                                      //   // delayDaysSet
                                      //   // moment.unix(manifestation?.endTime.toString()).isAfter(new Date())
                                      //   // || !account
                                      //   // || (account && getAddress(account) != getAddress(manifestation?.recipient))
                                      // }
                                    >
                                    <Typography
                                      className={`text-white`}
                                    >
                                      { defarm?.startTime > 0 ? `Launched` : `Launch` }
                                    </Typography> 
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Disclosure.Button>
                          </div>
                        )}
                      </Disclosure>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        </DoubleGlowShadowV2>
      </div>
    </>
  )
}
