import BigNumber from 'bignumber.js'
import erc20 from 'constants/abis/erc20.json'
import PAIR_ABI from 'constants/abis/soulswap/ISoulSwapPair.json'
import MULTICALL_ABI from 'constants/multicall/abi.json'
import { ethers } from 'ethers'
import { WNATIVE } from '../../constants/addresses'

const BIG_ZERO = new BigNumber(0)
const BIG_TEN = new BigNumber(10)

const DEFAULT_TOKEN_DECIMAL = 18;
const MULTICALL_ADDRESS = '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a';
// const RPC_ENDPOINT = 'https://rpcapi.fantom.network/'; // process.env.REACT_APP_RPC_ENDPOINT
const RPC_ENDPOINT = 'https://ftmrpc.ultimatenodes.io/'; // process.env.REACT_APP_RPC_ENDPOINT

const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT)

function getParameterCaseInsensitive(object, key) {
    if (object instanceof Object && key) {
      return object[Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase())]
    }
    return undefined
  }

  
const multicall = async (abi, calls) => {
    const provider = simpleRpcProvider
    const multi = new ethers.Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider)
  
    const itf = new ethers.utils.Interface(abi)
  
    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  
    const { returnData } = await multi.aggregate(calldata)
  
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
  
    return res
  }
  

export const transformUserData = (userData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    earnings: userData ? new BigNumber(userData.earnings) : BIG_ZERO,
  }
}

export async function getStoredToken(type, tokenAddress, soulSummonerAddress) {
  switch (type) {
    case 'soulswap':
      return await getPool(PAIR_ABI, tokenAddress, soulSummonerAddress)
    case 'erc20':
      return await getErc20(erc20, tokenAddress, soulSummonerAddress)
  }
}

export async function getPool(abi, poolAddress, soulSummonerAddress) {
  const calls = [
    {
      address: poolAddress,
      name: 'getReserves',
    },
    {
      address: poolAddress,
      name: 'totalSupply',
    },
    {
      address: poolAddress,
      name: 'balanceOf',
      params: [soulSummonerAddress],
    },
    {
      address: poolAddress,
      name: 'decimals',
    },
  ]

  const [reserves, totalSupply, staked] = await multicall(abi, calls)

  return {
    q0: reserves._reserve0._hex,
    q1: reserves._reserve1._hex,
    totalSupply: new BigNumber(totalSupply).div(DEFAULT_TOKEN_DECIMAL).toJSON(),
    staked: new BigNumber(staked).div(DEFAULT_TOKEN_DECIMAL).toJSON(),
  }
}

export async function getErc20(abi, tokenAddress, soulSummonerAddress) {
  const calls = [
    {
      address: tokenAddress,
      name: 'totalSupply',
    },
    {
      address: tokenAddress,
      name: 'balanceOf',
      params: [soulSummonerAddress],
    },
    {
      address: tokenAddress,
      name: 'decimals',
    },
  ]

  const [totalSupply, staked, [decimals]] = await multicall(abi, calls)

  return {
    decimals,
    address: tokenAddress,
    totalSupply: new BigNumber(totalSupply).div(BIG_TEN.pow(decimals)).toJSON(),
    staked: new BigNumber(staked).div(BIG_TEN.pow(decimals)).toJSON(),
    tokens: [tokenAddress],
  }
}

export async function getToken(tokenAddress, soulSummonerAddress) {
  let type = window.localStorage.getItem(tokenAddress)

  if (tokenAddress.toLowerCase() === WNATIVE[250].toLowerCase()) {
    type = 'erc20'
  }

  if (type) return getStoredToken(type, tokenAddress, soulSummonerAddress)

  try {
    const soulPool = await getPool(PAIR_ABI, tokenAddress, soulSummonerAddress)
    window.localStorage.setItem(tokenAddress, 'soulswap')
    return soulPool
  } catch (e) {
    console.log(e)
  }

  try {
    const erc20tok = await getErc20(erc20, tokenAddress, soulSummonerAddress)
    window.localStorage.setItem(tokenAddress, 'erc20')
    return erc20tok
  } catch (e) {
    console.log(e)
  }
}

const getSoulPrices = (prices, pool) => {
  var t0 = pool.token0
  var p0 = getParameterCaseInsensitive(prices, pool.token0.address)
  var t1 = pool.token1
  var p1 = getParameterCaseInsensitive(prices, pool.token1.address)

  if (p0 == null && p1 == null) {
    console.log(`Missing prices for tokens ${pool.token0} and ${pool.token1}.`)
    return undefined
  }
  if (t0?.decimals == null) {
    console.log(`Missing information for token ${pool.token0}.`)
    return undefined
  }
  if (t1?.decimals == null) {
    console.log(`Missing information for token ${pool.token1}.`)
    return undefined
  }

  var q0 = pool.q0 / 10 ** t0.decimals
  var q1 = pool.q1 / 10 ** t1.decimals
  if (p0 == null) {
    p0 = (q1 * p1) / q0
    prices[pool.token0.address] = p0
  }
  if (p1 == null) {
    p1 = (q0 * p0) / q1
    prices[pool.token1.address] = p1
  }
  var tvl = q0 * p0 + q1 * p1
  var price = tvl / pool.totalSupply
  prices[pool.lpAddress] = price
  var stakedTvl = pool.staked * price

  return {
    t0: t0,
    p0: p0,
    q0: q0,
    t1: t1,
    p1: p1,
    q1: q1,
    price: price,
    tvl: tvl,
    stakedTvl: stakedTvl,
  }
}

const getErc20Prices = (prices, pool) => {
  var price = getParameterCaseInsensitive(prices, pool.address)
  var tvl = (pool.totalSupply * price) / 10 ** pool.decimals
  var stakedTvl = pool.staked * price
  return {
    stakedTvl: stakedTvl,
    price: price,
    stakeTokenTicker: pool.symbol,
    tvl: tvl,
  }
}

export function getPoolPrices(prices, pool) {
  if (pool.token1) return getSoulPrices(prices, pool)
  return getErc20Prices(prices, pool)
}

const ARCHIVED_FARMS_PID = [2]

export const isArchivedPid = (pid) => ARCHIVED_FARMS_PID.includes(pid)