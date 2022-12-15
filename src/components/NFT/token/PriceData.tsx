import AcceptOffer from 'components/NFT/action/AcceptOffer'
import BuyNow from 'components/NFT/action/BuyNow'
import CancelListing from 'components/NFT/action/CancelListing'
import CancelOffer from 'components/NFT/action/CancelOffer'
import FormatEth from 'components/NFT/format/FormatEth'
import FormatWEth from 'components/NFT/format/FormatWEth'
import ListModal from 'components/NFT/modal/ListModal'
import TokenOfferModal from 'components/NFT/modal/TokenOfferModal'
import useCollection from 'features/nft/hooks/useCollection'
import useDetails from 'features/nft/hooks/useDetails'
import React, { FC, ReactNode } from 'react'
import { setToast } from './setToast'
import { useActiveWeb3React } from 'services/web3'
import Image from 'next/image'

const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const SOURCE_ICON = process.env.NEXT_PUBLIC_SOURCE_ICON

type Props = {
  details: ReturnType<typeof useDetails>
  collection: ReturnType<typeof useCollection>
}

const PriceData: FC<Props> = ({ details, collection }) => {
  const { account, chainId, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const CHAIN_ID = chainId

  const token = details.data?.tokens?.[0]

  const sourceName = token?.market?.floorAsk?.source?.name as string | undefined

  const isLocalListed =
    typeof SOURCE_ID === 'string' &&
    typeof sourceName === 'string' &&
    SOURCE_ID === sourceName

  const sourceLogo = isLocalListed
    ? SOURCE_ICON || NAVBAR_LOGO
    : `https://api.reservoir.tools/redirect/logo/v1?source=${sourceName}`

  const sourceRedirect = `https://api.reservoir.tools/redirect/token/v1?source=${sourceName}&token=${token?.token?.contract}:${token?.token?.tokenId}`

  if (!CHAIN_ID) return null

  const isOwner =
    token?.token?.owner?.toLowerCase() === account?.toLowerCase()
  const isTopBidder =
    !!account &&
    token?.market?.topBid?.maker?.toLowerCase() ===
      account?.toLowerCase()
  const isListed = token?.market?.floorAsk?.price !== null
  const isInTheWrongNetwork = Boolean(signer && chainId !== +CHAIN_ID)

  return (
    <div className="col-span-full md:col-span-4 lg:col-span-5 lg:col-start-2">
      <article className="col-span-full rounded-2xl border border-gray-300 bg-white p-6 dark:border-neutral-600 dark:bg-black">
        <div className="grid grid-cols-2 gap-6">
          <Price
            title="List Price"
            source={
              sourceName && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={sourceRedirect}
                  className="reservoir-body flex items-center gap-2 dark:text-white"
                >
                  on {sourceName}
                  <Image height={24} width={24} className="h-6 w-6" src={sourceLogo} alt="Source Logo" />
                </a>
              )
            }
            price={
              <FormatEth
                amount={token?.market?.floorAsk?.price}
                logoWidth={16}
              />
            }
          />
          <Price
            title="Top Offer"
            price={
              <FormatWEth
                amount={token?.market?.topBid?.value}
                logoWidth={16}
              />
            }
          />
          <div className="col-span-2 grid gap-4 md:grid-cols-2 md:gap-6">
            {isOwner && (
              <ListModal
                data={{
                  collection: collection.data,
                  details,
                }}
                isInTheWrongNetwork={isInTheWrongNetwork}
                maker={account}
                setToast={setToast}
                signer={signer}
              />
            )}
            <BuyNow
              data={{
                collection: collection.data,
                details,
              }}
              signer={signer}
              isInTheWrongNetwork={isInTheWrongNetwork}
              setToast={setToast}
              show={!isOwner}
            />
            <AcceptOffer
              data={{
                collection: collection.data,
                details,
              }}
              isInTheWrongNetwork={isInTheWrongNetwork}
              setToast={setToast}
              show={isOwner}
              signer={signer}
            />
            {!isOwner && (
              <TokenOfferModal
                signer={signer}
                data={{
                  collection: collection.data,
                  details,
                }}
                royalties={{
                  bps: collection.data?.collection?.royalties?.bps,
                  recipient: collection.data?.collection?.royalties?.recipient,
                }}
                env={{
                  chainId: +CHAIN_ID as ChainId,
                }}
                setToast={setToast}
              />
            )}
          </div>
        </div>
        <div
          className={`${
            (isOwner && isListed) || isTopBidder ? 'mt-6' : ''
          } flex justify-center`}
        >
          <CancelOffer
            data={{
              collection: collection.data,
              details,
            }}
            signer={signer}
            show={isTopBidder}
            isInTheWrongNetwork={isInTheWrongNetwork}
            setToast={setToast}
          />
          <CancelListing
            data={{
              collection: collection.data,
              details,
            }}
            signer={signer}
            show={isOwner && isListed}
            isInTheWrongNetwork={isInTheWrongNetwork}
            setToast={setToast}
          />
        </div>
      </article>
    </div>
  )
}

export default PriceData

const Price: FC<{ title: string; price: ReactNode; source?: ReactNode }> = ({
  title,
  price,
  source,
}) => (
  <div className="flex flex-col space-y-5">
    <div className="flex-grow">
      <div className="soulswap-h5 font-headings dark:text-white">{title}</div>
      {source}
    </div>
    <div className="soulswap-h3 font-headings dark:text-white">{price}</div>
  </div>
)
