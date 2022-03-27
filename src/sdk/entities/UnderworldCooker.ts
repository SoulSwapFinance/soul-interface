import { ChainId, WNATIVE_ADDRESS, ZERO, getProviderOrSigner, toElastic } from 'sdk'

import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JSBI } from 'sdk'
import UNDERWORLD_PAIR_ABI from 'constants/abis/underworldpair.json'
import { UnderworldAction } from '../enums'
import { UnderworldPermit } from '../interfaces'
import { Web3Provider } from '@ethersproject/providers'
import { defaultAbiCoder } from '@ethersproject/abi'
import { toShare } from '../functions'

export class UnderworldCooker {
  private pair: any
  private account: string
  private library: Web3Provider | undefined
  private chainId: ChainId

  private actions: UnderworldAction[]
  private values: JSBI[]
  private datas: string[]

  constructor(
    pair: any,
    account: string | null | undefined,
    library: Web3Provider | undefined,
    chainId: ChainId | undefined
  ) {
    this.pair = pair
    this.account = account || AddressZero
    this.library = library
    this.chainId = chainId || 250

    this.actions = []
    this.values = []
    this.datas = []
  }

  add(action: UnderworldAction, data: string, value: JSBI = ZERO): void {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(value)
  }

  approve(permit: UnderworldPermit): void {
    if (permit) {
      this.add(
        UnderworldAction.COFFIN_SETAPPROVAL,
        defaultAbiCoder.encode(
          ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
          [permit.account, permit.masterContract, true, permit.v, permit.r, permit.s]
        )
      )
    }
  }

  updateExchangeRate(mustUpdate = false, minRate = ZERO, maxRate = ZERO): UnderworldCooker {
    this.add(
      UnderworldAction.UPDATE_EXCHANGE_RATE,
      defaultAbiCoder.encode(['bool', 'uint256', 'uint256'], [mustUpdate, minRate, maxRate])
    )
    return this
  }

