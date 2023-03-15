import { ChainId, NATIVE, SOUL_ADDRESS } from '../sdk'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from 'services/web3'

type T = Record<string, string>

// function getBaseUrl() {
//   const { chainId } = useActiveWeb3React()
//   let URL
//   chainId == 250 ?
//   URL = 'https://api.soulswap.finance' : URL = 'https://avax-api.soulswap.finance'
// }

const BASE_URL = 'https://api.soulswap.finance'
const BASE_GAS_URL = `https://ethapi.openocean.finance/v2` 

export function useGasPrice(): { status: string; gasPrice: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [gasPrice, setGasPrice] = useState<T>(
     {
        standard: '',
        fast: '',
        instant: ''
     }
    )
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_GAS_URL}/${chainId}/gas-price`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        // console.log('price:%s', json)
        setGasPrice(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, gasPrice }
}

export function useSwapQuote(inputAmount, fromAddress, toAddress): { status: string; swapQuote: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [swapQuote, setSwapQuote] = useState<T>(
     {
      infoAddress: "",
      inputAmount: "1",
      fromAddress: "",
      toAddress: "",
      SoulAmountOut: "",
      SpookyAmountOut: "",
      SpiritAmountOut: "",
      OptimalDex: "",
     }
    )
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_URL}/aggregator/${inputAmount}/${fromAddress}/${toAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        // console.log('price:%s', json)
        setSwapQuote(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, swapQuote }
}

export function usePriceUSD(tokenAddress): { status: string; price: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [price, setPrice] = useState<T>()
    // const URL = getBaseUrl()
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/priceusd/${tokenAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        // console.log('price:%s', json)
        setPrice(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, price }
}

export function useSoulInfo(): { status: string; soulInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`
    
    const [soulInfo, setInfo] = useState<T>({
        address: SOUL_ADDRESS[chainId],
        name: 'Soul Power',
        mcap: '1064575.257167817',
        symbol: 'SOUL',
        price: '0.01683739084210695',
        decimals: '18',
        supply: '75403135.2366155',
        stakedSoul: '26187309.54978503',

        totalReserveValue: '67566.22635571654',
        totalLiquidityValue: '126832.16187399688',
        totalValue: '346353.6601204894',

        SoulBalance: '7233516.685019771',
        NativeBalance: '29700.997381034977',
        NativeValue: '6517.022546344076',
        SoulValue: '83117.17095503045',
  
        NativeSoulValue: '52028.220989969974',
        SoulUsdcValue: '31843.071867637213',
        NativeEthereumValue: '5376.13666595582',
        UsdcDaiValue: '34342.85',
        NativeUsdcValue: '10205.771354582279',
        NativeBitcoinValueValue: '25834.553004332465',
        NativeDaiValue: '18916.06199394552',
        NativeBinanceValue: '12955.353761786479',
        NativeSeanceValue: '4700.715198538588',
        BitcoinEthereumValue: '0',

        api: "https://api.soulswap.finance/soulswap",
        image: 'https://raw.githubusercontent.com/soulswapfinance/assets/master/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png'
      })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/soulswap`,
         {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
           if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, soulInfo }
}

export function useBondInfo(): { status: string; bondInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [bondInfo, setInfo] = useState<T>({
        NativeSoulValue: '19800',
        SoulUsdcValue: '24383',
        NativeEthereumValue: '70575',
        UsdcDaiValue: '167461',
        NativeUsdcValue: '2446',
        NativeBitcoinValueValue: '23295',
        NativeDaiValue: '74995',
        NativeBinanceValue: '62984',
        NativeSeanceValue: '35920',
        totalLiquidityValue: '308017',
        totalValue: '308017',
        api: 'https://api.soulswap.finance/bonds'
      })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/bonds`,
         {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, bondInfo }
}

