import { ChainId, Currency, Percent } from '../../sdk'
import React, { FC, useState } from 'react'

// import Gas from '../../components/Gas'
import MyOrders from '../limit-order/MyOrders'
import NavLink from '../../components/NavLink'
import Settings from '../../components/Settings'
import { currencyId } from '../../functions'
// import { t } from '@lingui/macro'
import { useActiveWeb3React } from 'services/web3'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
// import Image from '../../components/Image'
// import BRIDGE from 'assets/icons/bridge.svg'
// import SWAP from 'assets/icons/exchange.svg'
// import ADD from 'assets/icons/positive.svg'
// import CHART from 'assets/icons/profits.svg'

const getQuery = (input, output) => {
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || 'FTM' }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface ExchangeHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({ input, output, allowedSlippage }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const [animateWallet, setAnimateWallet] = useState(false)
  const isRemove = router.asPath.startsWith('/remove')
  const isLimitOrder = router.asPath.startsWith('/limit-order')

  return (
    <div className="flex justify-between mb-3 space-y-2 space-x-2 items-center">
        <div className="flex mt-2 mb-1">
      <div className="flex rounded p-0 bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={{
            pathname: '/swap',
            query: getQuery(input, output),
          }}
        >
          <a className="flex px-4 py-6 items-center justify-center font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
          SWAP  
          {/* <Image src={ SWAP } height="42px" width="42px" alt="swap icon" /> */}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={`/${!isRemove ? 'add' : 'remove'}${input ? `/${currencyId(input)}` : '/FTM'}${output ? `/${currencyId(output)}` : '/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'
            }`}
        >
          <a className="flex px-4 py-6 items-center justify-center font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
          + / -
          {/* <Image src={ ADD } height="42px" width="42px" alt="add icon" /> */}
          </a>
        </NavLink>
        
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={'/charts'}
        >
          <a className="flex px-4 py-6 items-center justify-center font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
          CHART
          {/* <Image src={ CHART } height="42px" width="42px" alt="chart icon" /> */}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={'/bridge'}
        >
          <a className="flex px-4 py-6 items-center justify-center font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
            BRIDGE
          {/* <Image src={ BRIDGE } height="42px" width="42px" alt="chart icon" /> */}
          </a>
        </NavLink>
      </div>
      </div>

      <div className="flex items-center">
        <div className="grid grid-flow-col gap-1">
          {isLimitOrder && (
            <div className="items-center h-full w-full cursor-pointer hover:bg-dark-800 rounded px-3 py-1.5">
              <MyOrders />
            </div>
          )}
          {/* {chainId === ChainId.ETHEREUM && (
            <div className="items-center hidden w-full h-full px-3 space-x-3 rounded cursor-pointer text-green text-opacity-80 hover:text-opacity-100 md:flex hover:bg-dark-800">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z"
                  fill="#7CFF6B"
                />
              </svg>
              <div className="hidden md:block text-baseline">
                <Gas />
              </div>
            </div>
          )} */}
        
          <div className="relative flex justify-right w-full h-full rounded hover:bg-dark-800">
            <Settings placeholderSlippage={allowedSlippage} />
          </div>
        
        </div>
        
      </div>
    </div>
  )
}

export default ExchangeHeader