import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { CoffinboxIcon, WalletIcon } from 'components/Icon'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Switch from 'components/Switch'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import React, { FC, useState } from 'react'

const CoffinBoxFundingSourceModal: FC = () => {
  const [walletSelected, setWalletSelected] = useState(false)

  return (
    <HeadlessUiModal
      trigger={
        <div className="flex items-center justify-center rounded cursor-pointer lg:w-4 lg:h-4">
          <QuestionMarkCircleIcon className="w-4 h-4 text-high-emphesis" />
        </div>
      }
    >

      {({ setOpen }) => (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={`About CoffinBox Funding`} onClose={() => setOpen(false)} />
          <div className="flex justify-center gap-4">
            <div className="relative shadow-purple-glow">
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="lg" weight={700} className="text-center text-high-emphesis">
                {`SoulSwap utilizes a token vault called CoffinBox that has balances separate from your wallet.`}
              </Typography>
              <Typography variant="sm" className="text-center text-secondary">
                {`You can think of this as having "account balances" for asset within SoulSwap.`}
              </Typography>
            </div>
          </div>
          <HeadlessUiModal.BorderedContent className="flex flex-col">
            <div className="grid grid-cols-2 gap-10 flex-grow min-h-[160px]">
              <div className="flex flex-col justify-center gap-3">
                <div className="flex justify-center gap-4">
                  <div
                    className={classNames(
                      'flex flex-col gap-1',
                      walletSelected ? 'text-low-emphesis' : 'text-high-emphesis'
                    )}
                  >
                    <CoffinboxIcon width={48} />
                    <Typography variant="xs" className="text-secondary">
                      {`CoffinBox`}
                    </Typography>
                  </div>
                  <div
                    className={classNames(
                      'flex flex-col gap-1',
                      walletSelected ? 'text-high-emphesis' : 'text-low-emphesis'
                    )}
                  >
                    <WalletIcon width={48} />
                    <Typography variant="xs" className="text-secondary">
                      {`Wallet`}
                    </Typography>
                  </div>
                </div>
                <Typography weight={700} variant="sm" className="text-center text-high-emphesis">
                  {`You’ll see these icons next to your balance in various input fields.`}
                </Typography>
              </div>
              <div
                className="h-full bg-right bg-no-repeat bg-contain"
                style={{ backgroundImage: `url('/images/trident/AssetInputScreenshot.png')` }}
              />
            </div>
            <div className="flex flex-col flex-grow min-h-[160px]">
              <div className="grid flex-grow grid-cols-2">
                <div
                  className="h-full bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url('/images/trident/AssetInputScreenshot2.png')` }}
                />
                <div className="flex flex-col items-center justify-center gap-2 p-3 px-8">
                  <Switch checked={walletSelected} onChange={setWalletSelected} />
                  <Typography weight={700} variant="sm" className="text-center text-high-emphesis">
                    {`Use the toggle to switch between balances when interacting with our platform.`}
                  </Typography>
                </div>
              </div>
            </div>
          </HeadlessUiModal.BorderedContent>
        </div>
      )}
    </HeadlessUiModal>
  )
}

export default CoffinBoxFundingSourceModal