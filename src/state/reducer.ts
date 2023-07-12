import { combineReducers } from '@reduxjs/toolkit'
import portfolio from 'features/portfolio/portfolioSlice'
import tridentAdd from '../features/trident/add/addSlice'
import tridentSwap from '../features/trident/swap/swapSlice'
import application from './application/reducer'
import burn from './burn/reducer'
import tokens from './tokens/slice'
import create from './create/reducer'
import defarms from './defarms/reducer'
import web3Context from './global/web3ContextSlice'
import limitOrder from './limit-order/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import fees from './fees/reducer'
import slippage from './slippage/slippageSlice'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import order from './order/reducer'
import gtransactions from './gtransactions/reducer'
import zap from './zap/reducer'
import { gelatoReducers } from 'soulswap-limit-orders-react'
import customizeDexes from './customizeDexes'

const reducer = combineReducers({
  application,
  user,
  defarms,
  customizeDexes,
  transactions,
  fees,
  swap,
  mint,
  burn,
  multicall,
  lists,
  limitOrder,
  order,
  create,
  portfolio,
  slippage,
  gtransactions,
  tokens,
  tridentSwap,
  tridentAdd,
  web3Context,
  zap,
  ...gelatoReducers,
})

export default reducer