import React, { useCallback, useEffect, useMemo, useState } from "react"
import Container from "components/Container"
import Typography from "components/Typography"
import { Button } from "components/Button";
import Head from "next/head";
import { useActiveWeb3React } from "services/web3";

const SOUL = () => [
	{
	  id: 0,
	  name: 'CHOOSE YOUR DESTINY...',
	  description: `SELECT PATH`,
	  href: '/explore',
	},
  ]

const Markets = () => {
	const { chainId } = useActiveWeb3React()
	const [selectedToken, setToken ] = useState()
	const [logo, setLogo] = useState()
	const [tokenPrice, setTokenPrice] = useState()
	const [tokenSymbol, setTokenSymbol] = useState()
	const [marketData, setMarketData] = useState(false)
	const [ticker, setTicker] = useState('btc')
	const soulFeature = useMemo(() => SOUL(), [])

	let currentSelectSide;
	let tokenSelected: {
		logoURI
	}


  function closeModal() {
    // document.getElementById("token_modal").style.display = "none";
  }
	  async function selectToken(token) {
		closeModal();
		tokenSelected[currentSelectSide] = token;
		console.log("tokenSelected: ", tokenSelected);
		renderInterface();
	  }

	  function renderInterface() {
		if (selectedToken) {
		  console.log(selectedToken)
		  setToken(selectedToken)
		  setLogo(tokenSelected.logoURI)
		  // document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
		}
	  }
	
	return (
<Container>
<Head>
        <title>Token Data | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <div className="py-1 bg-dark-600" />
        <div className="py-1 bg-purple" />
      <Typography variant="h1" className="text-center text-dark-600" component="h1">
        SOULSWAP FINANCE
      </Typography>
      <div className="py-1 bg-dark-600" />
        <div className="py-1 bg-purple" />
      <ul className="space-y-4 divide-y-0">
		</ul>
	
	{ !marketData &&
	<Button>
		{'REFRESH'}
	</Button>
	}

	<Typography>
	{ 
		`Selected ${tokenSymbol}
		
		Price ${tokenPrice}`
	}
	</Typography>

</Container>
	);
};

export default Markets;
