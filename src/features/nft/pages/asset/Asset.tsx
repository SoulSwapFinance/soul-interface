import { useWeb3React } from '@web3-react/core'
import { useDetailsQuery, useLoadDetailsQuery } from 'services/graphql/data/nft/Details'
import { useLoadNftBalanceQuery } from 'services/graphql/data/nft/NftBalance'
import { AssetDetails } from 'features/nft/components/details/AssetDetails'
import { AssetDetailsLoading } from 'features/nft/components/details/AssetDetailsLoading'
import { AssetPriceDetails } from 'features/nft/components/details/AssetPriceDetails'
import { useBag } from 'features/nft/hooks'
import { Suspense, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

const AssetContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 60px;
  padding: 48px 48px 0 48px;

  @media (max-width: 960px) {
    padding: 40px 40px 0 40px;
  }
  @media (max-width: 540px) {
    padding: 20px 20px 0 20px;
  }
  @media (max-width: 420px) {
    padding: 16px 16px 0 16px;
  }
`

const AssetPriceDetailsContainer = styled.div`
  min-width: 360px;
  position: relative;

  @media (max-width: 960px) {
    display: none;
  }
`

const Asset = () => {
  const { tokenId = '', contractAddress = '' } = useParams()
  const data = useDetailsQuery(contractAddress, tokenId)

  const [asset, collection] = useMemo(() => data ?? [], [data])

  return (
    <>
        {asset && collection ? (
          <AssetContainer>
            <AssetDetails collection={collection} asset={asset} />
            <AssetPriceDetailsContainer>
              <AssetPriceDetails collection={collection} asset={asset} />
            </AssetPriceDetailsContainer>
          </AssetContainer>
        ) : null}
    </>
  )
}

const AssetPage = () => {
  const { tokenId, contractAddress } = useParams()
  const { account } = useWeb3React()
  const setBagExpanded = useBag((state) => state.setBagExpanded)
  useLoadDetailsQuery(contractAddress, tokenId)
  useLoadNftBalanceQuery(account, contractAddress, tokenId)

  useEffect(() => {
    setBagExpanded({ bagExpanded: false, manualClose: false })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<AssetDetailsLoading />}>
      <Asset />
    </Suspense>
  )
}

export default AssetPage
