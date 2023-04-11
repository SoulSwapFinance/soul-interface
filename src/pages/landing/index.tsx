import useDesktopMediaQuery from "hooks/useDesktopMediaQuery";
import getConfig from "next/config";
import React from "react";

const Landing = () => {
	const isDesktop = useDesktopMediaQuery()
	const { publicRuntimeConfig } = getConfig()
	const { breakpoints } = publicRuntimeConfig

	const screenHeight= isDesktop ? `${breakpoints.lg}` : `900px`
	const screenWidth= isDesktop ?  `${breakpoints.xl}` : `100%`

	return (
      <iframe
	  		className="mt-4 w-full"
    		title={"Landing"}
    		src="https://home.soulswap.finance"
    		height={screenHeight}
    		width={screenWidth}
    />
	);
};
export default Landing;