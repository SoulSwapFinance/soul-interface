import React, { FC } from 'react'
// import { XCircleIcon } from '@heroicons/react/24/outline'
// import { useActiveWeb3React } from 'services/web3'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import Link from 'next/link'
import { getChainColorCode, getChainInfo } from 'constants/chains'
import { ChainId } from 'sdk'
import { classNames } from 'functions/styling'
import ExternalLink from 'components/ExternalLink'
import { featureEnabled } from 'functions/feature'
import { Feature as Features } from 'enums'


export const Global: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <ExternalLink
            href="https://enchant.soulswap.finance" target="_blank" rel="noreferrer"
            className="font-bold text-white text-lg"
          >
            <Button variant="filled" color="purple" size="sm">
              <span className="justify-center">
                {' '}
                Click Here to Vote Now!
              </span>
            </Button>
          </ExternalLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

interface IFeature {
  chainId: number
  textColor?: string
  color?: string
}

export const Feature: FC<IFeature> = ({ chainId }) => (
  <div className={classNames(chainId == ChainId.FANTOM ? "relative items-center w-full" : 'hidden')}>
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium mb-2 mt-2 text-center text-white">
          {/* <span className="centered md:hidden"><b>Voting Ends Soon!</b> <b>&rarr;</b></span> */}
          {/* <span className="hidden md:inline"> Voting Has Begun <b> &rarr;</b></span> */}
          <NavLink href="/summoner">
            <Button variant="filled" color={getChainColorCode(chainId)} size="sm">
              <span className="justify-center font-bold">
                {[ChainId.AVALANCHE].includes(chainId)
                  ? `Click Here to Farm on ${getChainInfo(chainId, 'NETWORK')}`
                  : [ChainId.ETHEREUM, ChainId.FANTOM].includes(chainId) ? `Swap now on Avalanche & Ethereum`
                    : `Farm and Bond on Avalanche`
                }
              </span>
            </Button>
          </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const NewFeature: FC<IFeature> = ({ chainId }) => (
  <div className={classNames(featureEnabled(Features.AGGREGATE, chainId) ? "relative items-center w-full" : 'hidden')}>
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium mb-2 mt-2 text-center text-white">
          {/* <span className="centered md:hidden"><b>Voting Ends Soon!</b> <b>&rarr;</b></span> */}
          {/* <span className="hidden md:inline"> Voting Has Begun <b> &rarr;</b></span> */}
          <NavLink href="/aggregator">
            <Button variant="filled" color={getChainColorCode(chainId)} size="sm">
              <span className="justify-center font-bold">
                {'Click Here: Exchange More Tokens'}
              </span>
            </Button>
          </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const DonateBanner: FC<IFeature> = ({ chainId }) => (
  <div className={classNames(featureEnabled(Features.AMM, chainId) ? "relative items-center w-full" : 'hidden')}>
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium mb-2 mt-2 text-center text-white">
          <ExternalLink
            href="https://www.linkedin.com/posts/avalancheavax_the-avalanche-foundation-has-donated-1m-activity-7028745194174857216-bG3J?utm_source=share&utm_medium=member_desktop" target="_blank" rel="noreferrer"
            className="font-bold text-white text-lg"
          >
            <Button variant="filled" color={getChainColorCode(chainId)} size="sm">
              <span className="justify-center font-bold">
                {'Click Here: Donate to Turkey and Syria'}
              </span>
            </Button>
          </ExternalLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const TwitterBanner: FC<IFeature> = ({ chainId }) => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <ExternalLink
            href="https://twitter.com/soulswapfinance/status/1575216568933355520?s=46&t=HRYmpkdoWRL2R-Dlt5KhAA" target="_blank" rel="noreferrer"
            className="font-bold text-white text-lg"
          >
            <Button
              variant="filled"
              color={getChainColorCode(chainId)}
              size="md"
            >
              <span className="justify-center">
                {'Launch (and Giveaway) Today on Twitter!'}
              </span>
            </Button>
          </ExternalLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const BetaFeature: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium mb-2 mt-2 text-center text-white">
          <NavLink href="/summoner">
            <Button variant="filled" color="purple" size="sm">
              <span className="justify-center font-bold">
                {`Cross Chain Swaps are in beta, please use at your own risk. Report bugs 🐛 on ${<Link href="https://discord.com/invite/soulswap"> Discord </Link>}, thanks!`}
              </span>
            </Button>
          </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const LuxorBanner: FC<IFeature> = ({ chainId, textColor, color }) => (
  <div className={chainId == 250 ? `relative items-center w-full mt-2` : `hidden`}>
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
        <NavLink href="/luxor/stake">
            <Button variant="filled" color={color ? color : 'yellow'} size="sm">
              <span className={`justify-center font-bold text-${textColor ? textColor : 'black'}`}>
                {`Boosted Staking APY ↗`}
                {/* Please vote in our LIVE proposals regarding withdrawal fees and governance. <span aria-hidden="true">&rarr;</span> */}
              </span>
            </Button>
        </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const DeFarmBanner: FC<IFeature> = ({ chainId }) => (
  <div className={chainId == 250 ? `relative items-center w-full mt-2` : `hidden`}>
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
        <NavLink href="/defarms">
            <Button variant="filled" color="purple" size="sm">
              <span className="justify-center font-bold text-grey">
                {`New DeFarm Campaign ↗`}
                {/* Please vote in our LIVE proposals regarding withdrawal fees and governance. <span aria-hidden="true">&rarr;</span> */}
              </span>
            </Button>
        </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const UnderworldBanner: FC = () => (
  <div className="relative items-center w-full mb-4">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
        <NavLink href="/lend/swap">
            <Button variant="filled" color="ftmBlue" size="sm">
              <span className="justify-center font-bold text-white">
                {`Redeem Retired Assets ↗`}
                {/* Please vote in our LIVE proposals regarding withdrawal fees and governance. <span aria-hidden="true">&rarr;</span> */}
              </span>
            </Button>
        </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const BondsBanner: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <ExternalLink
            href="https://soulswapfinance.medium.com/owning-our-liquidity-via-our-innovative-soul-bonds-podl-592c2849ceed" target="_blank" rel="noreferrer"
            className="font-bold text-white text-lg"
          >
            <Button variant="filled" color="purple" size="sm">
              <span className="justify-center">
                {' '}
                Introducing: Soul Bonds ↗
              </span>
            </Button>
          </ExternalLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const VoteBanner: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <ExternalLink
            href="https://enchant.soulswap.finance/#/proposal/0xce59b7c7486a3f70709c254df6c53730a7ebc930c7b802757d9ca3e435dba396" target="_blank" rel="noreferrer"
            className="font-bold text-white text-lg"
          >
            <Button variant="filled" color="purple" size="sm">
              <span className="justify-center font-bold">
                {' '}
                Vote Today: Reduce Emissions ↗
              </span>
            </Button>
          </ExternalLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

interface IBanner {
  chainId: number
}

export const MainBanner: FC<IBanner> = ({ chainId }) => (
  <div className={classNames(chainId == ChainId.FANTOM ? "relative items-center w-full" : 'hidden')}>
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <NavLink
            href={`/summoner`}
            className="font-bold text-white text-lg"
          >
            <Button variant="filled" color="purple" size="sm">
              <span className="justify-center font-bold text-white">
                {' '}
                {/* Discounted Bonds (Luxor) ↗ */}
                {`Click Here: New Underworld Farms ↗`}
              </span>
            </Button>
          </NavLink>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)