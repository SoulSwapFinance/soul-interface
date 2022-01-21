import { getAddress } from '@ethersproject/address'
import { Disclosure, Transition } from '@headlessui/react'
import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token, ZERO } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import React, { useState } from 'react'

import { PairType } from './enum'
import { useUserInfo } from './hooks'
import InformationDisclosure from './components/InformationDisclosure'
import InvestmentDetails from './components/InvestmentDetails'
import ManageBar from './utils/ManageBar'
import ManageSwapPair from './utils/ManageSwapPair'

const MineListItemDetails = ({ farm }) => {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    18, // always 18 for SOUL-LP
    farm.pair.token1 ? farm.pair.symbol : farm.pair.token0.symbol,
    farm.pair.token1 ? farm.pair.name : farm.pair.token0.name
  )

  const stakedAmount = useUserInfo(farm, liquidityToken)
  const [toggleView, setToggleView] = useState(stakedAmount?.greaterThan(ZERO))

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Disclosure.Panel className="flex w-full border-t-0 rounded rounded-t-none bg-dark-800" static>
        <InformationDisclosure farm={farm} />
        <div className="flex flex-col w-full p-6 pl-2 space-y-8 sm:pl-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold cursor-pointer">
              {toggleView ? i18n._(t`Investment Details`) : i18n._(t`Manage Position`)}
            </div>
            <button
              className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-purple-dark-800 whitespace-nowrap"
              onClick={() => setToggleView(!toggleView)}
            >
              {toggleView ? i18n._(t`Manage Position`) : i18n._(t`Investment Details`)}
            </button>
          </div>
          <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-purple-dark-800 opacity-20" />
          {toggleView ? (
            <InvestmentDetails farm={farm} />
            ) : (
              <Tab.Group>

              <Tab.List className="flex rounded bg-dark-900">
              { farm.pair?.token1 ?
                  <Tab
                    className={({ selected }) =>
                    `${selected
                      ? 'text-high-emphesis bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple'
                      : 'text-secondary'
                    } flex items-center justify-center flex-1 px-2 py-2 text-lg rounded cursor-pointer select-none`
                  }
                  >
                    {i18n._(t`Manage Liquidity`)}
                  </Tab>
                  : '' }
                  <Tab
                    className={({ selected }) =>
                      `${selected
                        ? 'text-high-emphesis bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple'
                        : 'text-secondary'
                      } flex items-center justify-center flex-1 px-2 py-2 text-lg rounded cursor-pointer select-none`
                    }
                  >
                    {i18n._(t`Manage Farms`)}
                  </Tab>
              </Tab.List>
              { farm.pair?.token1 ?
              <Tab.Panel>
                <ManageSwapPair farm={farm} />
              </Tab.Panel>
              : '' }
              <Tab.Panel>
                <ManageBar farm={farm} />
              </Tab.Panel>
            </Tab.Group>
          )}
        </div>
      </Disclosure.Panel>
    </Transition>
  )
}

export default MineListItemDetails
