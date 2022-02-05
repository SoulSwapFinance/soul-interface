import { ChainId, CurrencyAmount, Token } from '../sdk'
import { useSoulGuideContract, useDashboardContract, useFactoryContract } from '../hooks/useContract'
import { useCallback, useEffect, useRef, useState } from 'react'

import LPToken from '../types/LPToken'
import { getAddress } from '@ethersproject/address'
import { useActiveWeb3React } from 'services/web3'

export interface LPTokensState {
  updateLPTokens: () => Promise<void>
  lpTokens: LPToken[]
  selectedLPToken?: LPToken
  setSelectedLPToken: (token?: LPToken) => void
  selectedLPTokenAllowed: boolean
  setSelectedLPTokenAllowed: (allowed: boolean) => void
  loading: boolean
  updatingLPTokens: boolean
}

const useLPTokensState = () => {
  const { account, chainId } = useActiveWeb3React()
  const soulGuideContract = useSoulGuideContract()
  const dashboardContract = useDashboardContract()
  const soulSwapFactoryContract = useFactoryContract()
  const [lpTokens, setLPTokens] = useState<LPToken[]>([])
  const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
  const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const updatingLPTokens = useRef(false)
  const updateLPTokens = useCallback(async () => {
    try {
      updatingLPTokens.current = true
      if (ChainId.FANTOM === chainId) {
        const LP_TOKENS_LIMIT = 500
        const length = await soulSwapFactoryContract?.totalPairs()
        const pages: number[] = []
        for (let i = 0; i < length; i += LP_TOKENS_LIMIT) pages.push(i)
        const pairs = (
          await Promise.all(
            pages.map((page) =>
              soulGuideContract?.getPairs(
                '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF', // Factory address
                page,
                Math.min(page + LP_TOKENS_LIMIT, length.toNumber())
              )
            )
          )
        )
          .flat()
          .filter((pair) => pair.token0 !== '')

        const pairAddresses = pairs.map((pair) => pair[0])
        const pollPairs = await soulGuideContract?.pollPairs(account, pairAddresses)
        const tokenAddresses = Array.from(
          new Set(pairs.reduce((a: any, b: any) => a.push(b.token, b.token0, b.token1) && a, []))
        ).flat()
        const tokenDetails = (await soulGuideContract?.getTokenInfo(tokenAddresses)).reduce((acc: any, cur: any) => {
          acc[cur[0]] = cur
          return acc
        }, {})

        const data = pairs.map((pair, index) => {
          const token = new Token(
            chainId as ChainId,
            tokenDetails[pair.token].token,
            tokenDetails[pair.token].decimals,
            tokenDetails[pair.token].symbol,
            tokenDetails[pair.token].name
          )

          const tokenA = tokenDetails[pair.token0]
          const tokenB = tokenDetails[pair.token1]

          return {
            address: token.address,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
            balance: CurrencyAmount.fromRawAmount(token, pollPairs[index].balance),
            totalSupply: pair.totalSupply,
            tokenA: new Token(chainId as ChainId, tokenA.token, tokenA.decimals, tokenA.symbol, tokenA.name),
            tokenB: new Token(chainId as ChainId, tokenB.token, tokenB.decimals, tokenB.symbol, tokenB.name),
          } as LPToken
        })

        if (data) setLPTokens(data)

        // MAINNET
      } else 
      if (chainId && [ChainId.ETHEREUM].includes(chainId)) {
        const requests: any = {
          [ChainId.ETHEREUM]: [
            `https://api.covalenthq.com/v1/${ChainId.ETHEREUM}/address/${String(
              account
            ).toLowerCase()}/stacks/uniswap_v2/balances/?key=ckey_cba3674f2ce5450f9d5dd290589`,
          ],
        }

        const responses: any = await Promise.all(requests[chainId].map((request: any) => fetch(request)))

        let userLP = []

        if (chainId === ChainId.ETHEREUM) {
          const { data } = await responses[0].json()
          userLP = data?.['uniswap_v2']?.balances
            ?.filter((balance: any) => balance.pool_token.balance !== '0')
            .map((balance: any) => ({
              ...balance,
              version: 'v2',
            }))
        }

        const tokenDetails = (
          await dashboardContract?.getTokenInfo(
            Array.from(
              new Set(
                userLP?.reduce(
                  (a: any, b: any) =>
                    a.push(b.pool_token.contract_address, b.token_0.contract_address, b.token_1.contract_address) && a,
                  []
                )
              )
            )
          )
        )?.reduce((acc: any, cur: any) => {
          acc[cur[0]] = cur
          return acc
        }, {})

        const lpTokens = userLP?.map((pair: any, index: number) => {
          const token = new Token(
            chainId as ChainId,
            getAddress(pair.pool_token.contract_address),
            tokenDetails[getAddress(pair.pool_token.contract_address)].decimals,
            tokenDetails[getAddress(pair.pool_token.contract_address)].symbol,
            tokenDetails[getAddress(pair.pool_token.contract_address)].name
          )
          const tokenA = tokenDetails[getAddress(pair.token_0.contract_address)]
          const tokenB = tokenDetails[getAddress(pair.token_1.contract_address)]

          return {
            address: getAddress(pair.pool_token.contract_address),
            decimals: token.decimals,
            name: `${tokenA.symbol}-${tokenB.symbol} LP Token`,
            symbol: `${tokenA.symbol}-${tokenB.symbol}`,
            balance: CurrencyAmount.fromRawAmount(token, pair.pool_token.balance),
            totalSupply: pair.pool_token.total_supply,
            tokenA: new Token(chainId as ChainId, tokenA.token, tokenA.decimals, tokenA.symbol, tokenA.name),
            tokenB: new Token(chainId as ChainId, tokenB.token, tokenB.decimals, tokenB.symbol, tokenB.name),
            version: pair.version,
          } as LPToken
        })
        if (lpTokens) {
          setLPTokens(lpTokens)
        }
      }
    } finally {
      setLoading(false)
      updatingLPTokens.current = false
    }
  }, [chainId, account, dashboardContract])

  useEffect(() => {
    if (chainId && account && soulGuideContract && !updatingLPTokens.current) {
      updateLPTokens()
    }
  }, [account, chainId, soulGuideContract, updateLPTokens])

  return {
    updateLPTokens,
    lpTokens,
    selectedLPToken,
    setSelectedLPToken,
    selectedLPTokenAllowed,
    setSelectedLPTokenAllowed,
    loading,
    updatingLPTokens: updatingLPTokens.current,
  }
}

export default useLPTokensState