export function useSoulBondInfo(pid): { status: string; soulBondInfo: T } {
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [soulBondInfo, setInfo] = useState<T>({
      address: '',
      name: 'SoulSwap LP',
      symbol: 'SOUL-LP',
      token0: '',
      token1: '',
      token0Symbol: '',
      token1Symbol: '',
      decimals: '18',
      supply: '0',
      mcap: '0',
      tvl: '0',
      apr: '0',
      api: `https://${URL}/bonds/${pid}`
      })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/bonds/${pid}`,
         {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, soulBondInfo }
}

export function useBondUserInfo(pid, userAddress): { status: string; soulBondUserInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [soulBondUserInfo, setInfo] = useState<T>({
      address: '',
      name: 'SoulSwap LP',
      symbol: 'SOUL-LP',
      token0: '',
      token1: '',
      token0Symbol: '',
      token1Symbol: '',
      decimals: '18',
      supply: '0',
      mcap: '0',
      pairPrice: '0',
      pendingSoul: '0',
      userBalance: '0',
      stakedBalance: '0',
      userTvl: '0',
      tvl: '0',
      api: `https://${URL}/bonds/users/${userAddress}/${pid}`
      })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/bonds/users/${userAddress}/${pid}`,
         {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, soulBondUserInfo }
}

export function useTotalSupply(tokenAddress): { status: string; supply: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [supply, setSupply] = useState<T>()
    const URL = chainId == 250 ? BASE_URL : `${NATIVE[chainId].symbol.toLowerCase()}-api.soulswap.finance`
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/tokens/${tokenAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setSupply(json['supply'] as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, supply }
}

export function useTokenInfo(tokenAddress): { status: string; tokenInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
        const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [tokenInfo, setTokenInfo] = useState<T>({
        name: '',
        symbol: '',
        price: '0',
        luxorTreasuryBalance: '0',
        decimals: '18',
        supply: '0',
        mcap: '0',
        image: ''
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/tokens/${tokenAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setTokenInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, tokenInfo }
}

export function useUserInfo(): { status: string; userInfo: T } {
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`
 
    const [userInfo, setInfo] = useState<T>({
        address: '',
        nativeBalance: '0',
        votingPower: '0',
        protocolOwnership: '0',
        stakedBalance: '0'
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/users/${account}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, userInfo }
}

