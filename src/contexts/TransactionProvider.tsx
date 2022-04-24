import React, { useReducer } from "react";

const initial = {
  currentTransactions: [],
} as any;
export const TransactionContext = React.createContext(null);

// export const TransactionProvider: React.FC = ({ children }) => {
export const TransactionProvider: React.FC = ({ }) => {
  const transactionReducer = (state: any, action: any) => {
    switch (action.type) {
      case "transactionPending":
        const pendingTransaction = {
          hash: action.hash,
          status: "pending",
        };
        return {
          ...state,
          currentTransactions: [...state.currentTransactions, action.hash],
          [action.hash]: pendingTransaction,
        };
      case "transactionCompleted":
        const completedTransaction = {
          hash: action.hash,
          transaction: action.transaction,
          status: "completed",
        };
        return {
          ...state,
          currentTransactions: state.currentTransactions.filter(
            (hash: string) => hash !== action.hash
          ),
          [action.hash]: completedTransaction,
        };
      case "transactionError":
        const failedTransaction = {
          hash: action.hash,
          error: action.error,
          status: "failed",
        };
        return {
          ...state,
          currentTransactions: state.currentTransactions.filter(
            (hash: string) => hash !== action.hash
          ),
          [action.hash]: failedTransaction,
        };
      case "reset":
        return initial;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(transactionReducer, initial);

  return (
    <TransactionContext.Provider value={[state, dispatch]}>
      {/* {children} */}
      {}
    </TransactionContext.Provider>
  );
};