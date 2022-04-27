import { useState } from "react";
import { useTransactionAdder } from "state/transactions/hooks";
// import useTransaction from "./useTransaction";

const useSendTransaction = (callback: () => any) => {
  const [txHash, setTxHash] = useState(null);
  const addTransaction = useTransactionAdder()
  const tx = addTransaction[txHash];
  const isPending = tx && tx.status === "pending";
  const isCompleted = tx && tx.status === "completed";
  const isFailed = tx && tx.status === "failed";

  const reset = () => {
    setTxHash(null);
  };

  const sendTx = async () => {
    try {
      const hash = await callback();
      setTxHash(hash);
    } catch (error) {
      console.error(error);
    }
  };

  return { sendTx, hash: txHash, tx, isPending, isCompleted, isFailed, reset };
};

export default useSendTransaction;