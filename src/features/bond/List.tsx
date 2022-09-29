import { BondKey } from './Key'
import BondRowRender from './Row'
import { AvalanchePools, FantomPools } from './Pids'
import { useActiveWeb3React } from 'services/web3'

const BondList = () => {
  const { chainId } = useActiveWeb3React() // account

  const ftmList = FantomPools.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token1Address={bond.token1Address}
      token2Address={bond.token2Address}
      bond={bond}
    />
  ))
  
  const avaxList = AvalanchePools.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token1Address={bond.token1Address}
      token2Address={bond.token2Address}
      bond={bond}
    />
  ))

  return (
    <>
      {/* <BondHeader/> */}
      <BondKey />
      <>{ chainId == 43114 ? avaxList : ftmList }</>
    </>
  )
}

export default BondList