  coffinDepositCollateral(amount: JSBI): UnderworldCooker {
    const useNative = this.pair.collateral.address === WNATIVE_ADDRESS[this.chainId]

    this.add(
      UnderworldAction.COFFIN_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.collateral.address, this.account, amount, 0]
      ),
      useNative ? amount : ZERO
    )

    return this
  }

  coffinWithdrawCollateral(amount: JSBI, share: JSBI): UnderworldCooker {
    const useNative = this.pair.collateral.address === WNATIVE_ADDRESS[this.chainId]

    this.add(
      UnderworldAction.COFFIN_WITHDRAW,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.collateral.address, this.account, amount, share]
      ),
      useNative ? amount : ZERO
    )

    return this
  }

  coffinTransferCollateral(share: JSBI, toAddress: string): UnderworldCooker {
    this.add(
      UnderworldAction.COFFIN_TRANSFER,
      defaultAbiCoder.encode(['address', 'address', 'int256'], [this.pair.collateral.address, toAddress, share])
    )

    return this
  }

  repayShare(part: JSBI): UnderworldCooker {
    this.add(UnderworldAction.GET_REPAY_SHARE, defaultAbiCoder.encode(['int256'], [part]))

    return this
  }

  addCollateral(amount: JSBI, fromCoffin: boolean): UnderworldCooker {
    let share: JSBI
    if (fromCoffin) {
      share = JSBI.lessThan(amount, ZERO) ? amount : toShare(this.pair.collateral, amount)
    } else {
      const useNative = this.pair.collateral.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.collateral.address, this.account, amount, 0]
        ),
        useNative ? amount : ZERO
      )
      share = JSBI.BigInt(-2)
    }

    this.add(
      UnderworldAction.ADD_COLLATERAL,
      defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false])
    )
    return this
  }

  addAsset(amount: JSBI, fromCoffin: boolean): UnderworldCooker {
    let share: JSBI
    if (fromCoffin) {
      share = toShare(this.pair.asset, amount)
    } else {
      const useNative = this.pair.asset.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, amount, 0]
        ),
        useNative ? amount : ZERO
      )
      share = JSBI.BigInt(-2)
    }

    this.add(UnderworldAction.ADD_ASSET, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))
    return this
  }

  removeAsset(fraction: JSBI, toCoffin: boolean): UnderworldCooker {
    this.add(UnderworldAction.REMOVE_ASSET, defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account]))
    if (!toCoffin) {
      const useNative = this.pair.asset.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, 0, -1]
        )
      )
    }
    return this
  }

  removeCollateral(share: JSBI, toCoffin: boolean): UnderworldCooker {
    this.add(UnderworldAction.REMOVE_COLLATERAL, defaultAbiCoder.encode(['int256', 'address'], [share, this.account]))
    if (!toCoffin) {
      const useNative = this.pair.collateral.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.collateral.address, this.account, 0, share]
        )
      )
    }
    return this
  }

  removeCollateralFraction(fraction: JSBI, toCoffin: boolean): UnderworldCooker {
    this.add(UnderworldAction.REMOVE_COLLATERAL, defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account]))
    if (!toCoffin) {
      const useNative = this.pair.collateral.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.collateral.address, this.account, 0, -1]
        )
      )
    }
    return this
  }

  borrow(amount: JSBI, toCoffin: boolean, toAddress = ''): UnderworldCooker {
    this.add(
      UnderworldAction.BORROW,
      defaultAbiCoder.encode(['int256', 'address'], [amount, toAddress && toCoffin ? toAddress : this.account])
    )
    if (!toCoffin) {
      const useNative = this.pair.asset.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, toAddress || this.account, amount, 0]
        )
      )
    }
    return this
  }

  repay(amount: JSBI, fromCoffin: boolean): UnderworldCooker {
    if (!fromCoffin) {
      const useNative = this.pair.asset.address === WNATIVE_ADDRESS[this.chainId]

      this.add(
        UnderworldAction.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, amount, 0]
        ),
        useNative ? amount : ZERO
      )
    }
    this.add(UnderworldAction.GET_REPAY_PART, defaultAbiCoder.encode(['int256'], [fromCoffin ? amount : -1]))
    this.add(UnderworldAction.REPAY, defaultAbiCoder.encode(['int256', 'address', 'bool'], [-1, this.account, false]))
    return this
  }

  repayPart(part: JSBI, fromCoffin: boolean): UnderworldCooker {
    if (!fromCoffin) {
      const useNative = this.pair.asset.address === WNATIVE_ADDRESS[this.chainId]

      this.add(UnderworldAction.GET_REPAY_SHARE, defaultAbiCoder.encode(['int256'], [part]))
      this.add(
        UnderworldAction.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, 0, -1]
        ),
        // TODO: Put some warning in the UI or not allow repaying ETH directly from wallet, because this can't be pre-calculated
        useNative
          ? JSBI.divide(
              JSBI.multiply(toShare(this.pair.asset, toElastic(this.pair.totalBorrow, part, true)), JSBI.BigInt(1001)),
              JSBI.BigInt(1000)
            )
          : ZERO
      )
    }
    this.add(UnderworldAction.REPAY, defaultAbiCoder.encode(['int256', 'address', 'bool'], [part, this.account, false]))
    return this
  }

  action(
    address: string,
    value: JSBI,
    data: string,
    useValue1: boolean,
    useValue2: boolean,
    returnValues: number
  ): void {
    this.add(
      UnderworldAction.CALL,
      defaultAbiCoder.encode(
        ['address', 'bytes', 'bool', 'bool', 'uint8'],
        [address, data, useValue1, useValue2, returnValues]
      ),
      value
    )
  }

  async cook() {
    if (!this.library) {
      return {
        success: false,
      }
    }

    const underworldPairCloneContract = new Contract(
      this.pair.address,
      UNDERWORLD_PAIR_ABI,
      getProviderOrSigner(this.library, this.account) as any
    )

    try {
      return {
        success: true,
        tx: await underworldPairCloneContract.cook(this.actions, this.values, this.datas, {
          value: this.values.reduce((a, b) => JSBI.add(a, b), ZERO),
        }),
      }
    } catch (error) {
      console.error('UnderworldCooker Error: ', error)
      return {
        success: false,
        error: error,
      }
    }
  }
}