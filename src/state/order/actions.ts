import { createAction } from "@reduxjs/toolkit";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  PRICE = "PRICE",
}

export enum Rate {
  MUL = "MUL",
  DIV = "DIV",
}

export const selectCurrency = createAction<{
  field: Field;
  currencyId: string;
}>("order/selectCurrency");
export const switchCurrencies = createAction<void>("order/switchCurrencies");
export const typeInput = createAction<{ field: Field; typedValue: string }>(
  "order/typeInput"
);
export const setRecipient = createAction<{ recipient: string | null }>(
  "order/setRecipient"
);
export const setRateType = createAction<{ rateType: Rate }>(
  "order/setRateType"
);
