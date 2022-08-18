import Container from "components/Container";
import React from "react";

const Chainswap = () => {
    const ETH = 'ETH'
    const fromToken = 'FTM'
	return (
        <Container>
        <iframe
        id="chainswap-widget-iframe"
        title="Swap Widget"
        height="900px"
        width="100%"
        // style="border: none; border-radius: 19px; box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.1); display: none;"
        src={`https://exchange.chainswap.com/#/swap`}
        // onload="onFrameLoad()"
        >
    </iframe>
        </Container>
	);
};

export default Chainswap;