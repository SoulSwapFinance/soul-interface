import { Disclosure, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { Fragment } from 'react'
import { XCircle } from 'react-feather'

import NavLink from 'components/NavLink'
import Typography from 'components/Typography'
import { PairType } from '../enum'
import { useCurrency } from 'hooks/Tokens'
import { Token } from 'sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from 'ethers/lib/utils'

const InformationDisclosure = ({ farm }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  let token0 = useCurrency(farm.pair.token0?.id)
  let token1 = useCurrency(farm.pair.token1?.id)

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    farm.pair.token1 ? 18 : farm.pair.token0 ? farm.pair.token0.decimals : 18,
    farm.pair.token1 ? farm.pair.symbol : farm.pair.token0.symbol,
    farm.pair.token1 ? farm.pair.name : farm.pair.token0.name
  )

  return (
    <Disclosure>
      {({ open }) => (
        <>
          {!open && (
            <Disclosure.Button className="self-start p-2 mt-5 rounded-r-lg sm:mt-3 sm:p-4 sm:pl-6 bg-dark-700">
              <QuestionMarkCircleIcon width={20} height={20} />
            </Disclosure.Button>
          )}
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-in duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
          >
            <Disclosure.Panel
              static
              className="flex flex-col w-1/2 min-w-full p-6 space-y-8 rounded rounded-t-none rounded-r-none sm:min-w-min bg-dark-700"
            >
              <div className="flex items-center justify-between">
                <Typography className="text-xl cursor-pointer">{i18n._(t`How to Participate`)}</Typography>
                <Disclosure.Button>
                  <XCircle width={20} height={30} />
                </Disclosure.Button>
              </div>
              <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-900 opacity-20" />
              <div className="flex flex-col space-y-2 md:pr-6">
                <Typography variant="sm" weight={700}>
                  {i18n._(t`Step One`)}
                </Typography>
                  <>
                    <Typography variant="sm">
                      {i18n._(t`Provide liquidity to the`)}
                      
                      {` `}
                      <NavLink href={`/add/${token0?.address}/${token1?.address}`}>
                        <a className="text-sm text-purple">
                          {token0?.symbol}/{token1?.symbol}
                        </a>
                      </NavLink>
                      {/* {` `}
                      {i18n._(t`pool (or`)}
                      {` `}
                      <NavLink href={`/migrate`}>
                        <a className="text-sm text-blue">migrate liquidity</a>
                      </NavLink> */}
                      {i18n._(t`) to receive SLP tokens.`)} 
                    </Typography>
                  </>
              </div>
              <div className="flex flex-col space-y-2 md:pr-6">
                <Typography variant="sm" weight={700}>
                  {i18n._(t`Step Two`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(t`Approve and then deposit your`)}
                  {` `}
                  {`SLP`}
                  {` `}
                  {i18n._(t`tokens into the farm to start earning rewards.`)}
                </Typography>
              </div>
              <div className="flex flex-col space-y-2 md:pr-6">
                <Typography variant="sm" weight={700}>
                  {i18n._(t`Step Three`)}
                </Typography>
                  <Typography variant="sm">
                    {i18n._(
                      t`Harvest rewards and unstake your LP tokens at any time. You can then remove your liquidity to receive your base investment tokens back in your wallet.`
                    )}
                  </Typography>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

export default InformationDisclosure
