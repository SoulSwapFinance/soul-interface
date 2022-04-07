// Voting

/* eslint-disable camelcase */
/**
 * @see https://hub.snapshot.page/graphql
 */
 export interface VoteWhere {
    id?: string
    id_in?: string[]
    voter?: string
    voter_in?: string[]
    proposal?: string
    proposal_in?: string[]
}

export interface Vote {
    id: string
    voter: string
    created: number
    space: Space
    proposal: {
      choices: Proposal['choices']
    }
    choice: number
    metadata?: {
      votingPower: string
    }
}

export enum SnapshotCommand {
    PROPOSAL = 'proposal',
    VOTE = 'vote',
}

export enum ProposalState {
    ACTIVE = 'active',
    PENDING = 'pending',
    CLOSED = 'closed',
}

export enum ProposalType {
    ALL = 'all',
    CORE = 'core',
    COMMUNITY = 'community',
}

export interface Space {
    id: string
    name: string
}
  
export interface Proposal {
    author: string
    body: string
    choices: string[]
    end: number
    id: string
    snapshot: string
    space: Space
    votes: number
    start: number
    state: ProposalState
    title: string
}
  
export enum FetchStatus {
    NOT_FETCHED = 'not-fetched',
    FETCHING = 'fetching',
    SUCCESS = 'success'
}