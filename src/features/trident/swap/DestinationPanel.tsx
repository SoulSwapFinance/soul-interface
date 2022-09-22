import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Input from 'components/Input'
import Typography from 'components/Typography'
import { selectTridentSwap, setRecipient } from 'features/trident/swap/swapSlice'
import { classNames } from 'functions/styling'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import React, { useEffect } from 'react'

const DestinationPanel = () => {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { destination, setDestination } = useState(chainId)
 
  // const { recipient } = useAppSelector(selectTridentSwap)
  const dispatch = useAppDispatch()
  const valid = [1, 250, 43114].includes(chainId)
  const error = !valid

  useEffect(() => {
   if (destination === undefined) {
    return (
      <div className="flex justify-center">
        <Typography
          id="btn-add-destination"
          variant="sm"
          weight={700}
          className="py-1 cursor-pointer text-blue"
          onClick={() => dispatch(setDestination(chainId))}
        >
          {i18n._(t`+ Add Destination (optional)`)}
        </Typography>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        destination && chainId !== destination ? 'lg:pb-0' : 'lg:pb-5',
        'border border-dark-700 flex flex-col lg:p-5 rounded lg:gap-3'
      )}
    >
      <div className="flex justify-between px-4 py-2 border-b border-dark-700 lg:border-transparent lg:p-0">
        <Typography variant="xs" className="text-secondary" weight={700}>
          {i18n._(t`Destination Chain:`)}
        </Typography>
        <Typography variant="xs" className="text-blue" weight={700} onClick={() => dispatch(setDestination(undefined))}>
          {i18n._(t`Remove Destination`)}
        </Typography>
      </div>
      <div className="flex flex-col">
        <Input.Numeric
          id="destination-input"
          // placeholder={ chainId }
          onUserInput={(val) => dispatch(setDestination(val))}
          value={destination}
          className={classNames(
            error ? 'border-red/50' : 'border-transparent',
            valid ? 'border-green/40' : 'border-transparent',
            'border text-inherit w-full lg:bg-dark-1000 lg:rounded-full px-4 lg:py-2 py-5 font-bold'
          )}
          fontSize="14px"
        />
      </div>
    </div>
  )
}

export default DestinationPanel