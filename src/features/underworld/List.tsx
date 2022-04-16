import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import { Underworld, Farms } from './Key'
import { Row } from './Row'
import { FarmMarkets, UnderworldMarkets } from './Markets'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@heroicons/react/outline'
// import Header from 'components/Header'

export const List = () => {
  // const { chainId } = useActiveWeb3React()

  
  const underworldList = UnderworldMarkets.map((market) => (
    <Row
    key={market.pid}
    pid={market.pid}
    lpToken={market.lpAddresses[250]}
    farm={market}
    />
    ))
    
    const farmList = FarmMarkets.map((farm) => (
      <Row
        key={farm.pid}
        pid={farm.pid}
        lpToken={farm.lpAddresses[250]}
        farm={farm}
      />
    ))

  return (
    <>
      <div className="flex justify-end px-4">
        <Button>
          <NavLink href="/seance">
            <a className="flex items-center space-x-2 font-medium text-center text-dark-600 cursor-pointer text-base hover:text-high-emphesis">
              <span>Stake</span>
             <ArrowRightIcon width={18} height={18} className="text-dark-600 hover:text-white" />
            </a>
          </NavLink>
        </Button>
      </div>
      <Typography className="text-2xl mb-12 mt-6 border border-blue p-3 hover:border-dark-600 font-bold text-center">
        Lending Pools
      </Typography>
        <Underworld />
        <>{underworldList}</>
     <Typography className="text-2xl mb-12 mt-6 border border-dark-600 hover:border-blue p-3 font-bold text-center">
       Farming Pools
      </Typography>
        <Farms />
        <>{farmList}</>
    </>
  )
}

export default List