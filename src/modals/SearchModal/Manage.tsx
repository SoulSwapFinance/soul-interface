import { HeadlessUiModal } from 'components/Modal'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import { useCurrencyModalContext } from 'modals/SearchModal/CurrencySearchModal'
import React, { FC, useState } from 'react'

import CurrencyModalView from './CurrencyModalView'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'

const Manage: FC = () => {
  const { setView, onDismiss } = useCurrencyModalContext()
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <>
      <HeadlessUiModal.Header
        header={`Manage`}
        onClose={onDismiss}
        onBack={() => setView(CurrencyModalView.search)}
      />
      <div className="flex rounded border border-dark-800 hover:border-dark-700">
        {[`Lists`, `Tokens`].map((title, i) => (
          <div
            key={i}
            className={classNames(
              tabIndex === i ? 'text-high-emphesis border-blue' : 'border-transparent',
              'flex items-center justify-center flex-1 px-1 py-3 rounded cursor-pointer select-none border bg-[rgba(0,0,0,0.2)]'
            )}
            onClick={() => setTabIndex(i)}
          >
            <Typography
              weight={700}
              className={classNames(
                tabIndex === i ? 'text-primary' : 'text-secondary',
                'hover:text-high-emphesis focus:outline-none'
              )}
            >
              {title}
            </Typography>
          </div>
        ))}
      </div>
      {tabIndex === 0 && <ManageLists />}
      {tabIndex === 1 && <ManageTokens />}
    </>
  )
}

export default Manage
