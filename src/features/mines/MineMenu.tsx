import { ChainId } from 'sdk'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { useWalletModalToggle } from 'state/application/hooks'
import React from 'react'

const Menu = ({ positionsLength }) => {
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <div className="space-y-4">
      {account ? (
        <NavLink
          exact
          href={`/mines?filter=portfolio`}
          activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
            Your Farms
          </a>
        </NavLink>
      ) : (
        <a
          className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer striped-background text-secondary bg-dark-900 hover:bg-dark-800"
          onClick={toggleWalletModal}
        >
          Your Farms
        </a>
      )}

      <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20" />

      <NavLink
        exact
        href="/mines"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          All Farms
        </a>
      </NavLink>

      {chainId === ChainId.FANTOM && (
        <>
          <NavLink
            exact
            href={`/mines?filter=soul`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              SoulSwap Farms
            </a>
          </NavLink>
        </>
      )}
    </div>
  )
}

export default Menu
