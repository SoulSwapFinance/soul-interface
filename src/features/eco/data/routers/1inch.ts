import routerList from "../routers.json"
import axios from "axios"
import querystring from "querystring"
import { BigNumber } from "@ethersproject/bignumber"
import Web3 from "web3"

const routerData = routerList.find(router => router.id === "1inch")
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Resolve 1inch API endpoint

function getEndpoint(chainId) {
    if (chainId === "0x1") {
        return "https://api.1inch.exchange/v4.0/1"
    } else if (chainId === "0x89") {
        return "https://api.1inch.exchange/v4.0/137"
    } else if (chainId === "0xfa") {
        return "https://api.1inch.exchange/v4.0/250"
    } else if (chainId === "0xa86a") {
        return "https://api.1inch.exchange/v4.0/43114"
    } else if (chainId === "0x38") {
        return "https://api.1inch.exchange/v4.0/56"
    }
}

// Quote swap

async function quote(chain) {
    // No quote

    const none = {
        ...routerData,
        out: false,
        priority: 0
    }

    // Check swap parameters

    if (!chain.swapSettings.routers[routerData.id].enabled) return none
    const endpoint = getEndpoint(chain.id)
    if (!endpoint) return none
    const swap = chain.swap

    try {
        // Request swap quote

        const result = await axios(`${endpoint}/quote?${querystring.encode({
            fromTokenAddress: swap.tokenIn.address,
            toTokenAddress: swap.tokenOut.address,
            amount: swap.tokenInAmount.toString()
        })}`)

        return {
            ...routerData,
            out: BigNumber.from(result.data.toTokenAmount),
            priority: 0
        }
    } catch(error) {
        console.error(error)
    }

    return none
}

// Get swap

async function getSwap(chain, account) {
    // No swap

    const none = {
        router: routerData,
        out: false,
        priority: 0
    }

    // Check swap parameters
    
    if (!chain.swapSettings.routers[routerData.id].enabled) return none
    const endpoint = getEndpoint(chain.id)
    if (!endpoint) return none
    const swap = chain.swap
    
    try {
        // Swap data

        const data = {
            fromTokenAddress: swap.tokenIn.address,
            toTokenAddress: swap.tokenOut.address,
            amount: swap.tokenInAmount.toString(),
            fromAddress: account,
            slippage: chain.swapSettings.slippage,
            ...(chain.swapSettings.referral) && { referrerAddress: chain.swapSettings.referral }
        }

        // Get swap with and without estimate checking

        const [ withEstimate, withoutEstimate ] = await Promise.all([
            axios(`${endpoint}/swap?${querystring.encode(data)}`)
                // .catch(error => ({ error: true, error }))
            , 
            axios(`${endpoint}/swap?${querystring.encode({
                ...data,
                disableEstimate: true
            })}`)
        ])
        
        // if (!withEstimate.error) {
        if (withEstimate) {
            return {
                router: routerData,
                in: BigNumber.from(withEstimate.data.fromTokenAmount),
                out: BigNumber.from(withEstimate.data.toTokenAmount),
                tx: {
                    from: account,
                    to: withEstimate.data.tx.to,
                    data: withEstimate.data.tx.data,
                    ...(withEstimate.data.tx.gas) && { gas: web3.utils.numberToHex(Math.floor(withEstimate.data.tx.gas * 1.25)) }
                },
                priority: 0
            }
        }

        // Return swap without estimate check on insufficient gas or allowance error

    //     if (
    //         withEstimate?.error?.response?.data?.description.startsWith("insufficient funds for gas * price + value") ||
    //         withEstimate?.error?.response?.data?.description.startsWith("Not enough allowance")
    //     ) {
    //         return {
    //             router: routerData,
    //             in: BigNumber.from(withoutEstimate.data.fromTokenAmount),
    //             out: BigNumber.from(withoutEstimate.data.toTokenAmount),
    //             tx: {
    //                 from: account,
    //                 to: withoutEstimate.data.tx.to,
    //                 data: withoutEstimate.data.tx.data,
    //                 ...(withoutEstimate.data.tx.gas) && { gas: web3.utils.numberToHex(Math.floor(withoutEstimate.data.tx.gas * 1.25)) }
    //             },
    //             priority: 0
    //         }
    //     }
    } catch(error) {
        console.error(error)
    }

    return none
}

// async function getSwap(chain, account) { 
//     return
// }

export { quote, getSwap }