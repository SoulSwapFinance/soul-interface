import { NextRouter } from 'next/router'

const ClearFilters = ({ router }: { router: NextRouter }) => {
  return (
    <div className="grid place-items-center gap-3">
      <p className="text-center">No Tokens Found.</p>
      <button
        className="btn-primary-outline"
        onClick={() => {
          if (router.query.pathname === '/nft/collections/[id]') {
            router.push(
              {
                pathname: '/nft/collections/[id]',
                query: { id: router.query.id },
              },
              undefined,
              {
                shallow: true,
              }
            )
            return
          }
          router.push(
            {
              query: {},
            },
            undefined,
            {
              shallow: true,
            }
          )
        }}
      >
        Clear filters
      </button>
    </div>
  )
}

export default ClearFilters
