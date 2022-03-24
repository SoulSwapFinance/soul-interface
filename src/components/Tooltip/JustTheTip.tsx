import Popover, { PopoverProps } from '../Popover'
import React, { ReactNode, useCallback, useState } from 'react'
import { classNames } from '../../functions'

interface TipProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
  width?: 'small' | 'large'
  hideDefault?: boolean
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
}

export default function Tooltip({ text, width, hideDefault = false, ...rest }: TipProps) {
  return (
    <Popover
      content={
        <div
          className={classNames(
            'w-full px-4 py-3 font-medium rounded-8 bg-black dark:bg-black text-white dark:text-white-40 text-left text-sm leading-5 whitespace-pre-wrap',
            width == 'large' ? 'max-w-350' : 'max-w-244',
            hideDefault ? '!bg-transparent' : ''
          )}
        >
          {text}
        </div>
      }
      {...rest}
    />
  )
}

export function TooltipContent({ content, ...rest }: TooltipContentProps) {
  return <Popover content={<div className="w-64 py-[0.6rem] px-4 break-words">{content}</div>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

export function MouseoverTooltipContent({ content, children, ...rest }: Omit<TooltipContentProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent {...rest} show={show} content={content}>
      <div
        style={{ display: 'inline-block', lineHeight: 0, padding: '0.25rem' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  )
}
