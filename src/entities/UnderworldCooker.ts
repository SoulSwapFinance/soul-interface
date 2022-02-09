import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { COFFIN_BOX_ADDRESS, ChainId, WNATIVE } from 'sdk'
import UNDERWORLD_PAIR_ABI from 'constants/abis/underworldpair.json'
import { toShare } from 'functions/coffinbox'
import { getProviderOrSigner, getSigner } from 'functions/contract'
import { ZERO } from 'functions/math'
import { toElastic } from 'functions/rebase'
import { UnderworldPermit } from 'hooks/useUnderworldApproveCallback'

export async function signMasterContractApproval(
  coffinBoxContract: Contract | null,
  masterContract: string | undefined,
  user: string,
  library: Web3Provider | undefined,
  approved: boolean,
  chainId: ChainId | undefined
): Promise<string> {
  const warning = approved ? 'Give FULL access to funds in (and approved to) CoffinBox?' : 'Revoke access to CoffinBox?'
  const nonce = await coffinBoxContract?.nonces(user)
  const message = {
    warning,
    user,
    masterContract,
    approved,
    nonce,
  }

  const typedData = {
    types: {
      SetMasterContractApproval: [
        { name: 'warning', type: 'string' },
        { name: 'user', type: 'address' },
        { name: 'masterContract', type: 'address' },
        { name: 'approved', type: 'bool' },
        { name: 'nonce', type: 'uint256' },
      ],
    },
    primaryType: 'SetMasterContractApproval',
    domain: {
      name: 'CoffinBox',
      chainId: chainId,
      verifyingContract: coffinBoxContract?.address,
    },
    message: message,
  }
  const signer = getSigner(library, user)
  return signer._signTypedData(typedData.domain, typedData.types, typedData.message)
}

enum Action {
  ADD_ASSET = 1,
  REPAY = 2,
  REMOVE_ASSET = 3,
  REMOVE_COLLATERAL = 4,
  BORROW = 5,
  GET_REPAY_SHARE = 6,
  GET_REPAY_PART = 7,
  ACCRUE = 8,

  // Functions that don't need accrue to be called
  ADD_COLLATERAL = 10,
  UPDATE_EXCHANGE_RATE = 11,

  // Function on CoffinBox
  COFFIN_DEPOSIT = 20,
  COFFIN_WITHDRAW = 21,
  COFFIN_TRANSFER = 22,
  COFFIN_TRANSFER_MULTIPLE = 23,
  COFFIN_SETAPPROVAL = 24,

  // Any external call (except to CoffinBox)
  CALL = 30,
}

export default class UnderworldCooker {
  private pair: any
  private account: string
  private library: Web3Provider | undefined
  private chainId: ChainId

  private actions: Action[]
  private values: BigNumber[]
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
    this.chainId = chainId || 1

