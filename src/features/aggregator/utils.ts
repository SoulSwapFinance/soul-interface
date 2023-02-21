import { ethers } from "ethers";
import BigNumber from 'bignumber.js';
import { providers } from './rpcs';

export async function applyArbitrumFees(to: string, data: string, gas: string) {
    const nodeInterface = new ethers.Contract("0x00000000000000000000000000000000000000C8",
        ["function gasEstimateL1Component(address to,bool contractCreation,bytes calldata data) external view returns (uint64 gasEstimateForL1,uint256 baseFee,uint256 l1BaseFeeEstimate)"],
        providers.arbitrum);
    const gasData = await nodeInterface.gasEstimateL1Component(to, false, data);
    gas = new BigNumber(gas).plus(gasData.gasEstimateForL1.toNumber()).toFixed(0, 1);
    return gas
}

export async function sendTx(signer:ethers.Signer, chain:string, txObject:any){
    if(txObject.data === "0x" || typeof txObject.to !== "string"){
        throw new Error("Malformed tx") // Should never happen
    }
    if(txObject.gasLimit === undefined){
        const gasPrediction = await signer.estimateGas(txObject)
        txObject.gasLimit = gasPrediction.mul(14).div(10) // Increase gas +40%
    }
    return signer.sendTransaction(txObject);
}

export const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1)

export function chainIconUrl(chain) {
let logo = '/images/networks/ethereum.svg'
chain.toLowerCase() == 
    'arbitrum' ? logo = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/arbitrum/Arbitrum.png'
    : logo = `/images/networks/${chain.toLowerCase()}.svg`
return logo
}