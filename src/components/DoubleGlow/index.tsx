import { getChainColorCode } from "constants/chains"
import { useActiveWeb3React } from "services/web3"

export const DoubleGlowShadowV2 = ({ maxWidth = true, opacity = '0.6', children }) => {
  return (
    <div className={`force-gpu relative w-full ${maxWidth ? 'max-w-2xl' : ''}`}>
      <div
        style={{ filter: `blur(150px) opacity(${opacity})` }}
        className="absolute top-1/4 -left-1 bg-purple bottom-4 w-3/5 rounded-full z-0 hidden sm:block"
      />
      <div
        style={{ filter: `blur(150px) opacity(${opacity})` }}
        className="absolute bottom-1/4 -right-1 bg-purple top-4 w-3/5 rounded-full z-0 hidden sm:block"
      />
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}

export const DoubleGlowShadowBlue = ({ maxWidth = true, opacity = '0.6', children }) => {
  return (
    <div className={`force-gpu relative w-full ${maxWidth ? 'max-w-2xl' : ''}`}>
      <div
        style={{ filter: `blur(150px) opacity(${opacity})` }}
        className="absolute top-1/4 -left-1 bg-blue bottom-4 w-3/5 rounded-full z-0 hidden sm:block"
      />
      <div
        style={{ filter: `blur(150px) opacity(${opacity})` }}
        className="absolute bottom-1/4 -right-1 bg-blue top-4 w-3/5 rounded-full z-0 hidden sm:block"
      />
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}

export const DoubleGlowShadowChain = ({ maxWidth = true, opacity = '0.6', children }) => {
  const { chainId } = useActiveWeb3React()

  return (
    <div className={`force-gpu relative w-full ${maxWidth ? 'max-w-2xl' : ''}`}>
      <div
        style={{ filter: `blur(150px) opacity(${opacity})` }}
        className={`absolute top-1/4 -left-1 bg-${getChainColorCode(chainId)} bottom-4 w-3/5 rounded-full z-0 hidden sm:block`}
      />
      <div
        style={{ filter: `blur(150px) opacity(${opacity})` }}
        className={`absolute bottom-1/4 -right-1 bg-${getChainColorCode(chainId)} top-4 w-3/5 rounded-full z-0 hidden sm:block`}
      />
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}