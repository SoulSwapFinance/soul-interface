import { ArrowLeftIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Typography from 'components/Typography'
import React, { FC, ReactNode } from 'react'

export interface ModalHeaderProps {
  header: string | ReactNode
  subheader?: string
  onClose?(): void
  onBack?(): void
}

const ModalHeader: FC<ModalHeaderProps> = ({ header, subheader, onBack, onClose }) => {
  return (
    <div className={`flex items-start justify-${onBack ? 'between' : 'center'}`}>
      <div className={`flex flex-col gap-1 justify-center ${!onBack && 'border-1 p-4 w-full bg-dark-900 rounded-2xl'}`}>
        <Typography weight={700} className={`flex gap-3 text-high-emphesis ${!onBack && 'justify-center'} items-center ${!onBack && "text-xl"}`}>
          {onBack && (
            <ArrowLeftIcon onClick={onBack} width={24} height={24} className="cursor-pointer text-high-emphesis" />
          )}
          {header}
        </Typography>
        {subheader && <Typography variant="sm">{subheader}</Typography>}
      </div>
      {/* {onClose && (
        <div className="flex items-center justify-center w-6 h-6 cursor-pointer" onClick={onClose}>
          <XCircleIcon width={24} height={24} className="text-high-emphesis" />
        </div>
      )} */}
    </div>
  )
}

export default ModalHeader
