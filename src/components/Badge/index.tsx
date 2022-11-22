import Typography from 'components/Typography'
import { classNames } from 'functions'
import React, { FC } from 'react'

export type BadgeColor = 'gray' | 'blue' | 'pink' | 'red' | 'purple' | 'green'

export interface BadgeProps {
  color: BadgeColor
  value: number | string
}

export const COLOR = {
  gray: 'bg-dark-700',
  blue: 'bg-blue',
  pink: 'bg-pink',
  green: 'bg-green',
  red: 'bg-red',
  purple: 'bg-purple',
}

const Badge: FC<BadgeProps & React.HTMLAttributes<HTMLDivElement>> = ({ children, color, value }) => {
  return (
    <div className="relative">
      <div
        className={classNames(
          COLOR[color],
          `flex items-center justify-center shadow-md absolute top-[-6px] right-[-6px] h-6 w-8 rounded-full p-1 pointer-events-none`
          // ring ring-black 
          // ring-dark-900/40 
        )}
      >
        <Typography variant="xxs" component="span" className="text-black font-bold">
          {value}
        </Typography>
      </div>
      {children}
    </div>
  )
}

export default Badge