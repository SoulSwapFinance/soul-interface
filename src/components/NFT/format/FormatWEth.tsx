import FormatCurrency from 'components/NFT/format/FormatCurrency'
import { FC, ComponentProps } from 'react'
import Image from 'next/image'

type FormatWEthProps = {
  logoWidth?: number
}

type Props = ComponentProps<typeof FormatCurrency> & FormatWEthProps

const FormatWEth: FC<Props> = ({
  amount,
  maximumFractionDigits,
  logoWidth = 8,
}) => {
  return (
    <FormatCurrency
      amount={amount}
      maximumFractionDigits={maximumFractionDigits}
    >
      <Image
       width={48}
       height={48}
        src="/weth.svg"
        alt="WETH logo"
        style={{ width: `${logoWidth}px` }}
      />
    </FormatCurrency>
  )
}

export default FormatWEth
