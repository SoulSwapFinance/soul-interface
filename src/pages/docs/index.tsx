import useDesktopMediaQuery from "hooks/useDesktopMediaQuery";
import getConfig from "next/config";
import React from "react";

const Docs = () => {
	const isDesktop = useDesktopMediaQuery()
	const { publicRuntimeConfig } = getConfig()
	const { breakpoints } = publicRuntimeConfig

	const screenHeight= isDesktop ? `${breakpoints.lg}` : `900px`
	const screenWidth= isDesktop ?  `${breakpoints.xl}` : `100%`

	return (
      <iframe
	  		className="mt-2 w-full"
			frame-border={"none"}
    		title={"Docs"}
			src="https:/protocol.soulswap.finance"
    		height={screenHeight}
    		width={screenWidth}
    />
	);
};
export default Docs;