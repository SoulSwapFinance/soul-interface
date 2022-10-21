import { gql } from "@apollo/client";

export const FETCH_TOKEN_PRICE = gql`
  query Price($to: String!) {
    price(to: $to) {
      price
    }
  }
`;

export const FETCH_GAS_PRICE = gql`
  query GasPrice {
    gasPrice
  }
`;

export const FETCH_ACCOUNT_BALANCE = gql`
  query AccountByAddress($address: Address!) {
    account(address: $address) {
      address
      balance
    }
  }
`;

export const FETCH_ACCOUNT_TRANSACTION_HISTORY = gql`
  query AccountHistoryByAddress(
    $address: Address!
    $cursor: Cursor
    $count: Int!
  ) {
    account(address: $address) {
      address
      balance
      txCount
      txList(cursor: $cursor, count: $count) {
        pageInfo {
          first
          last
          hasNext
          hasPrevious
        }
        totalCount
        edges {
          cursor
          transaction {
            hash
            from
            to
            value
            gasUsed
            status
            block {
              number
              timestamp
            }
            inputData
            tokenTransactions {
              tokenAddress
              tokenName
              tokenSymbol
              tokenType
              type
              amount
              tokenId
              sender
              recipient
            }
          }
        }
      }
    }
  }
`;

export const FETCH_ERC20_TOKEN_LIST = gql`
  query ERC20TokenList {
    erc20TokenList {
      address
      name
      symbol
      decimals
      totalSupply
      logoURL
    }
  }
`;

export const FETCH_ERC20_TOKEN_LIST_AND_BALANCE = gql`
  query ERC20TokenList($owner: Address!, $count: Int!) {
    erc20TokenList(count: $count) {
      address
      name
      symbol
      decimals
      totalSupply
      logoURL
      balanceOf(owner: $owner)
    }
  }
`;

export const FETCH_ERC20_ASSETS = gql`
  query ERC20Assets($owner: Address!) {
    erc20Assets(owner: $owner) {
      address
      name
      symbol
      decimals
      totalSupply
      logoURL
      balanceOf(owner: $owner)
    }
  }
`;

export const FETCH_FMINT_ACCOUNT_BY_ADDRESS = gql`
  query FMintAccountByAddress($address: Address!) {
    fMintAccount(owner: $address) {
      collateralValue
      debtValue
      collateral {
        balance
        value
        token {
          name
          symbol
          address
          decimals
          logoUrl
        }
      }
    }
  }
`;

export const FETCH_DELEGATIONS_BY_ADDRESS = gql`
  query DelegationsByAddress($address: Address!) {
    delegationsByAddress(address: $address) {
      totalCount
      edges {
        delegation {
          address
          toStakerId
          amountDelegated
          outstandingSFTM
          createdTime
          amount
          withdrawRequests {
            withdrawRequestID
            amount
            createdTime
            withdrawTime
          }
          claimedReward
          pendingRewards {
            amount
          }
          isDelegationLocked
          lockedAmount
          lockedFromEpoch
          lockedUntil
          tokenizerAllowedToWithdraw
        }
      }
    }
  }
`;

export const FETCH_STAKERS = gql`
  query Stakers {
    stakers {
      id
      stakerAddress
      totalStake
      stake
      totalDelegatedLimit
      delegatedLimit
      createdTime
      downtime
      lockedUntil
      isStakeLocked
      isActive
      lockedFromEpoch
      stakerInfo {
        name
        website
        contact
        logoUrl
      }
      delegations {
        totalCount
      }
    }
  }
`;

export const FETCH_GOVERNANCE_CONTRACTS = gql`
  query GovernanceContracts {
    govContracts {
      name
      address
      totalProposals
    }
  }
`;

const generateVoteFragments = (address, delegatedTo) => {
  const votes = delegatedTo.map(
    (
      delegate
    ) => `vote_${delegate[0]}: vote(from: "${address}", delegatedTo: "${delegate[1]}") {
            from
            delegatedTo
            weight
            choices
          }`
  );
  return votes.join(" ");
};

export const FETCH_GOVERNANCE_PROPOSALS = (
  address = null,
  delegatedToList = []
) => {
  const votes =
    address && delegatedToList?.length
      ? generateVoteFragments(address, delegatedToList)
      : ``;
  const query =
    `
    query GovernanceProposals(
    $cursor: Cursor
    $count: Int!
    $activeOnly: Boolean!
  ) {
    govProposals(cursor: $cursor, count: $count, activeOnly: $activeOnly) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        proposal {
          id
          name
          description
          contract
          governanceId
          options
          state {
            isResolved
            status
            winnerId
          }
          minVotes
          minAgreement
          totalWeight
          votedWeightRatio
          votingStarts
          votingMayEnd
          votingMustEnd
          ` +
    votes +
    `      
        }
        cursor
      }
    }
  }
`;
  return gql`
    ${query}
  `;
};

export const FETCH_GOVERNANCE_PROPOSAL = (
  address = null,
  delegatedToList = []
) => {
  const votes =
    address && delegatedToList?.length
      ? generateVoteFragments(address, delegatedToList)
      : ``;

  const query =
    `query GovernanceContract($address: Address!, $from: Address!, $id: BigInt!) {
          govContract(address: $address) {
              name
              address
              totalProposals
              totalVotingPower
              canVote(from: $from)
              delegationsBy(from: $from)
              proposal(id: $id) {
                  name
                  id
                  description
                  contract
                  opinionScales
                  options
                  state {
                      isResolved
                      status
                      winnerId
                  }
                  minVotes
                  minAgreement
                  totalWeight
                  votedWeightRatio
                  votingStarts
                  votingMayEnd
                  votingMustEnd 
                  optionStates {
                    optionId
                    votes
                    agreement
                    agreementRatio
                  }
                  ` +
    votes +
    `

              }
          }
      }`;
  return gql`
    ${query}
  `;
};

export const FETCH_ESTIMATED_REWARDS = gql`
  query estimateRewards($address: Address!) {
    estimateRewards(address: $address) {
      currentRewardRateYearly
    }
  }
`;