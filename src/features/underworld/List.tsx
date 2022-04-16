import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import { Underworld } from './Key'
import { Row } from './Row'
import { UnderworldMarkets } from './Markets'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@heroicons/react/outline'
// import Header from 'components/Header'

export const List = () => {
  
  const lendList = UnderworldMarkets.map((market) => (
    <Row
    key={market.id}
    lpToken={market.lpAddress}
    // assetAddress={market.assetAddress}
    farm={market}
    />
    ))
    
    // const borrowList = UnderworldMarkets.map((farm) => (
    //   <Row
    //     key={farm.pid}
    //     pid={farm.pid}
    //     lpToken={farm.lpAddress}
    //     // assetAddress={farm.assetAddress}
    //     farm={farm}
    //   />
    // ))

  return (
    <>
      <div className="flex justify-end px-4">
        <Button>
          <NavLink href="/summoner">
            <a className="flex items-center space-x-2 font-medium text-center text-dark-600 cursor-pointer text-base hover:text-high-emphesis">
              <span>Farm</span>
             <ArrowRightIcon width={18} height={18} className="text-dark-600 hover:text-white" />
            </a>
          </NavLink>
        </Button>
      </div>
      <Typography className="text-2xl mb-12 mt-6 border border-blue p-3 hover:border-dark-600 font-bold text-center">
        Lending Markets
      </Typography>
        <Underworld />
        <>{lendList}</>
     {/* <Typography className="text-2xl mb-12 mt-6 border border-dark-600 hover:border-blue p-3 font-bold text-center">
       Borrow Markets
      </Typography>
        <Farms />
        <>{borrowList}</> */}
    </>
  )
}

export default List