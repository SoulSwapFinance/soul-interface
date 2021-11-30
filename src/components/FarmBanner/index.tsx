import { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'

const FarmBanner: FC = () => (
  <div className="relative w-full bg-purple bg-opacity-05">
    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pr-16 sm:text-center sm:px-16">
        <p className="font-medium text-white">
          <span className="md:hidden text-center">DAI-gFUSDT is now DAI-fUSDT</span>
          <span className="hidden md:inline"><b>DAI-gFUSDT DISCONTINUED for DAI-fUSDT</b></span>
          <span className="block sm:ml-2 sm:inline-block">
            <a href="https://twitter.com/SoulSwapFinance/status/1465633039262920707?s=20" target = "_blank" rel="noreferrer"
className="font-bold text-white underline">
              {' '}
              Read Full Details <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export default FarmBanner
