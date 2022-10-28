import { classNames } from 'functions/styling'
import { useDisconnect } from 'wagmi'

export type Props = {
  className?: string
}

export function Disconnect({ className }: Props): JSX.Element {
  const { disconnect } = useDisconnect()
  return (
    <button className={classNames(className)} onClick={() => disconnect()}>
      Disconnect
    </button>
  )
}
