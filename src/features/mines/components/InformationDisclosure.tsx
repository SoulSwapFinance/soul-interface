import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'components/Modal'
import React, { Fragment } from 'react'

import NavLink from 'components/NavLink'
import Typography from 'components/Typography'
import { PairType } from '../enum'

// @ts-ignore TYPE NEEDS FIXING
const InformationDisclosure = ({ farm }) => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col gap-6 p-2">
      <HeadlessUiModal.Header header={i18n._(t`How to Participate?`)} />
      <div className="flex flex-col gap-1">
        <Typography variant="xs" weight={700} className="text-white">
          {i18n._(t`Step One`)}
        </Typography>
        {/* {farm.pair.type === PairType.SWAP && ( */}
        { farm.pair.token1 && (
        <>
          <Typography variant="xs">
            {i18n._(t`Provide liquidity to the`)}
            {` `}
            {farm.pair.token0?.symbol == 'FTM' ?
              <NavLink href={
                `/add/FTM/${farm.pair.token1?.id}`}
              >
                <a className="text-sm text-blue">
                  {farm.pair.token0?.symbol}/{farm.pair.token1?.symbol}
                </a>
              </NavLink>
              :
              farm.pair.token1?.symbol == 'FTM' ?
                <NavLink href={
                  `/add/${farm.pair.token0?.id}/FTM`}
                >
                  <a className="text-sm text-blue">
                    {farm.pair.token0.symbol}/{farm.pair.token1.symbol}
                  </a>
                </NavLink>
                :
                <NavLink href={`/add/${farm.pair.token0?.id}/${farm.pair.token1?.id}`}>
                  <a className="text-sm text-blue">
                    {farm.pair.token0.symbol}/{farm.pair.token1.symbol}
                  </a>
                </NavLink>
            }
            {` `}
            {i18n._(t`liquidity pool.`)}
            {/* {i18n._(t`pool (or`)} */}
            {` `}
            {/* <NavLink href={`/migrate`}>
              <a className="text-sm text-blue">migrate liquidity</a>
            </NavLink>
            {i18n._(t`) to receive LP tokens.`)} */}
          </Typography>
        </>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="xs" weight={700} className="text-white">
          {i18n._(t`Step Two`)}
        </Typography>
        <Typography variant="xs">
          {i18n._(t`Approve and then deposit your`)}
          {` `}
          {farm.pair.type === PairType.UNDERWORLD ? `UMP` : `LP`}
          {` `}
          {i18n._(t`tokens into the farm to start earning rewards.`)}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="xs" weight={700} className="text-white">
          {i18n._(t`Step Three`)}
        </Typography>
        {/* {farm.pair.type === PairType.SWAP && ( */}
          <Typography variant="xs">
            {i18n._(t`Harvest rewards and unstake your LP tokens at any time. You can then remove your liquidity to receive your base investment tokens back in your wallet.`
            )}
          </Typography>
        {/* )} */}
        {farm.pair.type === PairType.UNDERWORLD && (
          <Typography variant="xs">
            {i18n._(t`Harvest rewards and unstake your UMP tokens at any time. You can then withdraw your lent`)}
            {` `}
            {farm.pair.token0.symbol}
            {` `}
            {i18n._(t`into your wallet or CoffinBox.`)}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default InformationDisclosure
