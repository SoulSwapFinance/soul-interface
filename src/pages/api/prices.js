const Web3 = require('web3')
const { default: axios } = require('axios')
import IUniswapV2PairABI from '../../constants/abis/uniswap-v2-pair.json'
const NETWORK_URL = 'https://rpc.ftm.tools' // todo
const web3 = new Web3(NETWORK_URL)

export default async function handler(req, res) {
  let ftmUSDCContract = new web3.eth.Contract(IUniswapV2PairABI, '0x160653F02b6597E7Db00BA8cA826cf43D2f39556') // FTM-USDC // 02 OCT
  const ftmUSDCReserves = await ftmUSDCContract.methods.getReserves().call()

  const ftmUSDCPrice = (Number(ftmUSDCReserves.reserve1) / Number(ftmUSDCReserves.reserve0) ) * 1e12

  let soulFtmContract = new web3.eth.Contract(IUniswapV2PairABI, '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57') // 02 OCT
  const soulFtmReserves = await soulFtmContract.methods.getReserves().call()

  const soulFtmPrice = Number(soulFtmReserves.reserve1) / Number(soulFtmReserves.reserve0)

  let seanceFtmContract = new web3.eth.Contract(IUniswapV2PairABI, '')
  const seanceFtmReserves = await seanceFtmContract.methods.getReserves().call()

  const seanceFtmPrice = Number(seanceFtmReserves.reserve0) / Number(seanceFtmReserves.reserve1)

  let ret = {}
  ret['ftm'] = ftmUSDCPrice
  ret['soul'] = soulFtmPrice * ftmUSDCPrice
  ret['seance'] = seanceFtmPrice * ftmUSDCPrice
  ret['usdc'] = 1
  ret['fusd'] = 1
  ret['fusdt'] = 1

  res.status(200).json(ret)
}