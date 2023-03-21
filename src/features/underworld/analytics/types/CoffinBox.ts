import { UnderworldPair } from "./UnderworldPair"
import { Token } from "./Token"
import { User } from "./User"

export type CoffinBox = {
  id: string
  users?: User[]
  tokens?: Token[]
  kashiPairs?: UnderworldPair[]
  totalTokens?: BigInt
  totalUnderworldPairs?: BigInt
  totalUsers?: BigInt
  block?: BigInt
  timestamp?: BigInt
}