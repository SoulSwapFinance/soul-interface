import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Plus } from 'react-feather'
import { RowBetween } from 'components/Row'
import { ButtonConfirmed, ButtonError } from 'components/Button'
import { ChainId, NATIVE, Percent, WNATIVE } from 'sdk'
import React, { useCallback, useMemo, useState } from 'react'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'modals/TransactionConfirmationModal'
import { calculateGasMargin, calculateSlippageAmount } from 'functions/trade'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/burn/hooks'
import { usePairContract, useRouterContract } from 'hooks/useContract'
import NavLink from 'components/NavLink'
import { AutoColumn } from 'components/Column'
import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'components/Button'
import { Contract } from '@ethersproject/contracts'
import { CurrencyLogo } from 'components/CurrencyLogo'
import Dots from 'components/Dots'
import { Field } from 'state/burn/actions'
import Head from 'next/head'
import Link from 'next/link'
import LiquidityHeader from 'features/liquidity/LiquidityHeader'
import { MinimalPositionCard } from 'components/PositionCard'
import PercentInputPanel from 'components/PercentInputPanel'
import ReactGA from 'react-ga'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from 'services/web3'
import { useCurrency } from 'hooks/Tokens'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import { useDerivedMintInfo } from 'state/mint/hooks'
import { useRouter } from 'next/router'
import { useTransactionAdder } from 'state/transactions/hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { useV2LiquidityTokenPermit } from 'hooks/useERC20Permit'
import { useWalletModalToggle } from 'state/application/hooks'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { classNames, featureEnabled } from 'functions'
import { getChainColorCode } from 'constants/chains'
import SwapDropdown from 'features/swap/SwapDropdown'
import { PoolBalances } from 'features/portfolio/AssetBalances/pools'
import { Feature } from 'enums'
import PairChart from 'pages/analytics/pairs/embedded/[id]'
import { CustomBanner } from 'components/Banner'
// import { MultichainBanner } from 'components/Banner'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(10, 1000) // 1%

