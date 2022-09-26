import { ChainId, NATIVE, SOUL_ADDRESS } from '../sdk'
import { useEffect, useState } from 'react'
import { ARCHER_GAS_URI, SOULSWAP_URI } from '../constants'
import { useActiveWeb3React } from 'services/web3'

type T = Record<string, string>

// function getBaseUrl() {
//   const { chainId } = useActiveWeb3React()
//   chainId == 250 ? 'https://api.soulswap.finance' : 'https://avax-api.soulswap.finance'
// }

const BASE_URL = 'https://api.soulswap.finance'

export function useArcherMinerTips(): { status: string; data: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [data, setData] = useState<T>({
    immediate: '2000000000000',
    rapid: '800000000000',
    fast: '300000000000',
    standard: '140000000000',
    slow: '100000000000',
    slower: '70000000000',
    slowest: '60000000000',
  })

  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(ARCHER_GAS_URI[ChainId.ETHEREUM], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referrer-Policy': 'no-referrer',
        },
      })
      const json = await response.json()
      setData(json.data as T)
      setStatus('fetched')
    }
    if (chainId == ChainId.FANTOM) 
    fetchData()
  }, [])

  return { status, data }
}

export function usePriceUSD(tokenAddress): { status: string; price: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [price, setPrice] = useState<T>()
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`
  
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
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
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
        ftmscan: `https://ftmscan.com/address/${SOUL_ADDRESS[chainId]}#code`,
        image: 'https://raw.githubusercontent.com/soulswapfinance/assets/master/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png'
      })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_URL}/soulswap`,
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
      if (chainId == ChainId.FANTOM) 
      fetchData()
    }, [])
  
    return { status, soulInfo }
}

export function useBondInfo(): { status: string; bondInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

    const [bondInfo, setInfo] = useState<T>({
        NativeSoulValue: '63800.05964972323',
        SoulUsdcValue: '46383.88976770467',
        NativeEthereumValue: '70575.55193664419',
        UsdcDaiValue: '167461.74443822587',
        NativeUsdcValue: '58807.66686062403',
        NativeBitcoinValueValue: '85187.16125864044',
        NativeDaiValue: '74995.03629181904',
        NativeBinanceValue: '62984.619936168485',
        NativeSeanceValue: '35920.55519306462',
        totalLiquidityValue: '666116.2853326146',
        totalValue: '666116.2853326146',
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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
        const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`
 
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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`
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
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
    const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
      ftmscan: 'https://ftmscan.com',
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
      ftmscan: 'https://ftmscan.com',
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
  const URL = chainId == 250 ? BASE_URL : `https://avax-api.soulswap.finance`

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
      ftmscan: 'https://ftmscan.com',
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

// LENDING API //

export function useUnderworldPairInfo(pairAddress): { status: string; underworldPairInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
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
      const response = await fetch(`${BASE_URL}/underworld/${pairAddress}`, {
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

  return { status, underworldPairInfo }
}

export function useUnderworldUserInfo(pairAddress): { status: string; underworldUserInfo: T } {
  const { account, chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
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
      userBalance: '0',
      userBorrowPart: '0',
      userCollateralShare: '0',
      
      api: ''
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${BASE_URL}/underworld/users/${account}/${pairAddress}`, {
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

export function useSorInfo(): { status: string; sorInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [sorInfo, setInfo] = useState<T>({
      address: '',
      supply: '0',
      luxorTreasuryBalance: '0',
      sorCollateral: '0',
      sorFtmCollateral: '0',
      daiCollateral: '0',
      luxorCollateral: '0',
      wlumCollateral: '0',
      sorFtmCollateralValue: '0',
      luxorCollateralValue: '0',
      wlumCollateralValue: '0',
      stableCollateral: '0',
      collateralValue: '0',
      collateralization: '0',
      api: ''
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${BASE_URL}/sor`, {
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

  return { status, sorInfo }
}

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