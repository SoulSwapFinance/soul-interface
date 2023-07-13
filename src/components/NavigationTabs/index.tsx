import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import HistoryLink from 'next/link'
import { Percent } from '../../sdk'
import React from 'react'
import { RowBetween } from '../Row'
import SettingsTab from '../Settings'
import { resetMintState } from '../../state/mint/actions'
import styled from 'styled-components'
import { useAppDispatch } from '../../state/hooks'
import NavLink from 'components/NavLink'

const Tabs = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

export function FindPoolTabs() {

  return (
    <Tabs>
      <RowBetween className="items-center text-xl">
        <HistoryLink href="/pool">
            <ArrowLeftIcon width="1em" height="1em" />
        </HistoryLink>
        <div className="font-semibold">{`Import Pool`}</div>
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({
  adding,
  creating,
  defaultSlippage,
}: {
  adding: boolean
  creating: boolean
  defaultSlippage: Percent
}) {

  // reset states on back
  const dispatch = useAppDispatch()

  return (
    <Tabs>
      <RowBetween className="items-center text-xl">
        <HistoryLink href="/add">
          <a
            onClick={() => {
              if (adding) {
                // not 100% sure both of these are needed
                dispatch(resetMintState())
              }
            }}
            className="flex items-center"
          >
            <ArrowLeftIcon width="1em" height="1em" />
          </a>
        </HistoryLink>
        <div className="font-semibold">
          {creating ? `Create Pair` : adding ? `Add Liquidity` : `Remove Liquidity`}
        </div>
        <SettingsTab placeholderSlippage={defaultSlippage} />
      </RowBetween>
    </Tabs>
  )
}

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' | 'bridge' }) {

  return (
    <Tabs style={{ marginBottom: '20px', display: 'none' }}>
      <NavLink id="swap-nav-link" to="/swap" isActive={active === 'swap'}>
        {'swap'}
      </NavLink>
      <NavLink id="bridge-nav-link" to="/cross" isActive={active === 'bridge'}>
        {'bridge'}
      </NavLink>
      <NavLink id="pool-nav-link" to="/pools" isActive={active === 'pool'}>
        {'pool'}
      </NavLink>
    </Tabs>
  )
}