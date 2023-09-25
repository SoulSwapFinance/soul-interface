import axios from 'axios'

function getApiUrlData (url:string, token:string, address?:string) {
  return new Promise(resolve => {
    axios.get(url).then((res:any) => {
      if (res && res.data && res.status === 200) {
        // let price = res.data[0].current_price
        localStorage.setItem(token, JSON.stringify({
          timestamp: Date.now(),
          data: res.data,
          address: address
        }))
        resolve({
          msg: 'Success',
          data: res.data
        })
      } else {
        localStorage.setItem(token, '')
        resolve({
          msg: 'Error',
          data: ''
        })
      }
    }).catch((err:any) => {
      console.log(err)
      localStorage.setItem(token, '')
      resolve({
        msg: 'Error',
        data: ''
      })
    })
  })
}

function getApiData (url:string, token:string, intarval:number, address?:string) {
  const localData = localStorage.getItem(token)
  return new Promise(resolve => {
    if (localData) {
      const localObj = JSON.parse(localData)
      if (
        (Date.now() - Number(localObj.timestamp) > intarval)
        || !localObj.data
        || (address && address !== localObj.address)
      ) {
        getApiUrlData(url, token, address).then((res:any) => {
          // console.log(res)
          if (res.msg === 'Success') {
            resolve(res.data)
          } else {
            resolve('')
          }
        })
      } else {
        resolve(localObj.data)
      }
    } else {
      getApiUrlData(url, token, address).then((res:any) => {
        // console.log(res)
        if (res.msg === 'Success') {
          resolve(res.data)
        } else {
          resolve('')
        }
      })
    }
  })
}
export const getPrice = (coin:string) => {
  return new Promise(resolve => {
    // coin = coin ? coin : config.symbol
    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=fsn'
    // if (true) {
    if (coin === 'BNB') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin'
    } else if (coin === 'HT') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=huobi-token'
    } else if (coin === 'FTM') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=fantom'
    } else if (coin === 'ANY') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=anyswap'
    } else if (coin === 'SOUL') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=soul-swap'
    } else if (coin === 'HERO') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=hero'
    } else if (coin === 'PLAY') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polyplay'
    }
    // console.log(url)
    getApiData(url, coin + '_PRICE', 1000 * 60 * 60).then((res:any) => {
      if (res && res.length > 0) {
        const price = res[0].current_price
        resolve(price)
      } else {
        resolve('')
      }
    })
  })
}
