import React, { FC, useCallback, useState } from 'react'
import Tooltip from '../Tooltip/JustTheTip'

const QuestionHelper: FC<{
  children?: React.ReactChild
  text?: any
  title?: any
  width?: 'small' | 'large'
  hideDefault?: boolean
  color?: any
}> = ({ children, text, title, width, hideDefault = false, color = '#6D6A91' }) => {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  if (children) {
    return (
      <Tooltip text={text} show={show} width={width}>
        <div
          className="flex items-center justify-center outline-none"
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {children}
        </div>
      </Tooltip>
    )
  }

  return (
    <Tooltip text={text} show={show} hideDefault={hideDefault}>
      <div
        className="flex items-center justify-center outline-none cursor-help hover:text-primary"
        onClick={open}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        <span className="mr-1" style={{ color: color }}>
          {title}
        </span>
        <svg className="w-4 w-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8Z"
            fill={color}
          />
          <path
            d="M11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V12Z"
            fill={color}
          />
        </svg>
      </div>
    </Tooltip>
  )
}

export default QuestionHelper
