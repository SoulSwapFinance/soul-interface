import React from 'react'
import { classNames } from '../functions/styling'

export default function CardHeader({ className, children }: any) {
  return (
    <div className={classNames('flex items-center rounded-t px-4 sm:px-8 py-4 sm:py-6', className)}>{children}</div>
  )
}

export function BorrowCardHeader({ children }: any) {
  return <CardHeader className="border-b-8 bg-dark-purple border-purple">{children}</CardHeader>
}

export function LendCardHeader({ children }: any) {
  return <CardHeader className="border-b-8 bg-dark-blue border-blue">{children}</CardHeader>
}
