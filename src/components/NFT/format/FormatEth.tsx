import FormatCurrency from 'components/NFT/format/FormatCurrency'
import { FC, ComponentProps } from 'react'
import Image from 'next/image'

const DARK_MODE = process.env.NEXT_PUBLIC_DARK_MODE

type FormatEthProps = {
  logoWidth?: number
}

type Props = ComponentProps<typeof FormatCurrency> & FormatEthProps

const FormatEth: FC<Props> = ({
  amount,
  maximumFractionDigits,
  logoWidth = 8,
}) => {
  const icon = DARK_MODE ? '/eth-dark.svg' : '/eth.svg'
  return (
    <FormatCurrency
      amount={amount}
      maximumFractionDigits={maximumFractionDigits}
    >
      <Image src={icon} alt="ETH logo" height={16} width={16} style={{ width: `${logoWidth}px` }} />
    </FormatCurrency>
  )
}

export default FormatEth
