const Web3 = require('web3')
const { default: axios } = require('axios')
// import IUniswapV2PairABI from '../../constants/abis/uniswap-v2-pair.json'
import ISoulSwapPairABI from '../../constants/abis/soulswap/ISoulSwapPair.json'
const NETWORK_URL = 'https://rpc.ftm.tools'
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

  let ret = {}
  ret['ftm'] = ftmUSDCPrice
  ret['soul'] = soulFtmPrice * ftmUSDCPrice
  ret['seance'] = seanceFtmPrice * ftmUSDCPrice
  ret['usdc'] = 1

  res.status(200).json(ret)
}