import { ChainId, ChainKey, Token } from 'sdk'

import { Fee } from '../enums/Fee'
import EXPORTS from '../abis/all.json'
import constantProductPoolArtifact from 'sdk/abis/ConstantProductPool.json'
import { computePoolInitCodeHash } from './computePoolInitCodeHash'
import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'

export const computeConstantProductPoolAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  twap,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: Fee
  twap: boolean
}): string => {
  // does safety checks
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const deployData = defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'bool'],
    [...[token0.address, token1.address].sort(), fee, twap]
  )

    // TODO: update masterDeployerAddress
  // Compute init code hash based off the bytecode, deployData & masterDeployerAddress
  const CONSTANT_PRODUCT_POOL_INIT_CODE_HASH = computePoolInitCodeHash({
    creationCode: constantProductPoolArtifact.bytecode,
    deployData,
    masterDeployerAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    // masterDeployerAddress: EXPORTS[ChainId.FANTOM][ChainKey.FANTOM].contracts.MasterDeployer.address,
  })

  // Compute pool address
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), CONSTANT_PRODUCT_POOL_INIT_CODE_HASH)
}