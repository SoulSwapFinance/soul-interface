// import Container from "components/Container";
import React from "react";
// import { styled } from 'styled-components'

const Explorer = () => {
	return (
		<div className="w-full justify-center">
		<div className="md:hidden sm:flex sm:w-full sm:h-full">
			<iframe
				frameBorder={"none"}
				title={"Explorer"}
				src="https://explore.soulswap.finance"
				// src="https://soulswap.finance"
				height={"900px"}
				width={'100%'}
				/>
		</div>
	
		<div className="xl:hidden lg:flex lg:w-full lg:h-full">
			<iframe
				frameBorder={"none"}
				title={"Explorer"}
				src="https://explore.soulswap.finance"
				// src="https://soulswap.finance"
				height={"1200px"}
				width={'100%'}
				/>
		</div>

		<div className="xl:hidden xl:flex xl:w-full xl:h-full">
			<iframe
				frameBorder={"none"}
				title={"Explorer"}
				src="https://explore.soulswap.finance"
				// src="https://soulswap.finance"
				height={"3600px"}
				width={'100%'}
				/>
		</div>
		</div>

	);
};
export default Explorer;
