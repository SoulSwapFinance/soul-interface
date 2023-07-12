// import Davatar from '@davatar/react'
// import { Web3Provider } from '@ethersproject/providers'
// import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
// import { injected } from 'config/wallets'
import { NetworkContextName } from '../../constants'
// import { shortenAddress } from 'functions'
import useENSName from 'hooks/useENSName'
import WalletModal from 'modals/WalletModal'
import { useWalletModalToggle } from 'state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
// import Image from 'next/image'
import React, { useMemo } from 'react'
import WalletIcon from 'components/Icons/header/WalletIcon'

import Loader from '../Loader'
import Web3Connect from '../Web3Connect'
// import { WalletIcon } from 'components/Icon'
// import { getChainColor } from 'constants/chains'
import { useUserInfo } from 'hooks/useAPI'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// function StatusIcon({ connector }: { connector: AbstractConnector; account: string; provider: Web3Provider }) {
//   if (connector === injected) {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image
//           src="https://exchange.soulswap.finance/images/wallets/metamask.png"
//           alt="Injected (MetaMask Etc.)"
//           width={16}
//           height={16}
//         />
//       </div>
//     )
//   } else if (connector.constructor.name === 'WalletConnectConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image
//           src="https://exchange.soulswap.finance/images/wallets/wallet-connect.svg"
//           alt={'Wallet Connect'}
//           width="16px"
//           height="16px"
//         />
//       </div>
//     )
//   } else if (connector.constructor.name === 'LatticeConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image src="https://exchange.soulswap.finance/images/wallets/lattice.png" alt={'Lattice'} width="16px" height="16px" />
//       </div>
//     )
//   } else if (connector.constructor.name === 'WalletLinkConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image
//           src="https://exchange.soulswap.finance/images/wallets/coinbase.svg"
//           alt={'Coinbase Wallet'}
//           width="16px"
//           height="16px"
//         />
//       </div>
//     )
//   } else if (connector.constructor.name === 'FortmaticConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image src="https://exchange.soulswap.finance/images/wallets/fortmatic.png" alt={'Fortmatic'} width="16px" height="16px" />
//       </div>
//     )
//   } else if (connector.constructor.name === 'PortisConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image src="https://exchange.soulswap.finance/images/wallets/portis.png" alt={'Portis'} width="16px" height="16px" />
//       </div>
//     )
//   } else if (connector.constructor.name === 'KeystoneConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image src="https://exchange.soulswap.finance/images/wallets/keystone.png" alt={'Keystone'} width="16px" height="16px" />
//       </div>
//     )
//   } else if (connector.constructor.name === 'CloverConnector') {
//     return (
//       <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
//         <Image src="https://exchange.soulswap.finance/images/wallets/clover.svg" alt={'Clover'} width="16px" height="16px" />
//       </div>
//     )
//   }
//   return null
// }

export function getWalletColor(votingPower) {
  let walletColor = '#797470' // romanticGrey
  votingPower >= 1_000_000
    ? walletColor = "#806AEC" /// lightViolet (V)
  : votingPower >= 500_000
    ? walletColor = "#6E00FF" // brightIndigo (I)
  : votingPower >= 250_000
    ? walletColor = "#005AFF" // nokiaBlue (B)
  : votingPower >= 100_000
    ? walletColor = "#85FF00" // lime green (G)
  : votingPower >= 25_000
    ? walletColor = "#FF9E3D" // neonOrange (O)
  : votingPower >= 1_000
    ? walletColor = "#FF1A1A" // yelpRed (R)
  : walletColor = "#797470" // romanticGrey

  return walletColor
}

export function getChakra(votingPower) {
  let chakra = 'Root' // romanticGrey
  votingPower >= 1_000_000
    ? chakra = "Crown" /// lightViolet (V)
  : votingPower >= 500_000
    ? chakra = "Third Eye" // brightIndigo (I)
  : votingPower >= 250_000
    ? chakra = "Throat" // nokiaBlue (B)
  : votingPower >= 100_000
    ? chakra = "Heart" // lime green (G)
  : votingPower >= 25_000
    ? chakra = "Solar Plexus" // neonOrange (O)
  : votingPower >= 1_000
    ? chakra = "Sacral" // yelpRed (R)
  : chakra = "Root" // romanticGrey

  return chakra
}

export function getChakraColor(votingPower) {
  let chakraColor = 'Grey' // romanticGrey
  votingPower >= 1_000_000
    ? chakraColor = "Violet" /// lightViolet (V)
  : votingPower >= 500_000
    ? chakraColor = "Indigo" // brightIndigo (I)
  : votingPower >= 250_000
    ? chakraColor = "Blue" // nokiaBlue (B)
  : votingPower >= 100_000
    ? chakraColor = "Green" // lime green (G)
  : votingPower >= 25_000
    ? chakraColor = "Yellow" // neonOrange (O)
  : votingPower >= 1_000
    ? chakraColor = "Orange" // yelpRed (R)
  : chakraColor = "Grey" // romanticGrey

  return chakraColor
}

function Web3StatusInner() {
  const { account, chainId, connector, library } = useWeb3React()
  // const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const { userInfo } = useUserInfo()

  const votingPower = Number(userInfo?.votingPower)
  // console.log(votingPower)

  if (account) {
    return (
      <div
        id="web3-status-connected"
        // className= {`flex items-center justify-center px-3 py-2.5 md:space-x-2 rounded bg-dark-1000 border border-dark-900 hover:bg-dark-800 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}
        className={`flex items-center rounded-2xl p-2 
        bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto`}
        // border border-[${getChainColor(chainId)}] 
        // className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-dark-1000 text-primary"
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between gap-2">
            <div>
              {pending?.length} {`Pending`}
            </div>{' '}
            <Loader stroke="white" />
          </div>
        ) : (
          // <div className="flex items-center gap-2">
          <div className=
          // {`flex items-center rounded rounded-xl border border-[${getChainColor(chainId)}] bg-dark-1000 h-[24px] w-[24px] hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto`}
          {`grid items-center grid-flow-col justify-center bg-dark-1000 h-[24px] w-[24px] text-sm pointer-events-auto auto-cols-max text-secondary`}
          >
            {/* <div>{ENSName || shortenAddress(account)} </div> */}
            {/* <WalletIcon 
              width={24}
              height={24}
              color={getWalletColor()}
              // className={`text-[${getWalletColor()}]`}
            /> */}
            <WalletIcon
                fillPrimary={`${getWalletColor(votingPower ?? 0)}`}
                fillSecondary={`#FFFFFF`}
                className={'w-7 h-7 -mt-0.5 ml-1'}
            />
            {/* <Davatar
              size={20}
              address={account}
              defaultComponent={
                <Image src="https://exchange.soulswap.finance/logo.png" alt="Soul Logo" width={20} height={20} />
              }
              style={{ borderRadius: 5 }}
              provider={library}
            /> */}
          </div>
        )}
        {/* {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} account={account} provider={library} />
        )} */}
      </div>
    )
  } else {
    return (
        <Web3Connect className="bg-avaxRed hover:to-purple !text-white h-[38px]" />
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}