import ListPanel from 'components/ListPanel'
import Typography from 'components/Typography'
import { usePoolContext } from 'features/trident/PoolContext'
import { FC } from 'react'

const MyDeposits: FC = () => {
  const { poolWithState } = usePoolContext()

  return (
    <div className="flex flex-col px-5 gap-5 mt-12">
      <Typography variant="h3" className="text-high-emphesis" weight={700}>
        {`Deposits`}
      </Typography>
      <ListPanel
        header={<ListPanel.Header title={`Assets`} value="$16,720.00" subValue="54.32134 SLP" />}
        items={[poolWithState?.pool?.reserve0, poolWithState?.pool?.reserve1].map((amount, index) => (
          <ListPanel.CurrencyAmountItem amount={amount} key={index} />
        ))}
        footer={<ListPanel.Footer title={`Share of Pool`} value="0.05%" />}
      />
    </div>
  )
}

export default MyDeposits