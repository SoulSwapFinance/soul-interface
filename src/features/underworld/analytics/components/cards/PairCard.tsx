import classNames from "classnames";
import { BigNumber } from "ethers";
import numeral from "numeral";
import { UnderworldPair } from "../../types/UnderworldPair";

const PairCard = ({
  containerClass = "",
  data,
}: {
  containerClass?: string;
  data?: UnderworldPair;
}) => {
  return (
    <div
      className={classNames({
        [containerClass]: true,
        "bg-white border rounded shadow-md": true,
      })}
    >
      <div className="border-b px-8 py-5 font-semibold">Info</div>
      <div className="px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="w-full">
          <div className="font-medium">Supply</div>
          {!data ? (
            <div className="inline-block loading h-7 w-36 rounded"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(
                BigNumber.from(data?.totalAsset)
                  .add(BigNumber.from(data.totalBorrow))
                  .toNumber() / 100.0
              ).format("($0,0.00)")}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">Utilization</div>
          {!data ? (
            <div className="inline-block loading h-7 w-24 rounded"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(
                BigNumber.from(data?.utilization)
                  .div(BigNumber.from("100000000000000"))
                  .toNumber() / 10000.0
              ).format("(0,0.00%)")}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">Available</div>
          {!data ? (
            <div className="inline-block loading h-7 w-36 rounded"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(Number(data?.totalAsset) / 100.0).format("($0,0.00)")}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">Borrow&nbsp;</div>
          {!data ? (
            <div className="inline-block loading h-7 w-36 rounded"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(Number(data?.totalBorrow) / 100.0).format("($0,0.00)")}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">Supply APY</div>
          {!data ? (
            <div className="inline-block loading h-7 w-20 rounded"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(
                BigNumber.from(data?.supplyAPR)
                  .div(BigNumber.from("1000000000000"))
                  .toNumber() / 100000
              ).format("%0.00")}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">Borrow APY</div>
          {!data ? (
            <div className="inline-block loading h-6 w-20 rounded"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(
                BigNumber.from(data?.borrowAPR)
                  .div(BigNumber.from("1000000000000"))
                  .toNumber() / 100000
              ).format("%0.00")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PairCard;