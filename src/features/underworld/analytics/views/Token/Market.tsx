/* eslint-disable @next/next/no-img-element */
import TokenCard from "features/underworld/analytics/components/cards/TokenCard"
import PairCollateralPieChart from "features/underworld/analytics/components/charts/PairCollateralPieChart"
import PairSupplyBorrowDayDataChart from "features/underworld/analytics/components/charts/PairSupplyBorrowDayDataChart"
import { useAppContext } from "contexts/AppContext"
import { UnderworldPair } from "../../types/UnderworldPair"
import {
  UnderworldPairDayDataMap,
  UnderworldPairDayDataMapsCollateral,
} from "../../types/UnderworldPairDayData"
import { Token } from "../../types/Token"

const Market = ({
  token,
  totalAsset = BigInt(0),
  totalBorrow = BigInt(0),
  underworldPairs,
  underworldPairDayDataMaps,
  underworldPairDayDataMapsCollaterals,
  priceMap,
}: {
  token?: Token
  totalAsset?: BigInt
  totalBorrow?: BigInt
  underworldPairs?: UnderworldPair[]
  underworldPairDayDataMaps?: UnderworldPairDayDataMap[]
  underworldPairDayDataMapsCollaterals?: UnderworldPairDayDataMapsCollateral[]
  priceMap?: { [key: string]: BigInt }
}) => {
  const { tokenUtilService, handleLogoError } = useAppContext()
  return (
    <>
      <div className="container px-4 mx-auto mb-16 -mt-16">
        <TokenCard
          data={token}
          totalAsset={totalAsset}
          totalBorrow={totalBorrow}
          containerClass="mb-4"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PairCollateralPieChart
            title="Total Supply"
            type={"supply"}
            data={underworldPairs}
          />
          <PairCollateralPieChart
            title="Total Available"
            type={"asset"}
            data={underworldPairs}
          />
          <PairCollateralPieChart
            title="Total Borrow"
            type={"borrow"}
            data={underworldPairs}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <PairSupplyBorrowDayDataChart
            data={underworldPairDayDataMaps}
            type="supply"
            title="Total Supply"
          />
          <PairSupplyBorrowDayDataChart
            data={underworldPairDayDataMaps}
            type="borrow"
            title="Total Borrow"
          />
        </div>
        <div className="mt-4">
          {underworldPairDayDataMapsCollaterals
            ?.filter((value) => value.underworldPairsMaps.length > 0)
            .map((value) => {
              const { collateral, underworldPairsMaps } = value
              return (
                <div key={collateral.id} className="mt-8">
                  <div className="flex items-center col-span-2">
                    <div>
                      <img
                        src={tokenUtilService.logo(token?.symbol)}
                        width="25px"
                        height="25px"
                        className="inline-block rounded-full"
                        onError={handleLogoError}
                        alt={tokenUtilService.symbol(token?.symbol)}
                      />
                      <img
                        src={tokenUtilService.logo(collateral?.symbol)}
                        width="25px"
                        height="25px"
                        onError={handleLogoError}
                        className="inline-block -ml-2 rounded-full"
                        alt={collateral?.symbol}
                      />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xl font-medium">
                        {tokenUtilService.symbol(token?.symbol)}/
                        {tokenUtilService.symbol(collateral?.symbol)}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                    <PairSupplyBorrowDayDataChart
                      data={underworldPairsMaps}
                      type="supply"
                      title="Supply"
                    />
                    <PairSupplyBorrowDayDataChart
                      data={underworldPairsMaps}
                      type="borrow"
                      title="Borrow"
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default Market