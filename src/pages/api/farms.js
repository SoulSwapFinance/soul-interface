const Web3 = require('web3')
import summonerAbi from '../../constants/abis/soulswap/soulsummoner.json'
import pairAbi from '../../constants/abis/soulswap/ISoulSwapPair.json'
import { POOLS } from '../../constants/farms'
import { ChainId } from '../../sdk'

// const NETWORK_URL = 'https://rpcapi.fantom.network/'
const NETWORK_URL = 'https://ftmrpc.ultimatenodes.io/'
const web3 = new Web3(NETWORK_URL)

export default async function handler(req, res) {
  const ret = await farms()
  res.status(200).json(ret)
}

let farmsResult = null

export async function farms() {
  if (!farmsResult) {
    let summonerContract = new web3.eth.Contract(summonerAbi, '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B') // SUMMONER
    const poolLength = await summonerContract.methods.poolLength().call()

    const forHelper = []
    for (let index = 0; index < poolLength; index++) {
      forHelper.push(index)
    }

    const poolsInfo = []
    const poolsInfoPromises = []

    for (const poolIndex of forHelper) {
      poolsInfoPromises.push(summonerContract.methods.poolInfo(poolIndex).call())
    }

    const poolInfosResult = await Promise.all(poolsInfoPromises)
    poolInfosResult.forEach((poolInfo) => {
      poolsInfo.push({
        ...poolInfo,
      })
    })

    const ret = []
    const poolStaticInfo = POOLS[ChainId.FANTOM]

    for (const pool of poolsInfo) {
      const staticInfo = poolStaticInfo[web3.utils.toChecksumAddress(pool.lpToken)]

      if (!staticInfo.token1) {
        ret.push({
          address: staticInfo.token0.id,
          baseSymbol: staticInfo.token0.symbol.toLowerCase().replace('wftm', 'ftm'),
          baseAmount: pool.totalLp / 10 ** staticInfo.token0?.decimals,
          single: true,
        })
      } else {
        let lpContract = new web3.eth.Contract(pairAbi, pool.lpToken)
        const promisesCall = [
          lpContract.methods.getReserves().call(),
          lpContract.methods.totalSupply().call(),
          lpContract.methods.token0().call(),
          lpContract.methods.token1().call(),
          lpContract.methods.balanceOf('0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B').call(), // SUMMONER
        ]

        const [reserves, totalSupply, token0, token1, summonerBalance] = await Promise.all(promisesCall)
        const summonerRatio = summonerBalance / totalSupply

        const token0info =
          web3.utils.toChecksumAddress(token0) == web3.utils.toChecksumAddress(staticInfo.token0.id)
            ? staticInfo.token0
            : staticInfo.token1
        const token1info =
          web3.utils.toChecksumAddress(token1) == web3.utils.toChecksumAddress(staticInfo.token1.id)
            ? staticInfo.token1
            : staticInfo.token0

        const { reserve0, reserve1 } = reserves
        const token0amount = Number(Number(Number(reserve0) / 10 ** token0info?.decimals).toString()) * summonerRatio
        const token1amount = Number(Number(Number(reserve1) / 10 ** token1info?.decimals).toString()) * summonerRatio

        ret.push({
          address: web3.utils.toChecksumAddress(pool.lpToken),
          baseSymbol:
            token0info.symbol == 'SOUL' || token1info.symbol == 'SOUL'
              ? 'soul'
              : token0info.symbol == 'WFTM' || token1info.symbol == 'WFTM'
              ? 'wftm'
              : token0info.symbol == 'USDC' || token1info.symbol == 'USDC'
              ? 'usdc'
              : '',
          baseAmount:
            token0info.symbol == 'SOUL' || token0info.symbol == 'WFTM'
              ? token0amount
              : token1info.symbol == 'SOUL' || token1info.symbol == 'WFTM'
              ? token1amount
              : token0info.symbol == 'USDC' || token0info.symbol == 'FUSD' || token0info.symbol == 'fUSDT'
              ? token0amount
              : token1info.symbol == 'USDC' || token1info.symbol == 'FUSD' || token1info.symbol == 'fUSDT'
              ? token1amount
              : 0,
          single: false,
        })
      }
    }
    farmsResult = ret;
    return ret;
  }
  else {
    return farmsResult;
  }
}