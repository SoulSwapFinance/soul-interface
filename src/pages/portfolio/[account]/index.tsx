import { getChainColor } from 'constants/chains'
import ActionsModal from 'features/portfolio/ActionsModal'
import { CoffinBalances, WalletBalances } from 'features/portfolio/AssetBalances/coffinAndWallet'
import { PoolBalances } from 'features/portfolio/AssetBalances/pools'
import { useAccountInUrl } from 'features/portfolio/useAccountInUrl'
import { shortenAddress } from 'functions'
import TridentLayout, { TridentBody } from 'layouts/Trident'
import Head from 'next/head'
import React, { useState } from 'react'
import { useActiveWeb3React } from 'services/web3'

const Portfolio = () => {
  const { chainId } = useActiveWeb3React()
  const account = useAccountInUrl('/portfolio')
  const [show, setShow] = useState(false)

  const handleShow = () => {
    show ? setShow(false) : setShow(true)
  }

  if (!account) return

  return (
    <>
      <Head>
          <title>Portfolio | SoulSwap</title>
          <meta name="description" content="Get a summary of all of the balances in your portfolio on SoulSwap." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="Get a summary of all of the balances in your portfolio on SoulSwap." />
        </Head>

      {/* <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader> */}
      {/* lg:grid grid-cols-2 lg:gap-4" */}
      <TridentBody className="flex flex-col gap-10 grid-cols-2 mt-12">
      <div
        className={`grid grid-cols-1 border-2 border-dark-700 rounded-lg font-bold text-2xl text-center justify-center p-2`}
      >
          { `Account Portfolio` }
          {/* { `Account Portfolio (-${shortenAddress(account).substring(9,13)})` } */}
        <div
          className={account ? `text-xs text-[${getChainColor(chainId)}]` : `hidden`}
        > 
          { `Connected to: ${shortenAddress(account)}` }
        </div>
      </div>
        <WalletBalances chainId={chainId} account={account} />
        <PoolBalances account={account} />
        <div
          className={`w-full h-[30px] bg-purple rounded-lg font-bold text-xl text-center justify-center cursor-pointer hover:bg-dark-800`}
          onClick={() => handleShow() }
          >
            {show ? `Hide Retired` : `Show Retired`}
        </div>
        { show && <CoffinBalances account={account} /> }
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio