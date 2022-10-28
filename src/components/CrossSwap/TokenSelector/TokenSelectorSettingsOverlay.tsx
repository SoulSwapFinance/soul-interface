import React, { FC, useState } from 'react'
import { CogIcon } from '@heroicons/react/outline'

import { TokenSelectorProps } from './TokenSelector'
import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'
import { IconButton } from 'components/Icons/IconButton'
import { SlideIn } from 'components/Animated/SlideIn'
import { Overlay } from 'components/Overlay'

type TokenSelectorSettingsOverlayProps = Pick<TokenSelectorProps, 'customTokenMap' | 'onRemoveToken'>

export const TokenSelectorSettingsOverlay: FC<TokenSelectorSettingsOverlayProps> = ({
  customTokenMap,
  onRemoveToken,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        className="hover:animate-spin-slow w-[24px] h-[24px] flex items-center justify-center"
        onClick={() => {
          setOpen(true)
        }}
      >
        <CogIcon width={20} height={20} className="hover:text-slate-50 text-slate-100" />
      </IconButton>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
          <div className="py-1 px-1">
            <TokenSelectorCustomTokensOverlay customTokenMap={customTokenMap} onRemoveToken={onRemoveToken} />
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
