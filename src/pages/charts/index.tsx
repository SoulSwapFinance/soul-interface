import SwapHeader from 'features/swap/SwapHeader'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'

  
const Charts = () => {
	const { account, chainId } = useActiveWeb3React()
  	const blockchainPrefix = chainId 
    	== ChainId.AVALANCHE ? 'avax-info' : 'info' 
 
	return (
			<div id="swap-page" className="mt-4 w-full max-w-2xl p-4 space-y-4 rounded bg-dark-900 z-1">
				<SwapHeader />
				<iframe
					frameBorder={"none"}
					title={"CHARTS"}
					src={`https://${blockchainPrefix}.soulswap.finance/home`}
					height={"720"}
					width={"100%"} />
			</div>
	);
};

export default Charts;
