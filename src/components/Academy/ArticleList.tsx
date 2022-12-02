import React, { FC, ReactNode } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Typography from 'components/Typography'

import { CardSkeleton } from './Card/CardSkeleton'
import { ArticleEntity } from './types'

interface ArticleList {
  loading: boolean
  articles: ArticleEntity[]
  render(article: ArticleEntity, index: number): ReactNode
  skeletonAmount?: number
}

export const ArticleList: FC<ArticleList> = ({ articles, loading, render, skeletonAmount }) => {
  if (loading)
    return (
      <>
        {Array.from({ length: skeletonAmount ?? 6 }, (_, i) => i + 1).map((n) => (
          <CardSkeleton key={n} />
        ))}
      </>
    )
  if (!articles.length)
    return (
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon width={20} height={20} />
        <Typography 
            // variant="xl" 
            weight={700}
        >
          No Results
        </Typography>
      </div>
    )
  return <>{articles.map((article, i) => render(article, i))}</>
}