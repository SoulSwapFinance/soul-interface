import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import QuestionHelper from 'components/QuestionHelper'
import React from 'react'

import { Button } from 'components/Button'
import { formatPercent } from 'functions'
import { useCoffinBox } from 'hooks'

// @ts-ignore TYPE NEEDS FIXING
export default function Strategy({ token }) {
  const { harvest } = useCoffinBox()

  return (
    <>
      {token.strategy && (
        <>
          <div className="flex justify-between">
            <div className="flex flex-row">
              <div className="text-lg text-secondary">{i18n._(t`Avg. APY`)}</div>
              <QuestionHelper text="Might be lower on the pair specifically depending on it's utilization" />
            </div>
            <div className="flex items-center">
              <div className="text-lg text-high-emphesis">{formatPercent(token.strategy.apy)}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-lg text-secondary">{i18n._(t`Target Percentage`)}</div>
            <div className="flex items-center">
              <div className="text-lg text-high-emphesis">{formatPercent(token.strategy.targetPercentage)}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-lg text-secondary">{i18n._(t`Current Percentage`)}</div>
            <div className="flex items-center">
              <div className="text-lg text-high-emphesis">{formatPercent(token.strategy.utilization)}</div>
            </div>
          </div>

          <div className="flex flex-row space-x-2">
            <Button
              color="gradient"
              variant="outlined"
              size="xs"
              className="w-full"
              onClick={() => harvest(token.address, true)}
            >
              Rebalance
            </Button>
          </div>
        </>
      )}
    </>
  )
}