import routerList from "../routers.json"
import axios from "axios"
import querystring from "querystring"
import { BigNumber } from "ethers"
import { formatAddress } from "utils/wallet"
import Web3 from "web3"

const routerData = routerList.find(router => router.id === "0x")
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// resolves: 0x API endpoint
function getEndpoint(chainId) {
    if (chainId === "0x1") {
        return "https://api.0x.org"
    } else if (chainId === "0x89") {
        return "https://polygon.api.0x.org"
    } else if (chainId === "0xfa") {
        return "https://fantom.api.0x.org"
    } else if (chainId === "0xa86a") {
        return "https://avalanche.api.0x.org"
    } else if (chainId === "0x38") {
        return "https://bsc.api.0x.org"
    }
}

// gets: swap quote
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

        const result = await axios(`${endpoint}/swap/v1/price?${querystring.encode({
            sellToken: swap.tokenIn.address,
            buyToken: swap.tokenOut.address,
            sellAmount: swap.tokenInAmount.toString()
        })}`)

        return {
            ...routerData,
            out: BigNumber.from(result.data.buyAmount),
            priority: chain.id === "0x38" ? 2 : 0
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
        // Request swap data
        
        const result = await axios(`${endpoint}/swap/v1/quote?${querystring.encode({
            sellToken: swap.tokenIn.address,
            buyToken: swap.tokenOut.address,
            sellAmount: swap.tokenInAmount.toString(),
            slippagePercentage: chain.swapSettings.slippage / 100
        })}`)
        const gas = await chain.web3.eth.estimateGas({
            from: account,
            to: result.data.to,
            value: swap.tokenIn.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ? swap.tokenInAmount : 0,
            data: result.data.data
        }).catch(() => {})
        
        return {
            router: routerData,
            in: BigNumber.from(result.data.sellAmount),
            out: BigNumber.from(result.data.buyAmount),
            tx: {
                from: account,
                to: formatAddress(result.data.to),
                data: result.data.data,
                ...(gas) && { gas: web3.utils.numberToHex(Math.floor(gas * 1.25)) 
                    }
            },
            priority: chain.id === "0x38" ? 2 : 0
        }
    } catch(error) {
        console.error(error)
    }

    return none
}

// Exports

export { quote, getSwap }