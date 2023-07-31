import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import Card from '../../components/Card'
import Typography from '../../components/Typography'
import NavLink from '../../components/NavLink'
import { formatNumberScale } from '../../functions'
import Image from '../../components/Image'
import Search from '../../components/Search'
import { LAUNCHPAD_PROJECTS, PROJECT_STATUS } from '../../constants/launchpad'
import { SoulLaunchpad } from '../../features/launchpad/SoulLaunchpad'
import { useBlockNumber } from 'state/application/hooks'
import { useTimestampFromBlock } from 'hooks/useTimestampFromBlock'

import { useFuse } from '../../hooks'
import Link from 'next/link'

export default function Launchpad(): JSX.Element {
  const router = useRouter()
  const blockNumber = useBlockNumber()
  const blockTime = useTimestampFromBlock(blockNumber)

  const filter = router.query['filter'] || 'live'

  const projects = Object.keys(LAUNCHPAD_PROJECTS)
    .map((key) => {
      const p = LAUNCHPAD_PROJECTS[key]
      return {
        id: key,
        ...p,
        status:
          blockTime >= p.startTime && blockTime < p.endTime
            ? PROJECT_STATUS.LIVE
            : blockTime >= p.endTime
            ? PROJECT_STATUS.COMPLETED
            : PROJECT_STATUS.UPCOMING,
      }
    })
    .filter((r) => r.status == filter)

  const options = {
    keys: ['name', 'symbol', 'tokenContract'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data: projects,
    options,
  })

  return (
    <>
      <Head>
        <title>Launchpad | SoulSwap</title>
        <meta key="description" name="description" content="Launchpad" />
      </Head>

      <SoulLaunchpad />

      <div className="container mx-auto pb-6 -mt-48 ">
        <div className="relative w-full">
          <div className={`grid grid-cols-12 gap-2 min-h-1/2 `}>
            <div className={`col-span-12`}>
              <div className={'container p-6 md:p-0 justify-center flex flex-col mb-5 md:mb-10'}>
                <Typography variant="hero" className={'font-bold sm:mt-5 text-white'}>
                  Launchpad
                </Typography>
                <Typography variant="base" className={'max-w-xl text-gray-400'}>
                  Be the first to join our Launchpad, a launchpad built for cross-chain token pools and auctions, enabling
                  projects to raise capital on a decentralized and interoperable environment based on Fantom Opera.
                </Typography>
                <br />
                <Typography variant="base" className={'max-w-xl text-gray-400'}>
                  Interested in launching with us?
                  <br />
                  <Link
                    href="https://forms.gle/oDFKZAvC8jRbAfw29"
                    target="_blank"
                    rel="noreferrer"
                    className={
                      'underline font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-purple to-purple mt-2'
                    }
                  >
                   {">> Click Here to Launch <<"}
                  </Link>
                </Typography>
              </div>

              <Card className="bg-dark-900 z-4 rounded ">
                <div className={`flex md:flex-row flex-col space-y-4 md:space-x-8 md:space-y-0`}>
                  <div className={'col-span-5 p-2.5 rounded flex bg-dark-700 flex-col md:flex-row md:space-x-2'}>
                    <NavLink
                      exact
                      href={'/launchpad'}
                      activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
                    >
                      <div className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                        Live
                      </div>
                    </NavLink>
                    <NavLink
                      legacyBehavior={true}
                      exact
                      href={'/launchpad?filter=upcoming'}
                      activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
                    >
                      <div className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                        Upcoming
                      </div>
                    </NavLink>
                    <NavLink
                      legacyBehavior={true}
                      exact
                      href={'/launchpad?filter=completed'}
                      activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
                    >
                      <div className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                        Completed
                      </div>
                    </NavLink>
                  </div>
                  <div className={'flex flex-1 p-2 rounded flex bg-dark-700 flex-col md:flex-row md:space-x-2'}>
                    <Search
                      className={'bg-dark-700 rounded'}
                      placeholder={'Search by name, symbol or address'}
                      term={term}
                      search={(value: string): void => {
                        search(value)
                      }}
                    />
                  </div>
                </div>
                <div className="mt-12 min-h-[400px]">
                  {result.length == 0 && (
                    <>
                      <Typography variant="base" className={'max-w-xl m-auto text-center mb-2 text-gray-400'}>
                        No Data
                      </Typography>
                    </>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {result.map((p, i) => (
                      <div
                        key={i}
                        onClick={() => router.push('/launchpad/project/' + p.id)}
                        className={
                          'w-full text-left rounded cursor-pointer select-none bg-dark-800  text-primary text-sm md:text-lg'
                        }
                      >
                        <div>
                          <video
                            className={'rounded rounded-b-none'}
                            src={p.teaser}
                            autoPlay
                            loop
                            muted
                            controls={false}
                          />
                        </div>
                        <div className="px-4 py-6 -mt-24">
                          <div className="grid grid-cols-1 space-y-4">
                            <div className="flex">
                              <div className={`flex flex-row justify-center items-center`}>
                                <Image
                                  src={p.logo}
                                  width={60}
                                  height={60}
                                  className="rounded-full bg-white"
                                  layout="fixed"
                                  alt={p.name}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <Typography variant="h3" className="font-bold  mt-2">
                                {p.name}
                              </Typography>
                              <Typography variant="base"> {p.symbol}</Typography>
                            </div>
                            <div className={`flex flex-row space-x-10`}>
                              <div className="flex flex-col">
                                <Typography variant="base">Total Raise</Typography>
                                <Typography variant="lg" className="font-bold text-right">
                                  {formatNumberScale(p.raise, true)}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <Typography variant="base">
                                {p.status == PROJECT_STATUS.UPCOMING
                                  ? 'Starts On'
                                  : p.status == PROJECT_STATUS.COMPLETED
                                  ? 'Ended'
                                  : 'Live Until'}
                              </Typography>
                              <Typography variant="lg" className="font-bold">
                                {p.status == PROJECT_STATUS.UPCOMING
                                  ? `Block ${p.startTime}`
                                  : p.status == PROJECT_STATUS.COMPLETED
                                  ? `Block ${p.endTime}`
                                  : `Block ${p.endTime}`}
                              </Typography>
                              <Typography variant="xs" className="">
                                {p.status == PROJECT_STATUS.UPCOMING
                                  ? `≈ ${p.startsOn}`
                                  : p.status == PROJECT_STATUS.COMPLETED
                                  ? `≈ ${p.endsOn}`
                                  : `≈ ${p.endsOn}`}
                              </Typography>
                            </div>
                            <div className="flex sm:flex-row space-x-3">
                              <Link
                                href={p.website}
                                target="_blank"
                                rel="noreferrer"
                                className={
                                  'hover:underline hover:font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-purple to-purple mt-2'
                                }
                              >
                                Website
                              </Link>
                              <Link
                                href={p.readmore}
                                target="_blank"
                                rel="noreferrer"
                                className={
                                  'hover:underline hover:font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-purple to-purple mt-2'
                                }
                              >
                                Announcement
                              </Link>
                              <Link
                                href={p.docs}
                                target="_blank"
                                rel="noreferrer"
                                className={
                                  'hover:underline hover:font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-purple to-purple mt-2'
                                }
                              >
                                Docs
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
