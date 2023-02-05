import { BigNumber } from '@ethersproject/bignumber'
// import InputCurrencyBox from 'components/Bridge/InputCurrencyBox'
import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import { useActiveWeb3React } from "services/web3"
import Row from "../../components/Row"
import InputError from "components/Input/Error"
import { weiToUnit } from "../../utils/conversion"
import { chainToNetworkInfoMap } from "../../utils/bridge"
import BridgeTokenSelect from './BridgeTokenSelect'
// import CurrencyInputPanel from 'components/CurrencyInputPanel'
// import AssetInput from 'components/AssetInput'
// import { SOUL, Token, USDC, WNATIVE } from 'sdk'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'

const BridgeTokenList: React.FC<any> = ({
    tokenList,
    fromChain,
    toChain,
    setSelectedToken,
    amount,
    setAmount,
    inputError,
    isBridgeTxCompleted,
  }) => {
    const { account, chainId } = useActiveWeb3React()
    const [token, setToken] = useState(null)
    // const [currency, setCurrency] = useState(null)
    const [fromTokenBalance, setFromTokenBalance] = useState(null)
    const [toTokenBalance, setToTokenBalance] = useState(null)

    // const currency = token ? new Token(chainId, token?.address, token?.decimals) : SOUL[chainId]
  
    const handleSetToken = async (value: any) => {
      setFromTokenBalance(null)
      setToTokenBalance(null)
      await setToken(value)
    }
  
    useEffect(() => {
      if (tokenList && tokenList.length) {
        setFromTokenBalance(null)
        setToTokenBalance(null)
        return setToken(tokenList[0])
      }
    }, [tokenList])
  
    useEffect(() => {
      setSelectedToken(token)
      setAmount("")
  
      if (token) {
        Promise.all([token.balance, token.balanceTo]).then(
          ([fromBalance, toBalance]) => {
            setFromTokenBalance(fromBalance || BigNumber.from(0))
            setToTokenBalance(toBalance || BigNumber.from(0))
            setSelectedToken({
              ...token,
            })
          }
        )
        return;
      }
    }, [token, account, isBridgeTxCompleted])
  
    return (
      <div className="grid justify-center">
        <Row style={{ gap: "1rem" }}>
          <Row style={{ flex: 2, paddingLeft: "1rem" }}>
            {inputError ? (
              <InputError error={inputError} fontSize="14px" />
            ) : (
              <div />
            )}
          </Row>
        </Row>
        <div />
        
          <div className={`grid grid-cols-1 gap-1 mt-2 mb-2 rounded w-full`}>
            <BridgeTokenSelect
              tokens={tokenList}
              selected={token}
              selectToken={handleSetToken}
              toChain={toChain}
            />
            <div style={{ flex: 2 }} className="mt-1">
              {/* <InputCurrencyBox
                disabled={!token}
                value={amount}
                setValue={setAmount}
                max={
                  token && fromTokenBalance
                    ? weiToUnit(fromTokenBalance, token?.Decimals)
                    : 0
                }
                variant="new"
              /> */}
              <SwapAssetPanel
                chainId={chainId}
                value={amount}
                onChange={setAmount}
                header={() => ''}
                hideBalance={true}
                // currencyAddress={token?.address}
                // currencySymbol={token?.symbol}
                // currencyDecimals={token?.decimals}
                // currency={currency}
                //   showCurrencySelect={false}
                //   onUserInput={setAmount}
                //   fiatValue={fiatValueDesiredRate ?? undefined}
                //   onCurrencySelect={handleInputSelect}
                  // otherCurrency={currencyB}
                //   showCommonBases={false}
                //   id=""
                //   disableCurrencySelect={true}
                //   hideBalance={true}
                //   label={``
                    // trade &&
                    // trade && rateType === Rate.MUL ? `≈ ${formatNumber(formattedAmounts.price, false, true)} (${currencyB.symbol})`
                    // : trade && rateType === Rate.MUL ? `≈ ${formatNumber(formattedAmounts.price, false, true)} (${currencyA.symbol})`
                    // : 
                    // `1 ${currencyA?.symbol} ≈ ${formatNumber(formattedAmounts.price)} ${currencyB?.symbol}`
                    // ? `${currencyA.symbol} ≈ ${Number(formattedAmounts.price).toFixed(2)} ${currencyB.symbol}`
                    // ? `≈ ${(1 / Number(formattedAmounts.price)).toFixed(4)} (${currencyB.symbol})`
                    // : `≈ ${(1 / Number(formattedAmounts.price)).toFixed(4)} (${currencyA.symbol})`
                    // : `${currencyB.symbol} : ${currencyA.symbol}`

                //   }
                />
            </div>
        </div>
  
        {/* <div className="my-2" /> */}
  
        <div className="flex justify-between">
          <Typography className="text-white" fontFamily={'medium'}>
            {`${chainToNetworkInfoMap[fromChain].name} Balance`}
          </Typography>
          <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
            {token && fromTokenBalance
              ? ` ${weiToUnit(fromTokenBalance, token?.decimals) + ' ' + token?.symbol}`
              : "-"}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography className="text-white" fontFamily={'medium'}>
              {`${chainToNetworkInfoMap[toChain].name} Balance`}
          </Typography>
          <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
            {token && toTokenBalance
              ? ` ${weiToUnit(toTokenBalance, token?.decimals) + ' ' + token?.symbol}`
              : "-"}
          </Typography>
        </div>
      </div>
    )
  }

  export default BridgeTokenList