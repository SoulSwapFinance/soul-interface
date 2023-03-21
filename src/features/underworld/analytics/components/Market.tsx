import TokenMarketTable from "../components/tables/TokenMarketTable"
import { UnderworldPairsByToken } from "../types/UnderworldPair"

const Market = ({
  loading,
  data,
}: {
  loading: boolean
  data: UnderworldPairsByToken[]
}) => {
  return (
    <div className="max-w-6xl px-4 mx-auto mt-4 mb-24">
      <TokenMarketTable title={"All Markets"} loading={loading} data={data} />
    </div>
  )
}

export default Market