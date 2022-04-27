import { useContext } from "react";
import { AccountContext } from "contexts/AccountProvider";

const useAccount = () => {
  const [account, dispatchAccount] = useContext(AccountContext);
  return { account, dispatchAccount };
};

export default useAccount;