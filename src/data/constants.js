module.exports = {
	// todo: update endpoints and addresses
	graphAPIEndpoints: {
		masterchef: 'https://api.thegraph.com/subgraphs/name/soulswap/master-chef',
		circle: 'https://api.thegraph.com/subgraphs/name/soulswap/soul-circle',
		timelock: 'https://api.thegraph.com/subgraphs/name/soulswap/soul-timelock',
		maker: 'https://api.thegraph.com/subgraphs/name/soulswap/soul-maker',
		// exchange: 'https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-swap',
		exchange: 'https://api.studio.thegraph.com/query/3838/fantom-swap/version/latest',
		blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
		lockup: 'https://api.thegraph.com/subgraphs/name/matthewlilley/lockup',
	},
	circleAddress: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', //
	makerAddress: '0xe11fc0b43ab98eb91e9836129d1ee7c3bc95df50', // TODO
	chefAddress: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B',
	soulAddress: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07',
	factoryAddress: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',

	TWENTY_FOUR_HOURS: 86400,
};
