import { ContractWrappers } from "@0x/contract-wrappers";
import { useActiveWeb3React } from "services/web3";

let contractWrappers;
export const getContractWrappers = async (library) => {
    const { chainId } = useActiveWeb3React()
	if (!contractWrappers) {
		contractWrappers = new ContractWrappers(library, { chainId });
	}
	return contractWrappers;
};
