const Web3 = require('web3')
// const { default: axios } = require('axios')
// import { usePriceHelperContract } from 'hooks/useContract'
// import useSingleCallResult from 'state/multicall/hooks'
import ISoulSwapPairABI from '../../constants/abis/soulswap/ISoulSwapPair.json'
// const NETWORK_URL = 'https://rpcapi.fantom.network'
const NETWORK_URL = 'https://ftmrpc.ultimatenodes.io/'
const web3 = new Web3(NETWORK_URL)

export default async function handler(req, res) {
  let ftmUSDCContract = new web3.eth.Contract(ISoulSwapPairABI, '0x160653F02b6597E7Db00BA8cA826cf43D2f39556') // FTM-USDC // 02 OCT
  const ftmUSDCReserves = await ftmUSDCContract.methods.getReserves().call()
  const ftmUSDCPrice = (Number(ftmUSDCReserves.reserve0) / Number(ftmUSDCReserves.reserve1) ) * 1e12 // USDC / FTM

  let soulFtmContract = new web3.eth.Contract(ISoulSwapPairABI, '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57') // 02 OCT
  const soulFtmReserves = await soulFtmContract.methods.getReserves().call()

  const soulFtmPrice = Number(soulFtmReserves.reserve0) / Number(soulFtmReserves.reserve1) // FTM / SOUL

  let seanceFtmContract = new web3.eth.Contract(ISoulSwapPairABI, '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB')
  const seanceFtmReserves = await seanceFtmContract.methods.getReserves().call()

  const seanceFtmPrice = Number(seanceFtmReserves.reserve1) / Number(seanceFtmReserves.reserve0) // FTM / SEANCE

  // const priceHelperContract = usePriceHelperContract()
  // const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  // const soulPrice = Number(rawSoulPrice)
  // console.log(soulPrice)

  // const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  // const ftmPrice = Number(rawFtmPrice)
  // console.log(ftmPrice)

  // const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  // const seancePrice = Number(rawSeancePrice)
  // console.log(seancePrice)

  
  let ret = {}
  ret['ftm'] = ftmUSDCPrice
  ret['soul'] = soulFtmPrice * ftmUSDCPrice
  ret['seance'] = seanceFtmPrice * ftmUSDCPrice
  
  // ret['ftm'] = ftmPrice
  // ret['soul'] = soulPrice
  // ret['seance'] = seancePrice
  ret['usdc'] = 1
  ret['dai'] = 1
  ret['usdt'] = 1

  res.status(200).json(ret)
}
