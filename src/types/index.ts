import { Currency, Trade, TradeType } from "sdk";

export type TradeUnion =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>