    this.actions = []
    this.values = []
    this.datas = []
  }

  add(action: Action, data: string, value: BigNumberish = 0): void {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
  }

  approve(permit: UnderworldPermit): void {
    if (permit) {
      this.add(
        Action.COFFIN_SETAPPROVAL,
        defaultAbiCoder.encode(
          ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
          [permit.account, permit.masterContract, true, permit.v, permit.r, permit.s]
        )
      )
    }
  }

  updateExchangeRate(mustUpdate = false, minRate = ZERO, maxRate = ZERO): UnderworldCooker {
    this.add(
      Action.UPDATE_EXCHANGE_RATE,
      defaultAbiCoder.encode(['bool', 'uint256', 'uint256'], [mustUpdate, minRate, maxRate])
    )
    return this
  }

  coffinDepositAssetShare(share: BigNumber): UnderworldCooker {
    const useNative = this.pair.asset.address === WNATIVE[this.chainId].address

    this.add(
      Action.COFFIN_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.asset.address, this.account, 0, share]
      ),
      useNative ? share : ZERO
    )

    return this
  }

  coffinDepositCollateral(amount: BigNumber): UnderworldCooker {
    const useNative = this.pair.collateral.address === WNATIVE[this.chainId].address

    this.add(
      Action.COFFIN_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.collateral.address, this.account, amount, 0]
      ),
      useNative ? amount : ZERO
    )

    return this
  }

  coffinWithdrawCollateral(amount: BigNumber, share: BigNumber): UnderworldCooker {
    const useNative = this.pair.collateral.address === WNATIVE[this.chainId].address

    this.add(
      Action.COFFIN_WITHDRAW,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.collateral.address, this.account, amount, share]
      ),
      useNative ? amount : ZERO
    )

    return this
  }

  coffinTransfer(share: BigNumber, toAddress: string): UnderworldCooker {
    this.add(
      Action.COFFIN_TRANSFER,
      defaultAbiCoder.encode(['address', 'address', 'int256'], [COFFIN_BOX_ADDRESS[this.chainId], toAddress, share])
    )

    return this
  }

  coffinTransferCollateral(share: BigNumber, toAddress: string): UnderworldCooker {
    this.add(
      Action.COFFIN_TRANSFER,
      defaultAbiCoder.encode(['address', 'address', 'int256'], [this.pair.collateral.address, toAddress, share])
    )

    return this
  }

  coffinTransferAsset(share: BigNumber, toAddress: string): UnderworldCooker {
    this.add(
      Action.COFFIN_TRANSFER,
      defaultAbiCoder.encode(['address', 'address', 'int256'], [this.pair.asset.address, toAddress, share])
    )

    return this
  }

  repayShare(part: BigNumber): UnderworldCooker {
    this.add(Action.GET_REPAY_SHARE, defaultAbiCoder.encode(['int256'], [part]))

    return this
  }

  addCollateral(amount: BigNumber, fromCoffin: boolean): UnderworldCooker {
    let share: BigNumber
    if (fromCoffin) {
      share = amount.lt(0) ? amount : toShare(this.pair.collateral, amount)
    } else {
      const useNative = this.pair.collateral.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.collateral.address, this.account, amount, 0]
        ),
        useNative ? amount : ZERO
      )
      share = BigNumber.from(-2)
    }

    this.add(Action.ADD_COLLATERAL, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))
    return this
  }

  addAsset(amount: BigNumber, fromCoffin: boolean, burnShare: boolean = false): UnderworldCooker {
    let share: BigNumber
    if (fromCoffin) {
      share = toShare(this.pair.asset, amount)
    } else {
      const useNative = this.pair.asset.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, amount, 0]
        ),
        useNative ? amount : ZERO
      )
      share = BigNumber.from(-2)
    }

    this.add(Action.ADD_ASSET, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))

    if (burnShare) {
      this.removeAsset(BigNumber.from(1), true)
      this.coffinTransferAsset(BigNumber.from(1), '0x000000000000000000000000000000000000dead')
    }

    return this
  }

  removeAsset(fraction: BigNumber, toCoffin: boolean): UnderworldCooker {
    this.add(Action.REMOVE_ASSET, defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account]))
    if (!toCoffin) {
      const useNative = this.pair.asset.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, 0, -1]
        )
      )
    }
    return this
  }

  removeCollateral(share: BigNumber, toCoffin: boolean): UnderworldCooker {
    this.add(Action.REMOVE_COLLATERAL, defaultAbiCoder.encode(['int256', 'address'], [share, this.account]))
    if (!toCoffin) {
      const useNative = this.pair.collateral.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.collateral.address, this.account, 0, share]
        )
      )
    }
    return this
  }

  removeCollateralFraction(fraction: BigNumber, toCoffin: boolean): UnderworldCooker {
    this.add(Action.REMOVE_COLLATERAL, defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account]))
    if (!toCoffin) {
      const useNative = this.pair.collateral.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.collateral.address, this.account, 0, -1]
        )
      )
    }
    return this
  }

  borrow(amount: BigNumber, toCoffin: boolean, toAddress = ''): UnderworldCooker {
    this.add(
      Action.BORROW,
      defaultAbiCoder.encode(['int256', 'address'], [amount, toAddress && toCoffin ? toAddress : this.account])
    )
    if (!toCoffin) {
      const useNative = this.pair.asset.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, toAddress || this.account, amount, 0]
        )
      )
    }
    return this
  }

  repay(amount: BigNumber, fromCoffin: boolean): UnderworldCooker {
    if (!fromCoffin) {
      const useNative = this.pair.asset.address === WNATIVE[this.chainId].address

      this.add(
        Action.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, amount, 0]
        ),
        useNative ? amount : ZERO
      )
    }
    this.add(Action.GET_REPAY_PART, defaultAbiCoder.encode(['int256'], [fromCoffin ? amount : -1]))
    this.add(Action.REPAY, defaultAbiCoder.encode(['int256', 'address', 'bool'], [-1, this.account, false]))
    return this
  }

  repayPart(part: BigNumber, fromCoffin: boolean): UnderworldCooker {
    if (!fromCoffin) {
      const useNative = this.pair.asset.address === WNATIVE[this.chainId].address

      this.add(Action.GET_REPAY_SHARE, defaultAbiCoder.encode(['int256'], [part]))
      this.add(
        Action.COFFIN_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.address, this.account, 0, -1]
        ),
        // TODO: Put some warning in the UI or not allow repaying ETH directly from wallet, because this can't be pre-calculated
        useNative ? 
        toShare(
          this.pair.asset, 
          toElastic(this.pair.totalBorrow, part, true))
          .mul(BigNumber.from(1001)).div(BigNumber.from(1000))
          : BigNumber.from(ZERO)
      )
    }
    this.add(Action.REPAY, defaultAbiCoder.encode(['int256', 'address', 'bool'], [part, this.account, false]))
    return this
  }

  action(
    address: string,
    value: BigNumberish,
    data: string,
    useValue1: boolean,
    useValue2: boolean,
    returnValues: number
  ): void {
    this.add(
      Action.CALL,
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
          value: this.values.reduce((a, b) => a.add(b), ZERO),
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