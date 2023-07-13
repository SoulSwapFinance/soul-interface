import { Button } from 'components/Button'
import { isAddress } from 'functions'
import React, { FC, useState } from 'react'

interface AddressInputBoxProps {
  onSubmit: (account: string) => void
}

export const AddressInputBox: FC<AddressInputBoxProps> = ({ onSubmit }) => {

  const [input, setInput] = useState('')
  return (
    <div className="flex gap-4">
      <div className={'border-2 h-[36px] flex items-center px-2 rounded bg-dark-1000/40 relative border-low-emphesis'}>
        <input
          className="bg-transparent placeholder-low-emphesis min-w-0 font-bold w-96"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <Button size="sm" disabled={!isAddress(input)} onClick={() => onSubmit(input)}>
        {`Submit`}
      </Button>
    </div>
  )
}
