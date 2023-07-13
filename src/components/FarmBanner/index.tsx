import { FC } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import useToggle from '../../hooks/useToggle'

const FarmBanner: FC = () => {
  const [state, toggle] = useToggle();

  if(!state) {
    return (
        <div className="relative w-full bg-purple bg-opacity/05 rounded-lg tracking-wide">
          <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
              <p className="font-medium text-white">
                {/* <span className='mr-3'>🕯</span> */}
                <span className="md:hidden text-center font-bold">WITHDRAW FEES NOW REMOVED</span>
                <span className="hidden md:inline font-bold">We now have ZERO FEES for farming.</span>
                <span className="block sm:ml-2 sm:inline-block">
                  {''}
                </span>
              </p>
              <XCircleIcon className='h-5 w-5 text-gray-300 hover:text-white absolute right-3 top-3' onClick={toggle} />
            </div>
          </div>
        </div>
    )
  } else {
    return null;
  }

}

export default FarmBanner
