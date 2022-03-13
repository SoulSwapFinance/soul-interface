import Container from 'components/Container'
import Typography from 'components/Typography'
import usePriceApi from 'hooks/usePriceApi'
import React from 'react'

export default function Status({ fallbackData }) {
  const soulPrice = usePriceApi('0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07')

  return (
    <Container id="chains-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="6xl">
      <div className="w-full max-w-6xl mx-auto">
        <Typography component="h1" variant="h1" className="w-full mb-4">
          SoulSwap Playground
        </Typography>
        <div className="grid items-start justify-start grid-cols-2 gap-3 mx-auto ">
          the price of soul is: ${soulPrice}
        </div>
      </div>
    </Container>
  )
}
