import { Currency, CurrencyAmount } from "sdk";

export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
  }
  
  export interface SwapState {
    readonly independentField: Field
    readonly typedValue: string
    readonly [Field.INPUT]: {
      readonly currencyId: string | undefined
    }
    readonly [Field.OUTPUT]: {
      readonly currencyId: string | undefined
    }
    // the typed recipient address or ENS name, or null if swap should go to sender
    readonly recipient: string | null
    
    readonly protocolFeeTo: string | undefined
  }

  export interface AggregationComparer {
    inputAmount: CurrencyAmount<Currency>
    outputAmount: CurrencyAmount<Currency>
    amountInUsd: string
    amountOutUsd: string
    receivedUsd: string
    // outputPriceUSD: number
    comparedDex: string
    tradeSaved?: {
      percent?: number
      usd?: string
    }
  }