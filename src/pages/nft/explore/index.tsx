// import Banner from 'features/nft/components/explore/Banner'
import TrendingCollections from 'features/nft/components/explore/TrendingCollections'
// import { WelcomeModal } from 'features/nft/components/explore/WelcomeModal'
import { useBag } from 'features/nft/hooks'
import { useEffect } from 'react'
// import { useHideNFTWelcomeModal } from 'state/user/hooks'
import styled from 'styled-components/macro'

// export const breakpoints = {
//   xs: '416px',
//   s: '600px',
//   md: '959px',
//   l: '1360px',
//   lg: '1360px',
//   xl: '1620px',
// }

const ExploreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media only screen and (max-width: ${({ theme }) => `${959}px`}) {
    gap: 16px;
  }

  @media only screen and (max-width: ${({ theme }) => `${600}px`}) {
    gap: 0px;
  }
`

const NftExplore = () => {
  const setBagExpanded = useBag((state) => state.setBagExpanded)

  useEffect(() => {
    setBagExpanded({ bagExpanded: false, manualClose: false })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
        <ExploreContainer>
          <TrendingCollections />
        </ExploreContainer>
    </>
  )
}

export default NftExplore
