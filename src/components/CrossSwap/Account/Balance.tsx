import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { ChainId } from 'soulswap-chain'
import { Amount, Native } from 'soulswap-currency'
import { useIsMounted } from 'soulswap-hooks'
import { JSBI } from 'soulswap-math'
import { IconButton, Loader, NetworkIcon, Tooltip, Typography } from 'soulswap-ui'
import React, { FC, ReactNode, useMemo } from 'react'
import { useBalance, useNetwork } from 'wagmi'

import { NetworkSelector } from '../NetworkSelector'

export type Props = {
  address?: string
  supportedNetworks?: ChainId[]
  children?({ content, isLoading }: { content: ReactNode; isLoading: boolean }): ReactNode
}

export const Balance: FC<Props> = ({ address, supportedNetworks, children }) => {
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: !!address })

  return useMemo(() => {
    const content = isLoading ? (
      <Loader />
    ) : isError ? (
      <Tooltip
        button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
        panel={
          <Typography variant="xs" className="text-center">
            An error occurred while trying
            <br /> to fetch your balance
          </Typography>
        }
      />
    ) : supportedNetworks && chain?.id && !supportedNetworks.includes(chain?.id) ? (
      <Tooltip
        button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
        panel={
          <Typography variant="xs" className="text-center">
            Unsupported Network
          </Typography>
        }
      />
    ) : (
      <Typography weight={500} className="flex gap-2 items-center text-slate-200 -ml-0.5" as="span">
        {chain?.id && (
          <NetworkSelector supportedNetworks={supportedNetworks}>
            <IconButton as="div">
              <NetworkIcon chainId={chain?.id} width={20} height={20} />
            </IconButton>
          </NetworkSelector>
        )}
        <Typography weight={500} className="items-baseline hidden gap-1 sm:flex text-slate-200" as="span">
          {isMounted &&
            chain &&
            data &&
            Amount.fromRawAmount(Native.onChain(chain.id), JSBI.BigInt(data.value)).toSignificant(4)}
          <Typography weight={500} className="text-slate-500" as="span">
            {chain ? Native.onChain(chain.id)?.symbol : 'ETH'}
          </Typography>
        </Typography>
      </Typography>
    )

    if (typeof children === 'function') {
      return <>{children({ content, isLoading: isLoading || !(isMounted && chain && data) })}</>
    }

    return content
  }, [chain, children, data, isError, isLoading, isMounted, supportedNetworks])
}
