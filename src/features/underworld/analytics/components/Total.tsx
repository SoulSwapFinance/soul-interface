import TotakTokenCard, {
    TotalData,
  } from "./cards/TotalTokenCard"
  
  const Total = ({
    loading,
    supply,
    asset,
    borrow,
  }: {
    loading: boolean
    supply: TotalData
    asset: TotalData
    borrow: TotalData
  }) => {
    return (
      <div className="container grid grid-cols-1 gap-4 px-4 mx-auto mb-4 -mt-16 lg:grid-cols-3">
        <TotakTokenCard
          containerClass="col-span-1"
          loading={loading}
          borrow="supply"
          data={supply}
        />
        <TotakTokenCard
          containerClass="col-span-1"
          loading={loading}
          borrow="asset"
          data={asset}
        />
        <TotakTokenCard
          containerClass="col-span-1"
          loading={loading}
          borrow="borrow"
          data={borrow}
        />
      </div>
    )
  }
  
  export default Total