import { SummonerPid0, CirclePids } from "./StakePids";

import StakeKey from "./StakeKey";
import StakeRow from "./StakeRow";
import CircleStakeKey from "./CircleStakeKey"
import CircleStakeRow from "./CircleStakeRow"

export default function StakeList() {
  const summonerPool0 = SummonerPid0.map((pool) => (
    <StakeRow
      key={pool.pid}
      pid={pool.pid}
      lpSymbol={pool.lpSymbol}
      lpToken={pool.lpAddresses[250]}
      token1={pool.token1}
      token2={pool.token2}
      farm={pool}
    />
  ));

  const circlePools = CirclePids.map((pool) => (
    <CircleStakeRow
      key={pool.pid}
      pid={pool.pid}
      lpSymbol={pool.lpSymbol}
      lpToken={pool.lpAddresses[250]}
      token1={pool.token1}
      token2={pool.token2}
      farm={pool}
      startTime={pool.startTime}
      endTime={pool.endTime}
    />
  ));

  return (
    <>
      {/* <StakeKey />
      <>{summonerPool0}</>
      <br /> */}
      <CircleStakeKey />
      <>{circlePools}</>
    </>
  );
}
