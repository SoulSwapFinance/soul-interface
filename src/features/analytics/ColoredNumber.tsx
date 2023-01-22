import { classNames, formatNumber, formatNumberScale, formatPercent } from 'functions'

interface ColoredNumberProps {
  number: number
  scaleNumber?: boolean
  percent?: boolean
  className?: string
  usd?: boolean
}

export default function ColoredNumber({
  number,
  scaleNumber = true,
  percent = false,
  className = '',
  usd = false,
}: ColoredNumberProps): JSX.Element {
  if (isNaN(number) || number === Infinity) number = 0

  return (
    <>
      <div className={classNames(number > 0 ? 'text-green' : number < 0 && 'text-red', 'font-normal', className)}>
        { percent ? `${formatNumber(number, false, true)}%` 
          : scaleNumber ? formatNumber(number, false, true) 
            : usd ? formatNumber(number, true, true) 
              : formatNumber(number, false, true)
        }
        {/* {(number > 0 ? '+' : number < 0 ? '-' : '') +
          (percent
            ? formatPercent(number).replace('-', '')
            : scaleNumber
            ? formatNumberScale(number, true).replace('-', '')
            : formatNumber(number, true, false).replace('-', ''))} */}
      </div>
    </>
  )
}