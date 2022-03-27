import SwapHeader from 'features/trade/Header'
import MainHeader from '../../features/swap/MainHeader'

const Charts = () => {
	return (
		<><MainHeader
			// input={currencies[Field.INPUT]}
			// output={currencies[Field.OUTPUT]}
			// allowedSlippage={allowedSlippage} 
			/>
			
			<div id="swap-page" className="mt-4 w-full max-w-2xl p-4 space-y-4 rounded bg-dark-900 z-1">
				<SwapHeader />
				<iframe
					frameBorder={"none"}
					title={"CHARTS"}
					src="https://info.soulswap.finance"
					height={"720"}
					width={"100%"} />
			</div></>
	);
};

export default Charts;
