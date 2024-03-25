import React, { FC, useState } from 'react'
import { ChainId } from 'sdk'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'config/networks'
import { classNames } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import Image from 'next/image'
import { useModalOpen, useNetworkModalToggle } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { getChainColor, getChainColorCode } from 'constants/chains'

export const SUPPORTED_NETWORKS: Record<
  number,
  {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
> = {
  [ChainId.ETHEREUM]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools', 'https://rpc.ankr.com/fantom', 'https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.ankr.com/bsc',
      // 'https://bsc-dataseed.binance.org'
    ],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/polygon'],
      // 'https://polygon-rpc.com'], // ['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.AVALANCHE]: {
    chainId: '0xa86a',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18,
    },
    // rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    // rpcUrls: ['https://https://rpc.ankr.com/avalanche', 'https://mainnet-avalanche.wallet.brave.com/'],
    rpcUrls: ['https://https://rpc.ankr.com/avalanche'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
  [ChainId.ARBITRUM]: {
    chainId: '0xa4b1',
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.ankr.com/arbitrum',
      // 'https://arb1.arbitrum.io/rpc'
    ],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.BLAST]: {
    chainId: '0x13E31', // 81457
    chainName: 'Blast',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.blast.io',
    ],
    blockExplorerUrls: ['https://blastscan.io'],
  },
  [ChainId.BASE]: {
    chainId: '0x2105',
    chainName: 'Base',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.ankr.com/basd',
    ],
    blockExplorerUrls: ['https://basescan.org'],
  },
  [ChainId.MOONRIVER]: {
    chainId: '0x505',
    chainName: 'Moonriver',
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
    blockExplorerUrls: ['https://moonriver.moonscan.io'],
  },
  [ChainId.TELOS]: {
    chainId: '0x28',
    chainName: 'Telos',
    nativeCurrency: {
      name: 'Telos',
      symbol: 'TLOS',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.telos.net/evm'],
    blockExplorerUrls: ['https://rpc1.us.telos.net/v2/explore'],
  },
  // [ChainId.LUKSO]: {
  //   chainId: '0x2a', // 42
  //   chainName: 'Lukso',
  //   nativeCurrency: {
  //     name: 'Lukso',
  //     symbol: 'LYX',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpc.lukso.gateway.fm'],
  //   blockExplorerUrls: ['https://explorer.execution.mainnet.lukso.network'],
  // },
}

// const NetworkModal: FC<{ switchNetwork: (targetChain: number) => void }> = ({ switchNetwork }) => {
const NetworkModal: FC<{ switchNetwork: (targetChain: number) => void }> = ({ switchNetwork }) => {
  const { chainId } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  // const [isShowing, setShowing] = useState(false)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled
      isOpen={networkModalOpen}
      chainId={chainId}
      onDismiss={toggleNetworkModal}>
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header 
          header={`Select Network`} onClose={toggleNetworkModal} 
        />
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 overflow-y-auto">
          {[
            ChainId.ETHEREUM,
            ChainId.ARBITRUM,
            ChainId.MATIC,
            ChainId.BSC,
            ChainId.FANTOM,
            ChainId.BASE,
            ChainId.BLAST,
            ChainId.AVALANCHE,
            // ChainId.LUKSO,
          ]
            // .sort((key) => (chainId === key ? -1 : 0))
            .map((key: number, i: number) => {
              if (chainId === key) {
                return (
                  <div
                    key={i}
                    className={`bg-${getChainColorCode(chainId)} focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-[${getChainColor(chainId)}] cursor-default`}
                  >
                    <Image
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="max-h-[32px] max-w-[32px]"
                      width={32}
                      height={32}
                    />
                    <Typography weight={700} className="text-high-emphesis text-lg">
                      {NETWORK_LABEL[key]}
                    </Typography>
                  </div>
                )
              }
              return (
                <button
                  key={i}
                  onClick={() => switchNetwork(key)}
                  className={classNames(
                    `bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border hover:border-${getChainColorCode(key)}`
                  )}
                >
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className={`max-h-[32px] max-w-[32px]`}
                    width={32}
                    height={32}
                  />
                  <Typography weight={700} className={`text-high-emphesis text-lg`}>
                    {NETWORK_LABEL[key]}
                  </Typography>
                </button>
              )
            })}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default NetworkModal