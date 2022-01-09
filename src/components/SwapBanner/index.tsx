import React, { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'
import NavLink from 'components/NavLink'

const SwapBanner: FC = () => (
  <div className="relative w-full bg-purple bg-opacity-10">
    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pr-16 sm:text-center sm:px-16">
        <p className="font-medium text-white">
          <span className="centered md:hidden">Harvest Claims - Now Available. 
                    </span>
          <span className="hidden md:inline">Harvest Claims - Now Available.
          </span>
          <br/>
          <span className="block sm:ml-2 md:inline-block">
            <NavLink src="/claims" target = "_blank" rel="noreferrer"
              className="font-bold text-white underline">
              {' '}
              Click Here to Claim<span aria-hidden="true"></span>
            </NavLink>
          </span>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
        
        <button type="button" className="flex p-2 focus:outline-none">
           <span className="sr-only">Dismiss</span>
        <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
)

export default SwapBanner
