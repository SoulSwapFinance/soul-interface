import { Button } from 'components/Button'
import Checkbox from 'components/Checkbox'
import ListLogo from 'components/ListLogo'
import { HeadlessUiModal } from 'components/Modal'
import Typography from 'components/Typography'
import { classNames, listVersionLabel } from 'functions'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import { useCurrencyModalContext } from 'modals/SearchModal/CurrencySearchModal'
import { AppDispatch } from 'state'
import { enableList, removeList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'
import React, { FC, useCallback, useState } from 'react'
import ReactGA from 'react-ga'
import { useDispatch } from 'react-redux'

import CurrencyModalView from './CurrencyModalView'
import { useActiveWeb3React } from 'services/web3'

const ImportList: FC = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { setView, onDismiss, listUrl, importList } = useCurrencyModalContext()
  const [confirmed, setConfirmed] = useState(false)
  const lists = useAllLists()
  const fetchList = useFetchListCallback(chainId)
  const [addError, setAddError] = useState<string>()
  const adding = Boolean(listUrl && lists[listUrl]?.loadingRequestId)
  const handleAddList = useCallback(() => {
    if (adding || !listUrl) return
    setAddError(undefined)
    fetchList(listUrl)
      .then(() => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List',
          label: listUrl,
        })

        // console.log(listUrl)
        dispatch(enableList(listUrl))
        setView(CurrencyModalView.manage)
      })
      .catch((error) => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List Failed',
          label: listUrl,
        })
        setAddError(error.message)
        dispatch(removeList(listUrl))
      })
  }, [adding, dispatch, fetchList, listUrl, setView])

  return (
    <>
      <HeadlessUiModal.Header
        onClose={onDismiss}
        header={`Import List`}
        onBack={() => setView(CurrencyModalView.manage)}
      />
      <HeadlessUiModal.BorderedContent className="bg-[rgba(0,0,0,0.2)]">
        <div className="flex gap-3">
          {importList?.logoURI && (
            <ListLogo size="40px" logoURI={importList.logoURI} alt={`${importList.name} list logo`} />
          )}
          <div className="flex flex-col">
            <Typography weight={700} className={classNames('text-primary overflow-hidden overflow-ellipsis')}>
              {importList?.name}{' '}
              {importList && (
                <Typography variant="xs" weight={700} component="span">
                  {listVersionLabel(importList.version)}
                </Typography>
              )}
            </Typography>
            <div className="flex gap-1 items-center">
              <Typography variant="xs" className="text-white">
                {`${importList?.tokens.length} tokens`}
              </Typography>
            </div>
          </div>
        </div>
      </HeadlessUiModal.BorderedContent>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 !border-yellow/30">
        <Typography variant="xs" className="text-yellow" weight={700}>
          {`Import at your own risk`}
        </Typography>
        <Typography variant="sm" className="text-yellow" weight={700}>
          {`By adding this list you are implicitly trusting that the data is correct. Anyone can create a list,
              including creating fake versions of existing lists and lists that claim to represent projects that do not
              have one.`}
        </Typography>
        <Typography variant="sm" className="text-yellow" weight={700}>
          {`If you purchase a token from this list, you may not be able to sell it back.`}
        </Typography>
        <div className="flex flex-row items-center gap-3 cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            className="h-5 m-0"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Typography weight={700}>{`I understand`}</Typography>
        </div>
      </HeadlessUiModal.BorderedContent>
      <div className="flex flex-grow" />
      <Button color="blue" disabled={!confirmed} onClick={handleAddList}>
        {`Import`}
      </Button>
      {addError ? (
        <Typography variant="sm" weight={700} className="overflow-hidden text-ellipsis text-red text-center">
          {addError}
        </Typography>
      ) : null}
    </>
  )
}

export default ImportList
