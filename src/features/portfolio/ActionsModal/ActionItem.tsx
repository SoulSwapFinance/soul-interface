import Typography from 'components/Typography'
import { getChainColorCode } from 'constants/chains'
import React, { FC, ReactNode } from 'react'
import { useActiveWeb3React } from 'services/web3'

const ActionItem: FC<{ svg: ReactNode; label: string; onClick?(): void }> = ({ svg, onClick, label }) => {
  const { chainId } = useActiveWeb3React()

  return (
    <div
    className={`border border-dark-700 bg-dark-900 rounded px-3 py-2.5 w-full cursor-pointer
    hover:border-${getChainColorCode(chainId)}
      `}
      onClick={onClick}
    >
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">{svg}</div>
        <Typography variant="sm" className="text-high-emphesis" weight={700}>
          {label}
        </Typography>
      </div>
    </div>
  )
}

export default ActionItem