export function useUserTokenInfo(userAddress, tokenAddress): { status: string; userTokenInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [userTokenInfo, setInfo] = useState<T>({
        name: '',
        price: '0',
        value: '0',
        balance: '0',
        decimals: '18',
        supply: '0',
        mcap: '0',
        img:''
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/users/${userAddress}/${tokenAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, userTokenInfo }
}

export function useUserPairInfo(userAddress, pairAddress): { status: string; pairUserInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [pairUserInfo, setInfo] = useState<T>({
        name: '',
        address: '',
        lpPrice: '0',
        lpValue: '0',

        token0Address: '',
        token1Address: '',

        token0Decimals: '',
        token1Decimals: '',

        userBalance: '0',
        pairDecimals: '18',
        pairType: ''
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/pairs/${userAddress}/${pairAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, pairUserInfo }
}

export function useAutoStakeInfo(): { status: string; autoStakeInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [autoStakeInfo, setInfo] = useState<T>({
      totalSupply: '7975019.590004936',
      harvestRewards: '2.7874870645417755',
      soulTvl: '8407711.327837521',
      tvl: '63876.77321225582',
      apy: '42.08453254750358',
      pendingSoulRewards: '278.826990654351',
      pricePerShare: '1.054255884007467,',
      callFee: '100',
      bounty: '100',
      performanceFee: '500',
      withdrawFee: '0.01',
      withdrawFeePeriod: '259200',
      withdrawFeeHours: '72',
      soulPrice: '0.009753108589030435',
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/soulswap/vault`
        , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, autoStakeInfo }
}

export function useUserAutoStakeInfo(userAddress): { status: string; userAutoStakeInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [userAutoStakeInfo, setInfo] = useState<T>({
      userBalance: '0',
      stakedBalance: '0',
      totalSupply: '7975019.590004936',
      harvestRewards: '2.7874870645417755',
      soulTvl: '8407711.327837521',
      tvl: '63876.77321225582',
      pendingSoulRewards: '278.826990654351',
      pricePerShare: '1.054255884007467,',
      callFee: '100',
      bounty: '100',
      performanceFee: '500',
      withdrawFee: '0.01',
      withdrawFeePeriod: '259200',
      withdrawFeeHours: '72',
      soulPrice: '0.009753108589030435',
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/soulswap/vault/users/${userAddress}`
        , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, userAutoStakeInfo }
}

export function usePairInfo(pairAddress): { status: string; pairInfo: T } {
    const [status, setStatus] = useState<string>('idle')
    const { chainId } = useActiveWeb3React()
    const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

    const [pairInfo, setInfo] = useState<T>({
        address: '',
        name: '',
        symbol: '',
        pairDecimals: '18',
        pairType: 'swap',
        supply: '0',

        lpPrice: '0',
        lpValue: '0',

        token0Decimals: '18',
        token1Decimals: '18',

        token0Address: '',
        token1Address: '',

        token0Symbol: '',
        token1Symbol: '',

        token0Balance: '0',
        token1Balance: '0',

        token0Price: '0',
        token1Price: '0',

        luxorTreasuryBalance: '0',
        api: ''
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${URL}/pairs/${pairAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        setInfo(json as T)
        setStatus('fetched')
      }
      if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
      fetchData()
    }, [])
  
    return { status, pairInfo }
}

export function useSummonerInfo(): { status: string; summonerInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

  const [summonerInfo, setInfo] = useState<T>({
      address: '',
      tvl: '1000000',
      poolLength: '0',
      dailySoul: '0',
      soulPerSecond: '0',
      soulPerYear: '0',
      startRate: '0',
      totalAllocPoint: '0',
      weight: '0',
      weightTotal: '0',
      weightShare: '0',
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/summoner`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, summonerInfo }
}

export function useStakeInfo(userAddress): { status: string; stakeInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

  const [stakeInfo, setInfo] = useState<T>({
      tvl: '125000',
      stakedBalance: '0',
      stakedValue: '0',
      walletBalance: '0',
      apr: '30',
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/summoner/stake/users/${userAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, stakeInfo }
}

export function useSummonerPoolInfo(pid): { status: string; summonerPoolInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

  const [summonerPoolInfo, setInfo] = useState<T>({
      pid: '1',

      lpAddress: '',
      token0: '',
      token1: '',
      
      allocPoint: '0',
      allocShare: '0',

      status: '',
      pairType: '',

      token0Balance: '0',
      token1Balance: '0',
      lpBalance: '0',

      lpPrice: '0',
      annualRewardsValue: '0',

      tvl: '0',
      apr: '0'

  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/summoner/${pid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, summonerPoolInfo }
}

export function useSummonerUserInfo(pid): { status: string; summonerUserInfo: T } {
  const { account, chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

  const [summonerUserInfo, setInfo] = useState<T>({
      userAddress: account,
      pairAddress: '',
      walletBalance: '0',
      stakedBalance: '0',
      stakedValue: '0',
      pendingSoul: '0',
      pendingValue: '0',
      lpPrice: '0',

      userDelta: '0',
      timeDelta: '0',
      firstDepositTime: '0',
      lastDepositTime: '0',
      secondsRemaining: '0',
      rewardDebtAtTimes: '0',
      currentRate: '0',
      api: 'https://api.soulswap.finance',
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/summoner/users/${account}/${pid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, summonerUserInfo }
}

export function useDeFarmInfo(): { status: string; defarmInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

  const [defarmInfo, setInfo] = useState<T>({
    address: "0x31C180D7b37D82B3F8515C602620fe942B52Ec96",
    poolLength: "1",
    bloodSacrifice: "5000000000000000000"
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/defarm`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, defarmInfo }
}


export function useDeFarmPoolInfo(pid): { status: string; defarmPoolInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

  const [defarmPoolInfo, setInfo] = useState<T>({
    pid: '0',
    name: 'Manifest: RewardToken',
    symbol: 'TOKEN-FTM MP',
    rewardSymbol: 'TOKEN',
    logoURI: '',
    mAddress: '0xfE995046be5e26F00466b92DF4B8B947bB4422c5',
    lpAddress: '0xA905afF2dFAd9d3925D30c782ccbaE6423345917',
    rewardToken: '0x455783da1a4B349C3655b09747c62939e2493350',
    rewardRemaining: '100000000000000000000',
    status: 'active',
    pairType: 'farm',
    rewardPerSecond: '115740740740740',
    startTime: '0',
    endTime: '0',
    dailyReward: '10000000000000000000',
    feeDays: '4000000000000000000',
    token0: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    token1: '0x455783da1a4B349C3655b09747c62939e2493350',
    token0Balance: '1',
    token1Balance: '100',
    totalSupply: '10',
    lpBalance: '0',
    lpShare: '0',
    annualRewards: '3650',
    rewardsPrice: '0.002008373020980821',
    annualRewardsValue: '7.330561526579998',
    lpValue: '0.4069',
    lpPrice: '0.04069',
    tvl: '0',
    apr: '0'
  })
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/defarm/${pid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, defarmPoolInfo }
}

export function useDeFarmUserInfo(pid): { status: string; defarmUserInfo: T } {
  const { account, chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

  const [defarmUserInfo, setInfo] = useState<T>({
    userAddress: '0xFd63Bf84471Bc55DD9A83fdFA293CCBD27e1F4C8',
    name: 'Manifest: RewardToken',
    pairAddress:'0xA905afF2dFAd9d3925D30c782ccbaE6423345917',
    pendingRewards: '0',
    pendingValue: '0',
    stakedBalance: '0',
    walletBalance: '0',
    stakedValue: '0',
    lpPrice: '.04069',
    userDelta: '0',
    rewardDebt: '0',
    lastWithdrawTime: '0',
    firstDepositTime: '0',
    timeDelta: '0',
    secondsRemaining: '864000',
    currentRate: '0',
    startTime: '0',
    endTime: '0',
  })
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/defarm/users/${account}/${pid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, defarmUserInfo }
}

// LENDING API //

export function useUnderworldPairInfo(pairAddress): { status: string; underworldPairInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

  const [underworldPairInfo, setInfo] = useState<T>({
      address: '',
      name: '',
      symbol: '',
      supply: '1',
      decimals: '18',
      interestPerSecond: '0',
      lastAccrued: '1649306854',

      exchangeRate: '0',

      assetTicker: '',
      assetAddress: '',
      assetDecimals: '18',
      assetPrice: '1',
      assetLogoURI: '',

      assetTotalElastic: '0',
      assetTotalBase: '0',
      collateralTotalBase: '0',
      collateralTotalElastic: '0',
      
      collateralTicker: '',
      collateralAddress: '',
      collateralDecimals: '18',
      collateralPrice: '1',
      collateralLogoURI: '',

      api: ''
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/underworld/${pairAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, underworldPairInfo }
}

export function useUnderworldUserInfo(pairAddress): { status: string; underworldUserInfo: T } {
  const { account, chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const URL = chainId == ChainId.FANTOM ? BASE_URL : `https://avax-api.soulswap.finance`

  const [underworldUserInfo, setInfo] = useState<T>({
      name: '',
      assetAddress: '',
      collateralAddress: '',
      supply: '0',
      
      assetTicker: '',
      assetDecimals: '18',
      assetPrice: '0',
      
      collateralTicker: '',
      collateralDecimals: '18',
      collateralPrice: '0',

      userAssetBalance: '0',
      userCollateralBalance: '0',
      userBalance: '0',
      userBorrowPart: '0',
      userCollateralShare: '0',

      api: ''
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${URL}/underworld/users/${account}/${pairAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) 
    fetchData()
  }, [])

  return { status, underworldUserInfo }
}

// LUXOR API //
export function useLuxorBondInfo(bondAddress): { status: string; luxorBondInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [luxorBondInfo, setInfo] = useState<T>({
      name: '',
      asset: '',
      price: '0',
      status: '',
      discount: '0',
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${BASE_URL}/luxor/${bondAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if (chainId == ChainId.FANTOM) 
    fetchData()
  }, [])

  return { status, luxorBondInfo }
}

export function useLuxorInfo(): { status: string; luxorInfo: T } {
  const { account, chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [luxorInfo, setInfo] = useState<T>({
      name: '',
      price: '0',
      value: '0',
      epoch: '0',
      index: '0',
      nextRebase: '0',
      warmup: '4',
      circulatingLumens: '0',
      decimals: '9',
      supply: '0',
      stakingBalance: '0',
      warmupBalance: '0',
      reserveBalance: '0',
      mcap: '0',
      img:''
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${BASE_URL}/luxor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setInfo(json as T)
      setStatus('fetched')
    }
    if (chainId == ChainId.FANTOM) 
    fetchData()
  }, [])

  return { status, luxorInfo }
}

export function useLuxorUserInfo(userAddress): { status: string; luxorUserInfo: T } {
const { chainId } = useActiveWeb3React()
const [status, setStatus] = useState<string>('idle')
const [luxorUserInfo, setInfo] = useState<T>({
    address: '',
    epochLength: '0',
    nextRebase: '0',
    nextReward: '0',
    nextStakedReward: '0',
    nextWarmupReward: '0',
    userStaked: '0',
    userShare: '0',
    distribute: '0',
    vestingTerm: '0',
    warmupValue: '0',
    warmupExpiry: '0'

})  
useEffect(() => {
  const fetchData = async () => {
    setStatus('fetching')
    const response = await fetch(`${BASE_URL}/luxor/users/${userAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Referrer-Policy': 'no-referrer',
      },
    })
    const json = await response.json()
    setInfo(json as T)
    setStatus('fetched')
  }
  if (chainId == ChainId.FANTOM) 
  fetchData()
}, [])

return { status, luxorUserInfo }
}

// export function useSorInfo(): { status: string; sorInfo: T } {
//   const { chainId } = useActiveWeb3React()
//   const [status, setStatus] = useState<string>('idle')
//   const [sorInfo, setInfo] = useState<T>({
//       address: '',
//       supply: '0',
//       luxorTreasuryBalance: '0',
//       sorCollateral: '0',
//       sorFtmCollateral: '0',
//       daiCollateral: '0',
//       luxorCollateral: '0',
//       wlumCollateral: '0',
//       sorFtmCollateralValue: '0',
//       luxorCollateralValue: '0',
//       wlumCollateralValue: '0',
//       stableCollateral: '0',
//       collateralValue: '0',
//       collateralization: '0',
//       api: ''
//   })  
//   useEffect(() => {
//     const fetchData = async () => {
//       setStatus('fetching')
//       const response = await fetch(`${BASE_URL}/sor`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Referrer-Policy': 'no-referrer',
//         },
//       })
//       const json = await response.json()
//       setInfo(json as T)
//       setStatus('fetched')
//     }
//     if (chainId == ChainId.FANTOM) 
//     fetchData()
//   }, [])

//   return { status, sorInfo }
// }

// COFFINBOX API //

// export function useCoffinInfo(pairAddress): { status: string; coffinInfo: T } {
//     const { account, chainId } = useActiveWeb3React()
//     const [status, setStatus] = useState<string>('idle')
//     const [coffinInfo, setInfo] = useState<T>({
//         address: '',
//         supply: '0',
//         api: ''
//     })  
//     useEffect(() => {
//       const fetchData = async () => {
//         setStatus('fetching')
//         const response = await fetch(`${BASE_URL}/coffin/${pairAddress}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Referrer-Policy': 'no-referrer',
//           },
//         })
//         const json = await response.json()
//         setInfo(json as T)
//         setStatus('fetched')
//       }
//       if (chainId == ChainId.FANTOM) 
//       fetchData()
//     }, [])
  
//     return { status, coffinInfo }
// }