import { ChainId, Currency, CurrencyAmount, JSBI, Token } from '../../sdk'
import { MERKLE_ROOT, SOUL } from './../../constants/index'
import { getAddress, isAddress } from '@ethersproject/address'
import { useEffect, useState } from 'react'

import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from '../../functions/trade'
import { useActiveWeb3React } from 'services/web3'
import { useMerkleDistributorContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../multicall/hooks'
import { useTransactionAdder } from '../transactions/hooks'

interface UserClaimData {
  index: number
  amount: string
  proof: string[]
  flags?: {
    isLP: boolean
    isUser: boolean
  }
}

const CLAIM_PROMISES: { [key: string]: Promise<any | UserClaimData | null> } = {}

// returns the claim for the given address, or null if not valid
function fetchClaim(account: string, chainId: ChainId): Promise<any | UserClaimData | null> {
  if (!isAddress(account)) return Promise.reject(new Error('Invalid address'))
  const key = `${chainId}:${account}`
  // console.log('CLAIM_PROMISE:', CLAIM_PROMISES[key], key)
  return (CLAIM_PROMISES[key] =
    CLAIM_PROMISES[key] ??
    fetch(MERKLE_ROOT)
      .then((response) => response.json())
      .then((data) => {
        const claim: typeof data.claims[0] | undefined = data.claims[getAddress(account)] ?? undefined
        if (!claim) return null

        // console.log('claim:', claim)
        return {
          index: claim.index,
          amount: claim.amount,
          proof: claim.proof,
        }
      })
      .catch((error) => console.error('Failed to get claim data', error)))
}

// parse soulDistributorContract blob and detect if user has claim data
// null means we know it does not
export function useUserClaimData(account: string | null | undefined): UserClaimData | null | undefined {

  const key = `${250}:${account}`
  const [claimInfo, setClaimInfo] = useState<{
    [key: string]: UserClaimData | null
  }>({})

  useEffect(() => {
    if (!account || !250) return
    fetchClaim(account, 250).then((accountClaimInfo) =>
      setClaimInfo((claimInfo) => {
        // console.log('claimInfo:', claimInfo, accountClaimInfo, key)
        return {
          ...claimInfo,
          [key]: accountClaimInfo,
        }
      })
    )
  }, [account, 250, key])

  return account && 250 ? claimInfo[key] : undefined
}

// check if user is in blob and has not yet claimed SOUL
export function useUserHasAvailableClaim(account: string | null | undefined): boolean {
  const userClaimData = useUserClaimData(account)
  const soulDistributorContract = useMerkleDistributorContract()
  const isClaimedResult = useSingleCallResult(soulDistributorContract, 'isClaimed', [userClaimData?.index])
  // user is in blob and contract marks as unclaimed
  return Boolean(userClaimData && !isClaimedResult.loading && isClaimedResult.result?.[0] === false)
}

export function useUserUnclaimedAmount(account: string | null | undefined): CurrencyAmount<Currency> | undefined {
  const userClaimData = useUserClaimData(account)
  const canClaim = useUserHasAvailableClaim(account)

  const soul = SOUL[250]

  console.log('claimStats:', {
    canClaim: canClaim,
    userClaimData: userClaimData,
    soul: soul
  })

  if (!soul) return undefined
  if (!canClaim || !userClaimData) {
    return CurrencyAmount.fromRawAmount(soul, JSBI.BigInt(0))
  }
  return CurrencyAmount.fromRawAmount(soul, JSBI.BigInt(userClaimData.amount))
}

export function useClaimCallback(account: string | null | undefined): {
  claimCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  const claimData = useUserClaimData(account)

  // used for popup summary
  const unClaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedAmount(account)
  const addTransaction = useTransactionAdder()
  const soulDistributorContract = useMerkleDistributorContract()

  const claimCallback = async function () {
    if (!claimData || !account || !library || !chainId || !soulDistributorContract) return

    const args = [claimData.index, account, claimData.amount, claimData.proof]

    return soulDistributorContract.estimateGas['claim'](...args, {}).then((estimatedGasLimit) => {
      return soulDistributorContract
        .claim(...args, {
          value: null,
          gasLimit: calculateGasMargin(estimatedGasLimit),
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claimed ${unClaimedAmount?.toSignificant(4)} SOUL`,
            claim: { recipient: account },
          })
          return response.hash
        })
    })
  }

  return { claimCallback }
}
