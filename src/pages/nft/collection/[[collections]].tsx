import { useLoadAssetsQuery } from 'services/graphql/data/nft/Asset'
import { useLoadCollectionQuery } from 'services/graphql/data/nft/Collection'
import { CollectionPageSkeleton } from 'features/nft/components/collection/CollectionPageSkeleton'
import { Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Collection from 'features/nft/pages/collection'


// The page is responsible for any queries that must be run on initial load.
// Triggering query load from the page prevents waterfalled requests, as lazy-loading them in components would prevent
// any children from rendering.
const CollectionPage = () => {
  const { contractAddress } = useParams()
  useLoadCollectionQuery(contractAddress)
  useLoadAssetsQuery(contractAddress)

  // The Collection must be wrapped in suspense so that it does not suspend the CollectionPage,
  // which is needed to trigger query loads.
  return (
    <Suspense fallback={<CollectionPageSkeleton />}>
      <Collection />
    </Suspense>
  )
}

export default CollectionPage