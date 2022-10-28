// import { App, AppType, BuyCrypto } from 'ui'
import { useNotifications } from 'lib/state/storage'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'
// import { NotificationCenter } from './NotificationCenter'
// import { Wallet } from './Wallet'

export const Header = () => {
  const { account } = useActiveWeb3React()
  const [notifications, { clearNotifications }] = useNotifications(account)
  return (
    // <App.Header
    //   appType={AppType.xSwap}
    //   withScrollBackground
    //   nav={
    //     <App.NavItemList>
    //       <App.NavItem href="https://exchange.soulswap.finance/swap" label="Swap" />
    //       <App.NavItem href="https://exchange.soulswap.finance/farm" label="Earn" />
    //       <BuyCrypto address={account} />
    //     </App.NavItemList>
    //   }
    // >
      <div className="flex items-center gap-2">
        {/* <Wallet.Button
          size="sm"
          className="border-none shadow-md whitespace-nowrap"
          supportedNetworks={[250, 43114]}
        />
        <NotificationCenter notifications={notifications} clearNotifications={clearNotifications} /> */}
      </div>
    /* </App.Header> */
  )
}
