// WIP

import React, { useEffect, useState } from 'react'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from "services/web3"

export const useOneInch = () => async function() {
// const Web3 = require('web3');
// const fetch = require('node-fetch');
// const yesno = require('yesno');
// const web3RpcUrl = 'https://bsc-dataseed.binance.org';
// const walletAddress = '0xFd63Bf84471Bc55DD9A83fdFA293CCBD27e1F4C8';
const { account, chainId, connector } = useActiveWeb3React()
const swapParams = {
    fromTokenAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
    toTokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // DAI
    amount: '100000000000000000',
    fromAddress: account,
    slippage: 1,
    disableEstimate: false,
    allowPartialFill: false,
};

const broadcastApiUrl = 'https://tx-gateway.1inch.io/v1.1/' + chainId + '/broadcast';
const apiBaseUrl = 'https://api.1inch.io/v4.0/' + chainId;

function apiRequestUrl(methodName, queryParams) {
    return apiBaseUrl + methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

async function broadCastRawTransaction(rawTransaction) {
    return fetch(broadcastApiUrl, {
        method: 'post',
        body: JSON.stringify({rawTransaction}),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        return res.transactionHash;
    });
}

async function signAndSendTransaction(transaction) {
    // const {rawTransaction} = await web3.eth.accounts.signTransaction(transaction, privateKey);
    const {rawTransaction} = await connector.getAccount[0].signTransaction(transaction)

    return await broadCastRawTransaction(rawTransaction);
}

async function buildTxForSwap(swapParams) {
    const url = apiRequestUrl('/swap', swapParams);

    return fetch(url).then(res => res.json()).then(res => res.tx);
}

// First, let's build the body of the transaction
const swapTransaction = await buildTxForSwap(swapParams);
console.log('Transaction for swap: ', swapTransaction);

// const ok = await yesno({
//     question: 'Do you want to send a transaction to exchange with 1inch router?'
// });

// Before signing a transaction, make sure that all parameters in it are specified correctly
// if (!ok) {
//     return false;
// }

// Send a transaction and get its hash
const swapTxHash = await signAndSendTransaction(swapTransaction);
console.log('Swap transaction hash: ', swapTxHash);
}