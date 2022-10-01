// WIP

import axios from 'axios';
import BigNumber from 'bignumber.js';

// https://developers.paraswap.network/

export async function getPrice() {
      try { 
        const requestURL = `https://apiv5.paraswap.io/prices/?srcToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&destToken=0x6b175474e89094c44da98b954eedeac495271d0f&amount=10000000000000000000&srcDecimals=18&destDecimals=18&side=SELL&network=1`
        const { data } = await axios.get(requestURL);
      // const price = data.priceRoute.destAmount
      // console.log('price:%s', price)
      return { data }
    } catch (e) {
      throw new Error(
        // `Paraswap unable to buildTransaction ${from.address} ${to.address} ${network} ${e.message}`,
      );
    }      
  }
    
    export async function buildTransaction(
    pricePayload,
    from,
    to,
    srcAmount,
    minDestAmount,
    network,
    userAddress,
  ) {
    try {
      const requestURL = `https://apiv4.paraswap.io/v2/transactions/${network}`;
      const requestData = {
        priceRoute: pricePayload,
        srcToken: from.address,
        destToken: to.address,
        srcAmount: srcAmount,
        destAmount: minDestAmount,
        userAddress: userAddress,
        referrer: this.referrer,
        srcDecimals: from.decimals,
        destDecimals: to.decimals,
      };

      const { data } = await axios.post(requestURL, requestData);
      return {
        from: data.from,
        to: data.to,
        data: data.data,
        gasLimit: '0x' + new BigNumber(data.gas).toString(16),
        value: '0x' + new BigNumber(data.value).toString(16)
      };
    } catch (e) {
      throw new Error(
        `Paraswap unable to buildTransaction ${from.address} ${to.address} ${network} ${e.message}`,
      );
    }
}