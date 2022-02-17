import React from 'react'

interface InfoCardProps {
  text: string
  number: string
}

export default function InfoCard({ text, number }: InfoCardProps) {
  return (
    <div className="w-full py-3 border rounded px-9 bg-dark-1000 border-dark-700">
      <div className="text-center whitespace-nowrap">{text}</div>
      <div className="text-center text-2xl font-bold">{number}</div>
    </div>
  )
}