import Davatar from '@davatar/react'
import { HeadlessUiModal } from 'components/Modal'
import { injected, SUPPORTED_WALLETS } from 'config/wallets'
import { getExplorerLink } from 'functions/explorer'
import { formatNumber, shortenAddress } from 'functions/format'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { clearAllTransactions } from 'state/transactions/actions'
import Image from 'next/image'
import React, { FC, useCallback, useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'

import { Button } from '../Button'
import ExternalLink from '../ExternalLink'
import Typography from '../Typography'
import Copy from './Copy'
import Transaction from './Transaction'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useUserInfo } from 'hooks/useAPI'
import { getChakra, getChakraColor, getWalletColor } from 'components/Web3Status'

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

const AccountDetails: FC<AccountDetailsProps> = ({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}) => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { userInfo } = useUserInfo()
  const votingPower = Number(userInfo?.votingPower)

  const connectorName = useMemo(() => {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (
            connector !== injected
            || isMetaMask === (k === 'METAMASK')
          )
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return (
      <Typography variant="xs" weight={700} className="text-secondary">
        Connected with {name}
      </Typography>
    )
  }, [connector])

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <HeadlessUiModal.Header header={`Account`} onClose={toggleWalletModal} />
        {/* <HeadlessUiModal.BorderedContent className="flex flex-col gap-3"> */}
        <div className="flex items-center justify-between">
          {connectorName}
          <Button variant="outlined" color={getChainColorCode(chainId)} size="xs" onClick={deactivate}>
            {`Disconnect`}
          </Button>
        </div>
        <div id="web3-account-identifier-row" className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden rounded-full">
              <Davatar
                size={48}
                address={account}
                defaultComponent={<Image src="/logo.png"
                  alt="Soul Icon" width={48} height={48} />}
                provider={library}
              />
            </div>
            <Typography weight={700} variant="lg" className="text-white">
              {ENSName ? ENSName : account && shortenAddress(account)}
            </Typography>
          </div>
          <div className="flex items-center gap-2 space-x-3">
            {account && (
              <Copy className={`text-[${getChainColor(chainId)}]`} toCopy={account}>
                <Typography variant="xs" weight={700}>
                  {`Copy`}
                </Typography>
              </Copy>
            )}
            {chainId && account && (
              <ExternalLink
                color={getChainColorCode(chainId)}
                startIcon={<GlobeAltIcon width={16} />}
                href={chainId && getExplorerLink(chainId, ENSName || account, 'address')}
              >
                <Typography variant="xs" weight={700}>
                  {`Explorer`}
                </Typography>
              </ExternalLink>
            )}
            {chainId && account && (
              <ExternalLink
                color={`${getChainColorCode(chainId)}`}
                startIcon={<LinkIcon size={16} />}
                href={'/balances'}
              >
                <Typography variant="xs" weight={700}>
                  {`Balances`}
                </Typography>
              </ExternalLink>
            )}
          </div>
        </div>
        {/* </HeadlessUiModal.BorderedContent> */}
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography variant="xs" weight={700} className={`font-white`}>
              {`Voting Power`}
            </Typography>
            <ExternalLink
              href={'https://enchant.soulswap.finance'}
            >
              <Button
                variant="outlined"
                // color={`ftmBlue`}
                color={`${getChainColorCode(chainId)}`}
                size="xs"
              // onClick={clearAllTransactionsCallback}
              >
                {/* <Typography 
                  variant="xs"
                  weight={700} className="text-secondary"
                  > */}
                {`Vote`}
                {/* </Typography> */}
              </Button>
            </ExternalLink>
          </div>
          <div className="flex flex-col divide-y divide-dark-800">
            <Typography variant="xs" weight={700} className="text-secondary">
              {account ? `Power: ${formatNumber(votingPower, false, true)} AURA` : `Connect Wallet to view voting power...`}
            </Typography>
          </div>
          <div className="flex flex-col divide-y divide-dark-800">
            <Typography variant="xs" weight={700} className="text-secondary">
              {account ? `Chakra: ${getChakra(votingPower)} (${getChakraColor(votingPower)})` : `Connect Wallet to view voting power...`}
            </Typography>
          </div>
        </HeadlessUiModal.BorderedContent>
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography variant="xs" weight={700} className="font-white">
              {`Recent Transactions`}
            </Typography>
            <Button variant="outlined" color={`${getChainColorCode(chainId)}`} size="xs" onClick={clearAllTransactionsCallback}>
              {`Clear`}
            </Button>
          </div>
          <div className="flex flex-col divide-y divide-dark-800">
            {!!pendingTransactions.length || !!confirmedTransactions.length ? (
              <>
                {pendingTransactions.map((el, index) => (
                  <Transaction key={index} hash={el} />
                ))}
                {confirmedTransactions.map((el, index) => (
                  <Transaction key={index} hash={el} />
                ))}
              </>
            ) : (
              <Typography variant="xs" weight={700} className="text-secondary">
                {`Your transactions will appear here...`}
              </Typography>
            )}
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
    </div>
  )
}

export default AccountDetails