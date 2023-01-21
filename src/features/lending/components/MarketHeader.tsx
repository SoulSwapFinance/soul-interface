import React from 'react'
import { Search } from 'react-feather'

import Card from 'components/Card'
import { classNames } from 'functions'
import { useActiveWeb3React } from 'hooks'
import { getChainColor } from 'constants/chains'

function MarketHeader({ type = 'Borrow', lists }: any) {
  const { chainId } = useActiveWeb3React()
  if (lists.setTerm) {
    lists = [lists]
  }

  function onSearch(term: any) {
    lists.forEach((list: any) => {
      list.setTerm(term)
    })
  }

  return (
    <Card.Header
      className={classNames('border-b-8', type === 'Borrow' ? 'bg-dark-purple border-purple' : 'bg-dark-blue border-blue')}
    >
      <div className="flex flex-col items-center justify-between w-full">
        <div className={`flex justify-center border border-2 border-[${getChainColor(chainId)}] bg-dark-900 rounded-2xl p-3 mt-6 md:mt-0`}>
          <div className="text-3xl text-high-emphesis">{type}</div>
        </div>

        <div className="flex justify-end w-full py-4 md:py-0">
          {/* <div className="relative w-full max-w-md">
            <input
              className={`py-3 pl-4 pr-14 rounded w-full focus:outline-none focus:ring ${
                type === 'Borrow' ? 'focus:ring-purple' : 'focus:ring-blue'
              }`}
              onChange={(e) => onSearch(e.target.value)}
              style={{ background: '#161522' }}
              value={lists[0].term}
              placeholder="Search by symbol"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
              <Search size={16} />
            </div>
          </div> */}
        </div>
      </div>
    </Card.Header>
  )
}

export default MarketHeader