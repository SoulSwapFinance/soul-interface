import React, { FC } from 'react'
import { DIFFICULTY_ELEMENTS } from 'features/academy/helpers'
import { CircleIcon } from 'components/Icons/CircleIcon'
import { classNames } from 'functions/styling'
import { ArticleEntity } from './types'

// import { ArticleEntity } from '.mesh'

interface DifficultyLabel {
  article: ArticleEntity
  isCard?: boolean
}
export const DifficultyLabel: FC<DifficultyLabel> = ({ article, isCard }) => {
  const difficulty = article.attributes?.difficulty?.data?.attributes
  const difficultyColor = difficulty?.slug && DIFFICULTY_ELEMENTS[difficulty.slug].color

  return (
    <div className="flex items-center gap-1.5">
      <CircleIcon width={8} height={8} stroke={difficultyColor} fill={difficultyColor} />
      <span className={classNames(isCard ? 'text-xs font-medium' : 'text-xs font-medium sm:text-sm sm:font-normal')}>
        {difficulty?.label}
      </span>
    </div>
  )
}