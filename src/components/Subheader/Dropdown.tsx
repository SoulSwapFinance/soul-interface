import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import useDropdown from 'components/Subheader/useDropdown'
import { useActiveWeb3React } from 'services/web3'
import React, { FC, Fragment, useState } from 'react'

import { DropdownItem } from './DropdownItem'
import useBar from './useDropdown'
import { useRouter } from 'next/router'

// import { classNames } from 'functions/styling'
// import { getChainColor } from 'constants/chains'
// import TokenStats from 'components/TokenStats'
// import { ChainId, NATIVE } from 'sdk'
// import Web3Network from 'components/Web3Network'
// import Web3Status from 'components/Web3Status'
// import useIsCoinbaseWallet from 'hooks/useIsCoinbaseWallet'
// import Image from 'next/image'
// import Link from 'next/link'

const Mobile: FC = () => {
  const menu = useDropdown()
  const bar = useBar()
  const router = useRouter()
  const isLuxor = router.asPath.startsWith('/luxor')

  const { account, chainId, library } = useActiveWeb3React()
  const [open, setOpen] = useState(false)
  // const isCoinbaseWallet = useIsCoinbaseWallet()

  return (
    <>
      <header className="w-full flex items-center justify-between min-h-[48px] h-[48px] px-2">
        <div className="flex justify-between flex-grow">
          {/* { [1, 250, 43114].includes(chainId) &&
            <div className="mt-5 rounded-full">
            <Bars3Icon width={24} className={classNames(isLuxor ? "hover:text-yellow" : `hover:text-[${getChainColor(chainId)}]`, `text-[${getChainColor(chainId)}]`, "cursor-pointer hover:text-white")} 
              onClick={() => setOpen(true)} />
          </div>
          } */}
          <div
              className="flex gap-3 sm:gap-4 md:gap-18 justify-between items-center">
              {menu.map((node) => {
                return <DropdownItem node={node} key={node.key} /> 
              })}
            </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-20 overflow-hidden" onClose={setOpen} unmount={false}>
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 transition-opacity bg-dark-1000 bg-opacity/80" />
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </header>
    </>
  )
}
{/* <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} /> */}


export default Mobile