import NavLink from '../../components/NavLink'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

const MenuItem = ({ href, title }) => {
  const { i18n } = useLingui()
  return (
    <NavLink
      exact
      href={href}
      activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
    >
      <a className="flex items-center justify-between px-6 py-6  text-base font-bold border border-transparent rounded cursor-pointer bg-dark-800">
        {title}
      </a>
    </NavLink>
  )
}
const Menu = ({ positionsLength, onSearch, term }) => {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  return (
    <div className={`grid grid-cols-12`}>
      <div className="col-span-12 flex flex-col space-y-4">
        <MenuItem href="/summoner" title={i18n._(t`ALL PAIRS`)} />
        {account && positionsLength > 0 && <MenuItem href={`/summoner?filter=soul`} title={i18n._(t`SOUL PAIRS`)} />}
        {account && positionsLength > 0 && <MenuItem href={`/summoner?filter=my`} title={i18n._(t`MY PAIRS`)} />}
        {account && positionsLength > 0 && <MenuItem href={`/summoner?filter=fantom`} title={i18n._(t`FANTOM PAIRS`)} />}
        {account && positionsLength > 0 && <MenuItem href={`/summoner?filter=stables`} title={i18n._(t`STABLE PAIRS`)} />}
        {account && positionsLength > 0 && <MenuItem href={`/summoner?filter=single`} title={i18n._(t`STAKING ASSETS`)} />}

        {/* <MenuItem href="/farm?filter=soul" title="SOUL Farms" />
        <MenuItem href="/farm?filter=stables" title="Stables Farms" />
        <MenuItem href="/farm?filter=single" title="Single Asset" /> */}
      </div>
    </div>
  )
}

export default Menu
