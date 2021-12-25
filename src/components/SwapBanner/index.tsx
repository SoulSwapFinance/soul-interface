import { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'

const SwapBanner: FC = () => (
  <div className="relative w-full bg-purple bg-opacity-10">
    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pr-16 sm:text-center sm:px-16">
        <p className="font-medium text-white">
          <span className="centered md:hidden">Grim Withdrawals - Now Available. 
          {/* <br/> Use Filter: Retired Vaults */}
                    </span>
                    <br/>
          <a href="https://app.grim.finance/" target = "_blank" rel="noreferrer"
              className="font-bold text-white underline">
              {' '}
              <br />
              Click Here to Withdraw<span aria-hidden="true">
            </a>
            </span>
          <span className="hidden md:inline"> Grim Withdrawals - Now Available.
          {/* <br/> Use Filter: Retired Vaults */}
          </span>
          <br/>
          <span className="hidden block sm:ml-2 md:inline-block">
            <a href="https://app.grim.finance/" target = "_blank" rel="noreferrer"
              className="font-bold text-white underline">
              {' '}
              {/* <br /> */}
              Click Here to Withdraw<span aria-hidden="true"></span>
            </a>
          </span>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
        {/*
        <button type="button" className="flex p-2 focus:outline-none">
           <span className="sr-only">Dismiss</span> 
           */}
           
          {/* <XIcon className="w-6 h-6 text-white" aria-hidden="true" /> */}
        {/* </button> */}
      </div>
    </div>
  </div>
)

export default SwapBanner
