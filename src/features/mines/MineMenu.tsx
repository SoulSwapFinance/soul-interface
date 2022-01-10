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
          href={`/mines?filter=my`}
          activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          STAKED FARMS
          </a>
        </NavLink>
      ) : (
        <a
          className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer striped-background text-secondary bg-dark-900 hover:bg-dark-800"
          onClick={toggleWalletModal}
        >
          STAKED FARMS
        </a>
      )}

      <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20" />

      <NavLink
        exact
        href="/mines?filter=active"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          ACTIVE FARMS
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
              SOULSWAP PAIRS
            </a>
          </NavLink>
          {/* <NavLink
            exact
            href={`/mines?filter=fantom`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              FANTOM PAIRS
            </a>
          </NavLink> */}
          <NavLink
            exact
            href={`/mines?filter=inactive`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              INACTIVE FARMS
            </a>
          </NavLink>
        </>
      )}
    </div>
  )
}

export default Menu

// import Badge from '../../components/Badge'
// import { ChainId } from '../../sdk'
// import NavLink from '../../components/NavLink'
// import React from 'react'
// import { useActiveWeb3React } from '../../hooks'
// import { useLingui } from '@lingui/react'
// import { t } from '@lingui/macro'
// import Search from '../../components/Search'

// const MenuItem = ({ href, title }) => {
//   const { i18n } = useLingui()
//   return (
//     <NavLink
//       exact
//       href={href}
//       activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
//     >
//       <a className="flex items-center justify-between px-6 py-6  text-base font-bold border border-transparent rounded cursor-pointer bg-dark-800">
//         {title}
//       </a>
//     </NavLink>
//   )
// }
// const Menu = ({ positionsLength, onSearch, term }) => {
//   const { account, chainId } = useActiveWeb3React()
//   const { i18n } = useLingui()
//   return (
//     <div className={`grid grid-cols-12`}>
//       <div className="col-span-12 flex flex-col space-y-4">
//         <MenuItem href="/mines" title={i18n._(t`ALL PAIRS`)} />
//         {account && positionsLength > 0 && <MenuItem href={`/mines?filter=soul`} title={i18n._(t`SOUL PAIRS`)} />}
//         {account && positionsLength > 0 && <MenuItem href={`/mines?filter=my`} title={i18n._(t`MY PAIRS`)} />}
//         {account && positionsLength > 0 && <MenuItem href={`/mines?filter=ftm`} title={i18n._(t`FANTOM PAIRS`)} />}
//         {account && positionsLength > 0 && <MenuItem href={`/mines?filter=stables`} title={i18n._(t`STABLE PAIRS`)} />}
//         {account && positionsLength > 0 && <MenuItem href={`/mines?filter=inactive`} title={i18n._(t`INACTIVE PAIRS`)} />}
//         {/* {account && positionsLength > 0 && <MenuItem href={`/mines?filter=single`} title={i18n._(t`STAKING ASSETS`)} />} */}

//         {/* <MenuItem href="/farm?filter=soul" title="SOUL Farms" />
//         <MenuItem href="/farm?filter=stables" title="Stables Farms" />
//         <MenuItem href="/farm?filter=single" title="Single Asset" /> */}
//       </div>
//     </div>
//   )
// }

// export default Menu
