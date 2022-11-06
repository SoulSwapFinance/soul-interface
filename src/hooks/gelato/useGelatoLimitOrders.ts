import useGelatoLimitOrdersHandlers, {
  GelatoLimitOrdersHandlers,
} from "./useGelatoLimitOrdersHandlers";
import {
  DerivedOrderInfo,
  useDerivedOrderInfo,
  useOrderState,
} from "state/order/hooks";
import { OrderState } from "state/order/reducer";

export default function useGelatoLimitOrders(): {
  handlers: GelatoLimitOrdersHandlers;
  derivedOrderInfo: DerivedOrderInfo;
  orderState: OrderState;
} {
  const derivedOrderInfo = useDerivedOrderInfo();

  const orderState = useOrderState();

  const handlers = useGelatoLimitOrdersHandlers();

  return {
    handlers,
    derivedOrderInfo,
    orderState,
  };
}
