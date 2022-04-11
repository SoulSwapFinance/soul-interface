import { ChainId } from '../sdk'
import { useEffect, useState } from 'react'
import { ARCHER_GAS_URI, SOULSWAP_URI } from '../constants'
import { useActiveWeb3React } from 'services/web3'

type T = Record<string, string>

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
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_URL}/priceusd/${tokenAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        console.log('price:%s', json)
        setPrice(json as T)
        setStatus('fetched')
      }
      if (chainId == ChainId.FANTOM) 
      fetchData()
    }, [])
  
    return { status, price }
}

export function useLuxorBondInfo(bondAddress): { status: string; luxorBondInfo: T } {
    const { account, chainId } = useActiveWeb3React()
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
        circulatingLumens: '0',
        decimals: '18',
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
        distribute: '0',
        vestingTerm: '0',
        warmupExpiry: '0',

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

export function useTotalSupply(tokenAddress): { status: string; supply: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [supply, setSupply] = useState<T>()
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_URL}/tokens/${tokenAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
          },
        })
        const json = await response.json()
        console.log('supply:%s', json)
        setSupply(json['supply'] as T)
        setStatus('fetched')
      }
      if (chainId == ChainId.FANTOM) 
      fetchData()
    }, [])
  
    return { status, supply }
}

export function useTokenInfo(tokenAddress): { status: string; tokenInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [tokenInfo, setTokenInfo] = useState<T>({
        name: '',
        symbol: '',
        price: '0',
        luxorTreasuryBalance: '0',
        decimals: '18',
        supply: '0',
        mcap: '0',
        img: ''
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_URL}/tokens/${tokenAddress}`, {
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
      if (chainId == ChainId.FANTOM) 
      fetchData()
    }, [])
  
    return { status, tokenInfo }
}

// export function useLuxorTreasuryInfo(): { status: string; luxorTreasuryData: T } {
//     const { account, chainId } = useActiveWeb3React()
//     const [status, setStatus] = useState<string>('idle')
//     const [luxorTreasuryData, setInfo] = useState<T>({
//         ftmBalance: '0',
//         daiBalance: '0',
        
//         luxFtmBalance: '0',
//         luxDaiBalance: '0',
        
//         ftmDaiBalance: '0',
//         ftmWlumBalance: '0',
        
//         ftmLendBalance: '0',
//         daiLendBalance: '0',
        
//     })  
//     useEffect(() => {
//       const fetchData = async () => {
//         setStatus('fetching')
//         const response = await fetch(`${BASE_URL}/luxor/treasury`, {
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
  
//     return { status, luxorTreasuryData }
// }

export function useUserInfo(user, tokenAddress): { status: string; userInfo: T } {
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [userInfo, setInfo] = useState<T>({
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
        const response = await fetch(`${BASE_URL}/users/${user}/${tokenAddress}`, {
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
  
    return { status, userInfo }
}

export function usePairInfo(pairAddress): { status: string; pairInfo: T } {
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
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
        const response = await fetch(`${BASE_URL}/pairs/${pairAddress}`, {
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
  
    return { status, pairInfo }
}

// WIP //
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

export function useUnderworldPairInfo(pairAddress): { status: string; underworldPairInfo: T } {
    // const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [underworldPairInfo, setInfo] = useState<T>({
        address: '',
        name: '',
        symbol: '',
        supply: '0',
        decimals: '18',
        interestPerSecond: '0',
        lastAccrued: '1649306854',

        exchangeRate: '0',

        assetTicker: '',
        assetAddress: '',
        assetDecimals: '18',
        assetPrice: '0',
        assetLogoURI: '',

        assetTotalElastic: '0',
        assetTotalBase: '0',
        collateralTotalBase: '0',
        collateralTotalElastic: '0',
        
        collateralTicker: '',
        collateralAddress: '',
        collateralDecimals: '18',
        collateralPrice: '0',
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
      // if (chainId == ChainId.FANTOM) 
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

export function useSorInfo(): { status: string; sorInfo: T } {
    const { chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [sorInfo, setInfo] = useState<T>({
        address: '',
        supply: '0',
        treasuryBalance: '0',
        sorCollateral: '0',
        daiCollateral: '0',
        luxorCollateral: '0',
        luxorCollateralValue: '0',
        stableCollateral: '0',
        collateralValue: '0',
        collateralization: '0',
        api: ''
    })  
    useEffect(() => {
      const fetchData = async () => {
        setStatus('fetching')
        const response = await fetch(`${BASE_URL}/sor}`, {
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

export function useSummonerInfo(): { status: string; summonerInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [summonerInfo, setInfo] = useState<T>({
      address: '',
      dailySoul: '0',
      soulPerSecond: '0',
      soulPerYear: '0',
      startRate: '0',
      totalAllocPoint: '0',
      weight: '0',
      weightTotal: '0',
      weightShare: '0',
      api: 'https://api.soulswap.finance',
      ftmscan: 'https://ftmscan.com',
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${BASE_URL}/summoner`, {
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

  return { status, summonerInfo }
}

export function useSummonerPoolInfo(pid): { status: string; summonerPoolInfo: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [summonerPoolInfo, setInfo] = useState<T>({
      pid: '',

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
      apr: '0',
     
      api: 'https://api.soulswap.finance',
      ftmscan: 'https://ftmscan.com',
  })  
  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      const response = await fetch(`${BASE_URL}/summoner/${pid}`, {
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

  return { status, summonerPoolInfo }
}

export function useSummonerUserInfo(pid): { status: string; summonerUserInfo: T } {
  const { account, chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle')
  const [summonerUserInfo, setInfo] = useState<T>({
      userAddress: account,
      pairAddress: '',
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
      const response = await fetch(`${BASE_URL}/summoner/users/${account}/${pid}`, {
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

  return { status, summonerUserInfo }
}