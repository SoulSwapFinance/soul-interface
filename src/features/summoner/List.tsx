import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import { Active } from './Key'
import { ActiveRow } from './Row'
import { ActivePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'

export const FarmList = () => {
  // const { chainId } = useActiveWeb3React()

  const farmList = ActivePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      lpToken={farm.lpAddresses[250]}
      farm={farm}
    />
  ))

  return (
    <>
          <Button>
          <NavLink href="/mines?filter=inactive">
            <a className="flex items-center space-x-2 font-medium text-center text-dark-600 cursor-pointer text-base hover:text-high-emphesis">
             <ArrowLeftIcon width={18} height={18} className="text-dark-600" />
              <span>Retired Farms</span>
            </a>
          </NavLink>
        </Button>
      <Active />
      <>{farmList}</>
    </>
  )
}

export default FarmList