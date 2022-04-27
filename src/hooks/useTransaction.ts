import { useContext, useEffect } from "react";
import { TransactionContext } from "contexts/TransactionProvider";

const useTransaction = () => {
  const [transaction, dispatchTx] = useContext(TransactionContext);

  useEffect(() => {});

  return { transaction, dispatchTx };
};

export default useTransaction;