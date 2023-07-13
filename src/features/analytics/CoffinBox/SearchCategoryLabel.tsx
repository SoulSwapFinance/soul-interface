import Typography from 'components/Typography'
import { useAppSelector } from 'state/hooks'
import { selectTokens } from 'state/tokens'
import React, { FC } from 'react'

export const SearchCategoryLabel: FC = () => {
  const { searchQuery } = useAppSelector(selectTokens)
  return (
    <div className="flex flex-row items-center justify-between px-2 py-2">
      <Typography variant="base" className="text-high-emphesis" weight={700}>
        {searchQuery ? `${`Search results for`} '${searchQuery}'` : `Top Tokens`}
      </Typography>
    </div>
  )
}