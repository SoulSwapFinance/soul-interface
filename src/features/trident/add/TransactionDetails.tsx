import Typography from 'components/Typography'
import { useAddDetails } from 'features/trident/add/useAddDetails'
import { usePoolContext } from 'features/trident/PoolContext'
import { FC } from 'react'

const TransactionDetails: FC = () => {
  const { poolWithState, poolBalance } = usePoolContext()
  const { price, poolShareBefore, liquidityMinted, poolShareAfter } = useAddDetails()

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex flex-row justify-between gap-2">
        <Typography weight={700} className="text-high-emphesis">
          {`Transaction Details`}
        </Typography>
        {/* <TransactionDetailsExplanationModal>
          <Typography weight={700} variant="sm" className="text-right text-blue">
            {`What do these mean?`}
          </Typography>
        </TransactionDetailsExplanationModal> */}
      </div>
      <div className="flex flex-col gap-1">
        {poolWithState?.pool && (
          <>
            <div className="flex flex-row justify-between gap-2">
              <Typography variant="sm" className="text-secondary">
                1 {poolWithState.pool?.token0?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
                {price ? price.toSignificant(6) : '0.000'} {poolWithState.pool?.token1?.symbol}
              </Typography>
            </div>
            <div className="flex flex-row justify-between">
              <Typography variant="sm" className="text-secondary">
                1 {poolWithState.pool?.token1?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
                {price ? price.invert().toSignificant(6) : '0.000'} {poolWithState.pool?.token0?.symbol}
              </Typography>
            </div>
          </>
        )}
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {`Minimum Received`}
          </Typography>
          <Typography id="text-liquidity-minted" weight={700} variant="sm" className="text-high-emphesis">
            {liquidityMinted?.toSignificant(6) || '0.000'} SLP
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {`Your Pool Share`}
          </Typography>
          <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
            {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}%
            {poolShareAfter?.greaterThan(0) && (
              <>
                → <span className="text-green">{poolShareAfter?.toSignificant(6) || '0.000'}%</span>
              </>
            )}
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary whitespace-nowrap">
            {`Your Pool Tokens`}
          </Typography>
          <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
            {poolBalance?.greaterThan(0) ? poolBalance?.toSignificant(6) : '0.000'}
            {liquidityMinted?.greaterThan(0) && (
              <>
                {' SLP '}→{' '}
                <span className="text-green">
                  {poolBalance && liquidityMinted ? poolBalance.add(liquidityMinted)?.toSignificant(6) : '0.000'} SLP
                </span>
              </>
            )}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails