import { ExternalLinkIcon } from '@heroicons/react/outline'
import { getExplorerLink } from 'functions/explorer'
import { useActiveWeb3React } from 'services/web3'
import React from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'

import ExternalLink from '../ExternalLink'
import { getChainColor, getChainColorCode } from 'constants/chains'

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <div className="flex flex-row w-full flex-nowrap z-[1000]">
      <div className="pr-4">
        {success ? <CheckCircle className="text-2xl text-green" /> : <AlertCircle className="text-2xl text-red" />}
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold text-high-emphesis">
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </div>
        {chainId && hash && (
          <ExternalLink
            className={`p-0 text-[${getChainColor(chainId)}] hover:underline md:p-0`}
            href={getExplorerLink(chainId, hash, 'transaction')}
          >
            <div className="flex flex-row items-center gap-1">
              View on Explorer <ExternalLinkIcon width={20} height={20} className={`text-${getChainColorCode(chainId)}`} />
            </div>
          </ExternalLink>
        )}
      </div>
    </div>
  )
}