export default function Remove() {
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = tokens || [undefined, undefined]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { price } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE)

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
        ? '<1'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // router contract
  const routerContract = useRouterContract()

  // allowance handling
  const { gatherPermitSignature, signatureData } = useV2LiquidityTokenPermit(
    parsedAmounts[Field.LIQUIDITY],
    routerContract?.address
  )
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], routerContract?.address)

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    // if (false && gatherPermitSignature) {
    if (gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !library || !account || !deadline || !router) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB == NATIVE[chainId ?? ChainId.FANTOM] // isNative
    const oneCurrencyIsETH = currencyA == NATIVE[chainId ?? ChainId.FANTOM] || currencyBIsETH

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    // const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
    //   methodNames.map((methodName) =>
    //     routerContract.estimateGas[methodName](...args)
    //       .then(calculateGasMargin)
    //       .catch((error) => {
    //         console.error(`estimateGas failed`, methodName, args, error)
    //         return BigNumber.from('1000000')
    //       })
    //   )
    // )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencyA?.symbol
              } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)
        })
    }
  }

  // const isArgentWallet = useIsArgentWallet();

  // async function onAttemptToApprove() {
  //   if (!pairContract || !pair || !library || !deadline)
  //     throw new Error("missing dependencies");
  //   const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
  //   if (!liquidityAmount) throw new Error("missing liquidity amount");

  //   if (isArgentWallet) {
  //     return approveCallback();
  //   }

  //   if (chainId !== ChainId.HARMONY) {
  //     // try to gather a signature for permission
  //     const nonce = await pairContract.nonces(account);

  //     const EIP712Domain = [
  //       { name: "name", type: "string" },
  //       { name: "version", type: "string" },
  //       { name: "chainId", type: "uint256" },
  //       { name: "verifyingContract", type: "address" },
  //     ];
  //     const domain = {
  //       name: "SoulSwap LP Token",
  //       version: "1",
  //       chainId: chainId,
  //       verifyingContract: pair.liquidityToken.address,
  //     };
  //     const Permit = [
  //       { name: "owner", type: "address" },
  //       { name: "spender", type: "address" },
  //       { name: "value", type: "uint256" },
  //       { name: "nonce", type: "uint256" },
  //       { name: "deadline", type: "uint256" },
  //     ];
  //     const message = {
  //       owner: account,
  //       spender: getRouterAddress(chainId),
  //       value: liquidityAmount.raw.toString(),
  //       nonce: nonce.toHexString(),
  //       deadline: deadline.toNumber(),
  //     };
  //     const data = JSON.stringify({
  //       types: {
  //         EIP712Domain,
  //         Permit,
  //       },
  //       domain,
  //       primaryType: "Permit",
  //       message,
  //     });

  //     library
  //       .send("eth_signTypedData_v4", [account, data])
  //       .then(splitSignature)
  //       .then((signature) => {
  //         setSignatureData({
  //           v: signature.v,
  //           r: signature.r,
  //           s: signature.s,
  //           deadline: deadline.toNumber(),
  //         });
  //       })
  //       .catch((error) => {
  //         // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
  //         if (error?.code !== 4001) {
  //           approveCallback();
  //         }
  //       });
  //   } else {
  //     return approveCallback();
  //   }
  // }

  // // wrapped onUserInput to clear signatures
  // const onUserInput = useCallback(
  //   (field: Field, typedValue: string) => {
  //     setSignatureData(null);
  //     return _onUserInput(field, typedValue);
  //   },
  //   [_onUserInput]
  // );

  // const onLiquidityPercentInput = useCallback(
  //   (typedValue: string): void =>
  //     onUserInput(Field.LIQUIDITY_PERCENT, typedValue),
  //   [onUserInput]
  // );
  // const onLiquidityInput = useCallback(
  //   (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
  //   [onUserInput]
  // );
  // const onCurrencyAInput = useCallback(
  //   (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
  //   [onUserInput]
  // );
  // const onCurrencyBInput = useCallback(
  //   (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
  //   [onUserInput]
  // );

  // // tx sending
  // const addTransaction = useTransactionAdder();
  // async function onRemove() {
  //   if (!chainId || !library || !account || !deadline)
  //     throw new Error("missing dependencies");
  //   const {
  //     [Field.CURRENCY_A]: currencyAmountA,
  //     [Field.CURRENCY_B]: currencyAmountB,
  //   } = parsedAmounts;
  //   if (!currencyAmountA || !currencyAmountB) {
  //     throw new Error("missing currency amounts");
  //   }
  //   const router = getRouterContract(chainId, library, account);

  //   const amountsMin = {
  //     [Field.CURRENCY_A]: calculateSlippageAmount(
  //       currencyAmountA,
  //       allowedSlippage
  //     )[0],
  //     [Field.CURRENCY_B]: calculateSlippageAmount(
  //       currencyAmountB,
  //       allowedSlippage
  //     )[0],
  //   };

  //   if (!currencyA || !currencyB) throw new Error("missing tokens");
  //   const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
  //   if (!liquidityAmount) throw new Error("missing liquidity amount");

  //   const currencyBIsETH = currencyB === Currency.getNativeCurrency(chainId);
  //   const oneCurrencyIsETH =
  //     currencyA === Currency.getNativeCurrency(chainId) || currencyBIsETH;

  //   if (!tokenA || !tokenB) throw new Error("could not wrap");

  //   let methodNames: string[];
  //   let args: Array<string | string[] | number | boolean>;
  //   // we have approval, use normal remove liquidity
  //   if (approval === ApprovalState.APPROVED) {
  //     // removeLiquidityETH
  //     if (oneCurrencyIsETH && ![ChainId.CELO].includes(chainId)) {
  //       methodNames = [
  //         "removeLiquidityETH",
  //         "removeLiquidityETHSupportingFeeOnTransferTokens",
  //       ];
  //       args = [
  //         currencyBIsETH ? tokenA.address : tokenB.address,
  //         liquidityAmount.raw.toString(),
  //         amountsMin[
  //           currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
  //         ].toString(),
  //         amountsMin[
  //           currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
  //         ].toString(),
  //         account,
  //         deadline.toHexString(),
  //       ];
  //     }
  //     // removeLiquidity
  //     else {
  //       methodNames = ["removeLiquidity"];
  //       args = [
  //         tokenA.address,
  //         tokenB.address,
  //         liquidityAmount.raw.toString(),
  //         amountsMin[Field.CURRENCY_A].toString(),
  //         amountsMin[Field.CURRENCY_B].toString(),
  //         account,
  //         deadline.toHexString(),
  //       ];
  //     }
  //   }
  //   // we have a signataure, use permit versions of remove liquidity
  //   else if (signatureData !== null) {
  //     // removeLiquidityETHWithPermit
  //     if (oneCurrencyIsETH && ![ChainId.CELO].includes(chainId)) {
  //       methodNames = [
  //         "removeLiquidityETHWithPermit",
  //         "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
  //       ];
  //       args = [
  //         currencyBIsETH ? tokenA.address : tokenB.address,
  //         liquidityAmount.raw.toString(),
  //         amountsMin[
  //           currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
  //         ].toString(),
  //         amountsMin[
  //           currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
  //         ].toString(),
  //         account,
  //         signatureData.deadline,
  //         false,
  //         signatureData.v,
  //         signatureData.r,
  //         signatureData.s,
  //       ];
  //     }
  //     // removeLiquidityETHWithPermit
  //     else {
  //       methodNames = ["removeLiquidityWithPermit"];
  //       args = [
  //         tokenA.address,
  //         tokenB.address,
  //         liquidityAmount.raw.toString(),
  //         amountsMin[Field.CURRENCY_A].toString(),
  //         amountsMin[Field.CURRENCY_B].toString(),
  //         account,
  //         signatureData.deadline,
  //         false,
  //         signatureData.v,
  //         signatureData.r,
  //         signatureData.s,
  //       ];
  //     }
  //   } else {
  //     throw new Error(
  //       "Attempting to confirm without approval or a signature. Please contact support."
  //     );
  //   }

  // const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
  //   methodNames.map((methodName) =>
  //     router.estimateGas[methodName](...args)
  //       .then(calculateGasMargin)
  //       .catch((error) => {
  //         console.error(`estimateGas failed`, methodName, args, error);
  //         return undefined;
  //       })
  //   )
  // );

  //   const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
  //     (safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate)
  //   );

  //   // all estimations failed...
  //   if (indexOfSuccessfulEstimation === -1) {
  //     console.error("This transaction would fail. Please contact support.");
  //   } else {
  //     const methodName = methodNames[indexOfSuccessfulEstimation];
  //     const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

  //     setAttemptingTxn(true);
  //     await router[methodName](...args, {
  //       gasLimit: safeGasEstimate,
  //     })
  //       .then((response: TransactionResponse) => {
  //         setAttemptingTxn(false);

  //         addTransaction(response, {
  //           summary:
  //             "Remove " +
  //             parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
  //             " " +
  //             currencyA?.symbol +
  //             " and " +
  //             parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
  //             " " +
  //             currencyB?.symbol,
  //         });

  //         setTxHash(response.hash);

  //         ReactGA.event({
  //           category: "Liquidity",
  //           action: "Remove",
  //           label: [currencyA?.symbol, currencyB?.symbol].join("/"),
  //         });
  //       })
  //       .catch((error: Error) => {
  //         setAttemptingTxn(false);
  //         // we only care if the error is something _other_ than the user rejected the tx
  //         console.error(error);
  //       });
  //   }
  // }

  function modalHeader() {
    return (
      <div className="grid gap-4 pt-3 pb-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start  gap-3">
              {/* <div className="pb-4"> */}
              {/* <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-high-emphesis"> */}
              <CurrencyLogo currency={currencyA} size={48} />
              <div className="text-2xl font-bold text-high-emphesis">
                {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
              </div>
            </div>
            <div className="ml-3 text-2xl font-medium text-high-emphesis">{currencyA?.symbol}</div>
          </div>
          <div className="ml-3 mr-3 min-w-[24px]">
            <Plus size={24} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={currencyB} size={48} />
              <div className="text-2xl font-bold text-high-emphesis">
                {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
              </div>
            </div>
            <div className="ml-3 text-2xl font-medium text-high-emphesis">{currencyB?.symbol}</div>
          </div>
        </div>
        <div className="justify-start text-sm text-secondary">
          {`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
            4
          )}% your transaction will revert.`}
        </div>
      </div>
    )
  }

  function modalBottom() {
    return (
      <div className="p-6 mt-0 -m-6 bg-dark-800">
        {pair && (
          <>
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <div className="text-sm text-high-emphesis">{`Rates`}</div>
                <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
                  {`1 ${currencyA?.symbol} = ${tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} ${currencyB?.symbol
                    }`}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
                  {`1 ${currencyB?.symbol} = ${tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} ${currencyA?.symbol
                    }`}
                </div>
              </div>
            </div>
            <div className="h-px my-6 bg-gray-700" />
          </>
        )}
        <div className="grid gap-1 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary">{`${currencyA?.symbol}/${currencyB?.symbol} Burned`}</div>
            <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphasis">
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </div>
          </div>
        </div>
        <Button
          color="gradient"
          size="lg"
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
        >
          {`Confirm`}
        </Button>
      </div>
    )
  }

  const pendingText =
    `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[
      Field.CURRENCY_B
    ]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: string) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value)
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA == NATIVE[chainId ?? ChainId.FANTOM] || currencyB == NATIVE[chainId ?? ChainId.FANTOM]

  const oneCurrencyIsWETH = Boolean(
    chainId && WNATIVE[chainId ?? ChainId.FANTOM] && (currencyA?.equals(WNATIVE[chainId ?? ChainId.FANTOM]) || currencyB?.equals(WNATIVE[chainId ?? ChainId.FANTOM]))
  )

  // const handleSelectCurrencyA = useCallback(
  //   (currency: Currency) => {
  //     if (currencyIdB && currencyId(currency) === currencyIdB) {
  //       router.push(`/exchange/remove/${currencyId(currency)}/${currencyIdA}`
  //     } else {
  //       router.push(`/exchange/remove/${currencyId(currency)}/${currencyIdB}`
  //     }
  //   },
  //   [currencyIdA, currencyIdB, router]
  // )

  // const handleSelectCurrencyB = useCallback(
  //   (currency: Currency) => {
  //     if (currencyIdA && currencyId(currency) === currencyIdA) {
  //       router.push(`/exchange/remove/${currencyIdB}/${currencyId(currency)}`
  //     } else {
  //       router.push(`/exchange/remove/${currencyIdA}/${currencyId(currency)}`
  //     }
  //   },
  //   [currencyIdA, currencyIdB, router]
  // )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    liquidityPercentChangeCallback
  )

  return (
    <>
      <Head>
        <title>Remove LP | SoulSwap</title>
          {/* <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
          <meta name="description" content="Remove liquidity from the SoulSwap exchange." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:description" content="Remove liquidity from the SoulSwap exchange." />
      </Head>

      <DoubleGlowShadowV2>
        <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
          {/* <MultichainBanner /> */}
          {/* <div className="p-4 px-2 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}> */}
          {/* <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`} /> */}
          {/* <div className={`my-12`} /> */}
          {/* <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`} /> */}
          {/* <div className={`my-12`} /> */}
          {/* <Header input={currencyA} output={currencyB} allowedSlippage={allowedSlippage} /> */}
          <SwapDropdown />
          <CustomBanner
                external={true}
                chains={[ChainId.FANTOM, ChainId.AVALANCHE]}
                link={'https://links.soulswap.finance'}
                text={'View Our Ecosystem ↗'}
                textColor={'white'}
                color={'ftmBlue'}
                className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
              />
          <div>
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash ? txHash : ''}
              content={() => (
                <ConfirmationModalContent
                  title={`Receive`}
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingText}
            />
            {/* <AutoColumn gap="md"> */}
            <div
              className={`mb-4`}
            >
              <LiquidityHeader input={currencyA} output={currencyB} />
              <PercentInputPanel
                value={innerLiquidityPercentage}
                onUserInput={setInnerLiquidityPercentage}
                id="liquidity-percent"
                chainId={chainId}
              />
            </div>
            {/* <AutoColumn justify="space-between" className="py-2.5">
                  <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                    <button className="z-10 -mt-6 -mb-6 rounded-full cursor-default bg-dark-900 p-3px">
                      <div className="p-3 rounded-full bg-dark-800">
                        <ArrowDownIcon width="32px" height="32px" />
                      </div>
                    </button>
                  </AutoRow>
                </AutoColumn> */}

            <div id="remove-liquidity-output" className="p-5 rounded bg-dark-800">
              <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
                <div className="w-full text-white sm:w-2/5" style={{ margin: 'auto 0px' }}>
                  <AutoColumn>
                    <div>{`Receive`}</div>
                    {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                      <RowBetween className="text-sm">
                        {oneCurrencyIsETH ? (
                          <Link
                            legacyBehavior={true}
                            href={`/exchange/remove/${currencyA == NATIVE[chainId ?? ChainId.FANTOM] ? WNATIVE[chainId ?? ChainId.FANTOM].address : currencyIdA}/${currencyB == NATIVE[chainId ?? ChainId.FANTOM] ? WNATIVE[chainId ?? ChainId.FANTOM].address : currencyIdB
                              }`}
                          >
                            <a className={classNames("font-bold text-baseline opacity-80 hover:opacity-100 focus:opacity-100 whitespace-nowrap", `text-${getChainColorCode(chainId)}`)}>
                              {`Receive`} W{NATIVE[chainId ?? ChainId.FANTOM].symbol}
                            </a>
                          </Link>
                        ) : oneCurrencyIsWETH ? (
                          <Link
                            legacyBehavior={true}
                            href={`/exchange/remove/${currencyA?.equals(WNATIVE[chainId ?? ChainId.FANTOM]) ? NATIVE[chainId ?? ChainId.FANTOM].symbol : currencyIdA}/${currencyB?.equals(WNATIVE[chainId ?? ChainId.FANTOM]) ? NATIVE[chainId ?? ChainId.FANTOM].symbol : currencyIdB
                              }`}
                          >
                            <a className="text-baseline text-blue opacity-80 hover:opacity-100 whitespace-nowrap">
                              {`Receive`} {NATIVE[chainId ?? ChainId.FANTOM].symbol}
                            </a>
                          </Link>
                        ) : null}
                      </RowBetween>
                    ) : null}
                  </AutoColumn>
                </div>

                <div className="flex flex-col space-y-3 md:flex-row md:space-x-6 md:space-y-0">
                  <div className="flex flex-row items-center w-full p-3 pr-8 space-x-3 rounded bg-dark-900">
                    <CurrencyLogo currency={currencyA} size={46} />
                    <AutoColumn>
                      <div className="text-white">{formattedAmounts[Field.CURRENCY_A] || '-'}</div>
                      <div className="text-sm">{currencyA?.symbol}</div>
                    </AutoColumn>
                  </div>
                  <div className="flex flex-row items-center w-full p-3 pr-8 space-x-3 rounded bg-dark-900">
                    <CurrencyLogo currency={currencyB} size={46} />
                    <AutoColumn>
                      <div className="text-white">{formattedAmounts[Field.CURRENCY_B] || '-'}</div>
                      <div className="text-sm">{currencyB?.symbol}</div>
                    </AutoColumn>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: `12px` }}>
            {!account ? (
              // <Web3Connect size="lg" color="gradient" className="w-full" />
              <Button
                size="lg" color="avaxRed" className="w-full"
                disabled
              >
                {`Connect Wallet`}
              </Button>
            ) : (
              <div className="text-white grid grid-cols-2 gap-4">
                <ButtonConfirmed
                  className={'text-white'}
                  onClick={onAttemptToApprove}
                  confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                  disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                >
                  {approval === ApprovalState.PENDING ? (
                    <Dots>{`Approving`}</Dots>
                  ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                    `Approved`
                  ) : (
                    `Approve`
                  )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    setShowConfirm(true)
                  }}
                  disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                  error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                >
                  {error || `Confirm Withdrawal`}
                </ButtonError>
              </div>
            )}
          </div>
          {/* </AutoColumn> */}
          {/* </div> */}
          <div className={``}>
            {pair &&
              <MinimalPositionCard
                className={`border-2 rounded-2xl border-purple p-0.5 mb-4 mt-4`}
                chainId={chainId}
                showUnwrapped={oneCurrencyIsWETH}
                pair={pair}
              />
            }
          </div>
          {featureEnabled(Feature.ANALYTICS, chainId) &&
            <PairChart
              inputCurrency={currencyA}
              outputCurrency={currencyB}
            />
          }
          <div className={"grid grid-cols-1 text-white justify-center m-2"}>
            <NavLink
              legacyBehavior={true}
              href="/pool"
            >
              <Button
                variant={'filled'}
                color={`${getChainColorCode(chainId)}`}
                primaryColor={'black'}
              >
                <div className={`text-white flex justify-center items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis`}>
                  {`View Positions`}
                </div>
              </Button>
            </NavLink>
          </div>
        </div>
      </DoubleGlowShadowV2>
    </>
  )
}
