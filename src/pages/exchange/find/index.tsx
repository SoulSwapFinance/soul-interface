import { Currency, CurrencyAmount, Ether, JSBI, NATIVE, Token } from '../../../sdk'
import { PairState, useV2Pair } from '../../../hooks/useV2Pairs'
import React, { useCallback, useEffect, useState } from 'react'

import { AutoColumn } from '../../../components/Column'
import { AutoRow } from '../../../components/Row'
import Container from '../../../components/Container'
import CurrencySelectPanel from '../../../components/CurrencySelectPanel'
import Dots from '../../../components/Dots'
// import { ExtendedEther } from '../../../constants'
// import { FindPoolTabs } from '../../../components/NavigationTabs'
import Head from 'next/head'
import Link from 'next/link'
import { MinimalPositionCard } from '../../../components/PositionCard'
import { Plus } from 'react-feather'
import Typography from '../../../components/Typography'
import { currencyId } from '../../../functions/currency'
import { useActiveWeb3React } from 'services/web3'
import { usePairAdder } from '../../../state/user/hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
// import Image from 'next/image'
import DoubleGlowShadowV2 from '../../../components/DoubleGlowShadowV2'
import SwapDropdown from 'features/swap/SwapDropdown'
import { SwapLayoutCard } from 'layouts/SwapLayout'
import { useRouter } from 'next/router'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { Button } from 'components/Button'
// import SoulLogo from '../../../components/SoulLogo'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React()
  const router = useRouter()
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(() => (chainId ? NATIVE[chainId] : null))
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
      pair &&
      JSBI.equal(pair.reserve0.quotient, JSBI.BigInt(0)) &&
      JSBI.equal(pair.reserve1.quotient, JSBI.BigInt(0))
    )

  const position: CurrencyAmount<Token> | undefined = useTokenBalance(chainId, account ?? undefined, pair?.liquidityToken)

  const hasPosition = Boolean(position && JSBI.greaterThan(position.quotient, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleLink = useCallback(
    (url: string) => {
        router.push(url)
      },[]
  )

  const prerequisiteMessage = (
    <div className="p-5 text-center rounded bg-dark-800">{`Select Token to Import Position`}</div>
  )

  return (
    <Container maxWidth="2xl" className="space-y-6 mt-4">
      <Head>
        <title>{`Find Pool`} | Soul</title>
        <meta key="description" name="description" content="Find Pool" />
      </Head>
      <DoubleGlowShadowV2 opacity="0.6">
        <div className="p-0 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
          <SwapLayoutCard>
          <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>
            <SwapDropdown />
          <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>
            <AutoColumn gap={'md'}>
              <CurrencySelectPanel
                currency={currency0}
                onClick={() => setActiveField(Fields.TOKEN0)}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={currency1}
                id="pool-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                  <button className="z-10 -mt-6 -mb-6 rounded-full bg-dark-900 p-3px">
                    <div className="p-3 rounded-full bg-dark-800 hover:bg-dark-700">
                      <Plus size="18" />
                    </div>
                  </button>
                </AutoRow>
              </AutoColumn>
              <CurrencySelectPanel
                currency={currency1}
                onClick={() => setActiveField(Fields.TOKEN1)}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={currency0}
                id="pool-currency-output"
              />
            </AutoColumn>

            {hasPosition && (
              <AutoRow
                style={{
                  justifyItems: 'center',
                  backgroundColor: '',
                  padding: '12px 0px',
                  borderRadius: '12px',
                }}
                justify={'center'}
                gap={'0 3px'}
              >
                {/* {`Pool Found!`} */}
                <Typography
                  className={`flex border border-[${getChainColor(chainId)}] p-3 rounded rounded-xl w-full justify-center text-xl bg-${getChainColorCode(chainId)}`}
                  onClick={() => handleLink('/pool')}
                >
                  <a className={`text-center font-bold`}>{`Manage Position`}</a>
                </Typography>
              </AutoRow>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard chainId={chainId} pair={pair} border="1px solid #CED0D9" />
                ) : (
                  <div className="p-5 rounded bg-dark-800">
                    <AutoColumn gap="sm" justify="center">
                      {`You don’t have liquidity in this pool yet`}
                      <Link href={`/exchange/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                        <a className="text-center text-purple text-opacity-80 hover:text-opacity-100">
                          {`Add Liquidity`}
                        </a>
                      </Link>
                    </AutoColumn>
                  </div>
                )
              ) : validPairNoLiquidity ? (
                <div className="p-5 rounded bg-dark-800">
                  <AutoColumn gap="sm" justify="center">
                    {`No pool found`}
                    <Link href={`/exchange/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      <a className="text-center">{`Create Pool`}</a>
                    </Link>
                  </AutoColumn>
                </div>
              ) : pairState === PairState.INVALID ? (
                <div className="p-5 text-center rounded bg-dark-800">{`Invalid pair`}</div>
              ) : pairState === PairState.LOADING ? (
                <div className="p-5 text-center rounded bg-dark-800">
                  <Dots>{`Loading`}</Dots>
                </div>
              ) : null
            ) : !account ? (
              // <Web3Connect className="w-full" size="lg" color="blue" />
              <Button 
              size="lg" color="avaxRed" className="w-full" 
              disabled
            >
              { `Connect Wallet` }
            </Button>
            ) : 
            (
              prerequisiteMessage
            )}
          </SwapLayoutCard>
        </div>
      </DoubleGlowShadowV2>
    </Container>
  )
}
