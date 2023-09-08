import swapRouters from "../swap-routers.json"
import routeTokens from "../../data/route-tokens.json"
import { BigNumber } from "ethers"
import { useActiveWeb3React } from "services/web3"
import Web3 from "web3"
import { ChainId, WNATIVE } from "sdk"
// import useSwap from "features/eco/hooks/useSwap"

// const routerData = routerList.find(router => router.id === "direct")
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Quote swap

async function getQuote(chainId, fromAddress: string, toAddress, inputAmount) {
    // const { chainId, library } = useActiveWeb3React()
    // const provider = library.provider

    // let web3 = new Web3(RPC[chainId ?? ChainId.FANTOM])
    // No quote

    const none = {
        // ...routerData,
        out: false,
        priority: 0
    }

    // Check swap parameters

    const routers = swapRouters[chainId ?? ChainId.FANTOM]
    // if (!Object.keys(routers).length) return none

    try {
        // Find best router quote

        const best = await getBestRouterQuote(chainId, routers, fromAddress, toAddress, inputAmount)
        if (best.out.isZero()) return none
        
        return {
            id: 'direct',
            routerId: best.router,
            name: routers[best.router].name,
            out: best.out,
            priority: 1
        }
    } catch(error) {
        console.error(error)
    }

    return none
}

// Get swap

async function getSwap(chainId, routerId, fromAddress, toAddress, inputAmount, account) {
    let routers = swapRouters[chainId ?? ChainId.FANTOM]

    // initial state swap
    const none = {
        // router: routerData,
        out: false,
        priority: 0
    }

    // checks: swap parameters
    if (!routers[routerId].enabled) return none
    routers = swapRouters[chainId ?? ChainId.FANTOM]
    if (!Object.keys(routers).length) return none

    try {
        // Find best router quote

        const best = await getBestRouterQuote(chainId, routers, fromAddress, toAddress, inputAmount)
        if (best.out.isZero()) return none
        const swapData = encodeSwapData(chainId, account, routers[best.router], fromAddress, toAddress, best.path, inputAmount, best.out)
        const gas = await web3.eth.estimateGas({
            from: account,
            to: routers[best.router].address,
            value: fromAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ? inputAmount : 0,
            data: swapData
        }).catch(() => {})

        // Calculate swap parameters

        return {
            router: {
                id: routerId,
                routerId: best.router,
                name: routers[best.router].name
            },
            in: inputAmount,
            out: best.out,
            tx: {
                from: account,
                to: routers[best.router].address,
                data: swapData,
                ...(gas) && { gas: web3.utils.numberToHex(Math.floor(gas * 1.25)) }
            },
            priority: 1
        }
    } catch(error) {
        console.error(error)
    }

    return none
}

// Get best router quote

async function getBestRouterQuote(chainId: ChainId, routers, fromAddress: string, toAddress: string, inputAmount) {
    // runs: batch request
    const batch = new web3.BatchRequest()
    // const swap = useSwap(chainId)
    
    const requests = []
    const quotes = []
    const signature = web3.eth.abi.encodeFunctionSignature("getAmountsOut(uint256,address[])")
    const paths = getPaths(chainId, fromAddress, toAddress)

    for (const path of paths) {
        const calldata = web3.eth.abi.encodeParameters(["uint256", "address[]"], [inputAmount, path])
        for (const router in routers) {
            // <void> ?
            requests.push(new Promise<void>(resolve => {
                const swapPath = path.slice()
                // @ts-ignore : TODO
                batch.add(web3.eth.call.request({
                    to: routers[router].address,
                    data: `${signature}${calldata.slice(2)}`
                }, (error, result) => {
                    if (error) {
                        quotes.push({
                            router,
                            path: swapPath,
                            out: BigNumber.from(0)
                        })
                    } else {
                        const amounts = web3.eth.abi.decodeParameter("uint256[]", result)
                        quotes.push({
                            router,
                            path: swapPath,
                            out: BigNumber.from(amounts[amounts.length - 1])
                        })
                    }
                    resolve()
                }))
            }))
        }
    }

    batch.execute()
    await Promise.all(requests)

    // Find best router quote

    let best = quotes[0]
    for (let q = 1; q < quotes.length; q ++) {
        if (quotes[q].out.gt(best.out)) {
            best = quotes[q]
        }
    }
    return best
}

// gets: swap paths with route tokens.
function getPaths(chainId, tokenIn, tokenOut) {
    // Generate all paths with chain route tokens

    const addressIn = tokenIn === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ? WNATIVE[chainId ?? ChainId.FANTOM] : tokenIn
    const addressOut = tokenOut === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ? WNATIVE[chainId ?? ChainId.FANTOM] : tokenOut
    const paths = [[addressIn, addressOut]]

    for (const token of routeTokens[chainId ?? ChainId.FANTOM]) {
        if (token !== addressIn && token !== addressOut) {
            paths.push([addressIn, token, addressOut])
        }
    }

    return paths
}

// Encode swap data on router

function encodeSwapData(chain, account, router, tokenIn, tokenOut, path, amountIn, amountOut) {
    // Calculate swap data

    const amountOutMin = amountOut.mul(BigNumber.from(10 ** 4 - chain.swapSettings.slippage * 100)).div(BigNumber.from(10).pow(BigNumber.from(4)))
    const deadline = Math.floor(Date.now() / 1000) + 20 * 60 * 1000

    if (tokenIn === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        // Swap exact ETH for tokens

        const signature = web3.eth.abi.encodeFunctionSignature(`swapExact${router.ETH}ForTokens(uint256,address[],address,uint256)`)
        const calldata = web3.eth.abi.encodeParameters(["uint256", "address[]", "address", "uint256"], [
            amountOutMin,
            path,
            account,
            deadline
        ])
        return `${signature}${calldata.slice(2)}`
    } else if (tokenOut === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        // Swap exact tokens for ETH

        const signature = web3.eth.abi.encodeFunctionSignature(`swapExactTokensFor${router.ETH}(uint256,uint256,address[],address,uint256)`)
        const calldata = web3.eth.abi.encodeParameters(["uint256", "uint256", "address[]", "address", "uint256"], [
            amountIn,
            amountOutMin,
            path,
            account,
            deadline
        ])
        return `${signature}${calldata.slice(2)}`
    } else {
        // Swap exact tokens for tokens

        const signature = web3.eth.abi.encodeFunctionSignature(`swapExactTokensForTokens(uint256,uint256,address[],address,uint256)`)
        const calldata = web3.eth.abi.encodeParameters(["uint256", "uint256", "address[]", "address", "uint256"], [
            amountIn,
            amountOutMin,
            path,
            account,
            deadline
        ])
        return `${signature}${calldata.slice(2)}`
    }
}

// Exports

export { getQuote, getSwap }