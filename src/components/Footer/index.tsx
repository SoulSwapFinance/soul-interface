import { ANALYTICS_URL } from '../../constants'
import ExternalLink from '../ExternalLink'
import { useActiveWeb3React } from 'services/web3'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  return (
    // <footer className="absolute bottom-0 flex items-center justify-between w-screen h-20 p-4 mx-auto text-center text-low-emphesis">
    <footer className="flex-shrink-0 relative bottom-[50%] w-full">
      <div className="flex bottom-0 items-center justify-between h-20 px-4 bg-dark-1200">
        {chainId && chainId in ANALYTICS_URL && (
          <ExternalLink
            id={`analytics-nav-link`}
            href={ANALYTICS_URL[250] || 'https://analytics.soulswap.finance'}
            className="text-low-emphesis"
          >
          </ExternalLink>
        )}
        {/* <Polling /> */}
      </div>
  </footer>
  )
}

export default Footer
