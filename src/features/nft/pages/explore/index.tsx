// import Banner from 'features/nft/components/explore/Banner'
// import { WelcomeModal } from 'features/nft/components/explore/WelcomeModal'
// import { useHideNFTWelcomeModal } from 'state/user/hooks'
import TrendingCollections from 'features/nft/components/explore/TrendingCollections'
import { useBag } from 'features/nft/hooks'
import { useEffect } from 'react'
import styled from 'styled-components/macro'

const ExploreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    gap: 16px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    gap: 0px;
  }
`

const NftExplore = () => {
  const setBagExpanded = useBag((state) => state.setBagExpanded)
  // const [isModalHidden, hideModal] = useHideNFTWelcomeModal()

  useEffect(() => {
    setBagExpanded({ bagExpanded: false, manualClose: false })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
        <ExploreContainer>
          {/* <Banner /> */}
          <TrendingCollections />
        </ExploreContainer>
        {/* {!isModalHidden && <WelcomeModal onDismissed={hideModal} />} */}
    </>
  )
}

export default NftExplore
