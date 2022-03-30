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
        treasuryBalance: '0',
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
        treasuryBalance: '0',
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
        supply: '0',
        treasuryBalance: '0',
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
    const { account, chainId } = useActiveWeb3React()
    const [status, setStatus] = useState<string>('idle')
    const [underworldPairInfo, setInfo] = useState<T>({
        address: '',
        name: '',
        symbol: '',
        supply: '0',
        decimals: '',

        exchangeRate: '0',
        assetAddress: '',
        assetDecimals: '0',

        collateralAddress: '',
        collateralDecimals: '18',
        collateralPrice: '0',

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

// export function useUnderworldUserInfo(pairAddress): { status: string; userInfo: T } {
//     const { account, chainId } = useActiveWeb3React()
//     const [status, setStatus] = useState<string>('idle')
//     const [userInfo, setInfo] = useState<T>({
//         name: '',
//         assetAddress: '0',
//         api: ''
//     })  
//     useEffect(() => {
//       const fetchData = async () => {
//         setStatus('fetching')
//         const response = await fetch(`${BASE_URL}/underworld/users/${account}/${pairAddress}`, {
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
  
//     return { status, userInfo }
// }

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
