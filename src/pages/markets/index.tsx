import React, { useCallback, useEffect, useMemo, useState } from "react"
import Container from "components/Container"
import Typography from "components/Typography"
import { Button } from "components/Button";
import Head from "next/head";
import { i18n, I18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "services/web3";


const SOUL = (i18n: I18n) => [
	{
	  id: 0,
	  name: 'CHOOSE YOUR DESTINY...',
	  description: i18n._(t`SELECT PATH`),
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
	const soulFeature = useMemo(() => SOUL(i18n), [i18n])

	let currentSelectSide;
	let tokenSelected: {
		logoURI
	}

	async function getMarketData(ticker: string) {
		if(marketData) { return console.log("Getting Tokens..."); } 
		
		// Fetch Market Data
		if(!marketData) {
		await setMarketData(true)
		let data = await fetch(`https://data.messari.io/api/v1/assets/${ticker}/metrics/market-data`);
		let marketData = await data.json();
		let priceUSD = await marketData.data.market_data.price_usd
		let symbol = await marketData.data.Asset.symbol
		let name = await marketData.data.Asset.name
		console.log("Price JSON: ", priceUSD);
		console.log("Token Symbol: ", symbol);
		console.log("Token Name: ", name);
		setTokenPrice(priceUSD)
		setTokenSymbol(symbol)
		}
		return marketData
	  }

//   function openModal(side) {
//     currentSelectSide = side;
//     // document.getElementById("token_modal").style.display = "block";
//   }

  function closeModal() {
    // document.getElementById("token_modal").style.display = "none";
  }
	  async function selectToken(token) {
		closeModal();
		tokenSelected[currentSelectSide] = token;
		console.log("tokenSelected: ", tokenSelected);
		renderInterface();
	  }

	//   async function listAvailableTokens() {
	// 	console.log("initializing");
	// 	let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
	// 	let tokenListJSON = await response.json();
	// 	console.log("listing available tokens: ", tokenListJSON);
	// 	let  tokens = tokenListJSON.tokens;
	// 	console.log("tokens: ", tokens);
	
	// 	// create token list for modal
	// 	let parent = document.getElementById("token_list");
	// 	for (const i in tokens) {
	// 	  // token row in the modal token list
	// 	  let div = document.createElement("div");
	// 	  div.className = "token_row";
	// 	  let html = `
	// 		<img class="token_list_img" src="${tokens[i].logoURI}">
	// 		  <span class="token_list_text">${tokens[i].symbol}</span>
	// 		  `;
	// 	  div.innerHTML = html;
	// 	  div.onclick = () => {
	// 		selectToken(tokens[i]);
	// 	  };
	// 	  parent.appendChild(div);
	// 	};
	//   }

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
        { getMarketData(ticker) && soulFeature.map((soulFeature) => (
          <li key={soulFeature.id} className="relative border gap-4 border-purple hover:border-dark-600 w-full p-4 rounded bg-dark-900 hover:bg-dark-800">
          {soulFeature.id  == 0 &&
            <div className="flex justify-between space-y-4 space-x-4">
              <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-xl font-bold truncate text-primary">{soulFeature.name}</p>
                      <p className="text-sm truncate text-dark-600 text-secondary">{soulFeature.description}</p>
                  </div>
              </div>
            </div>
			}
			</li>
			)
			)}
		</ul>
	
	{ !marketData &&
	<Button
	onClick={async () => await getMarketData(ticker) }
	>
		REFRESH

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
