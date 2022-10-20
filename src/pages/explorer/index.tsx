// import Container from "components/Container";
// import { styled } from 'styled-components'
import React from "react";

// --xl-bp: 1620px;
// --l-bp: 1360px;
// --md-bp: 959px;
// --s-bp: 600px;
// --xs-bp: 416px;
const Explorer = () => {
	return (
		// <div className="w-full justify-center">
		<div className="flex w-full">
			<iframe
			className={'sm:flex md:hidden'}
				frameBorder={"none"}
				title={"Explorer"}
				// src="https://explore.soulswap.finance/#/tokens/ethereum"
				src="https://market-explorer.vercel.app/#/tokens/ethereum"
				height={"800px"}
				width={'100%'}
			/>
			<iframe
			className={'hidden md:flex lg:hidden'}
				frameBorder={"none"}
				title={"Explorer"}
				// src="https://explore.soulswap.finance/#/tokens/ethereum"
				src="https://market-explorer.vercel.app/#/tokens/ethereum"
				height={"959px"}
				width={'100%'}
			/>
			<iframe
			className={'hidden lg:flex xl:hidden'}
				frameBorder={"none"}
				title={"Explorer"}
				// src="https://explore.soulswap.finance/#/tokens/ethereum"
				src="https://market-explorer.vercel.app/#/tokens/ethereum"
				height={"1360px"}
				width={'100%'}
			/>
			<iframe
			className={'hidden xl:flex'}
				frameBorder={"none"}
				title={"Explorer"}
				// src="https://explore.soulswap.finance/#/tokens/ethereum"
				src="https://market-explorer.vercel.app/#/tokens/ethereum"
				height={"2100px"}
				width={'100%'}
			/>
		 </div>
	);
};
export default Explorer;
