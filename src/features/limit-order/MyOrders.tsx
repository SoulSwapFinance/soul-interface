import { BookOpenIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Badge from 'components/Badge'
import QuestionHelper from 'components/QuestionHelper'
import useLimitOrders from 'features/limit-order/hooks/useLimitOrders'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

const MyOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()
  const router = useRouter()

  const content = (
    <QuestionHelper
      text={i18n._(t`Open orders`)}
      icon={<BookOpenIcon width={24} height={24} className="cursor-pointer hover:text-white" />}
    />
  )

  return (
    <div onClick={() => router.push('/limit-order/open')}>
      {pending.totalOrders > 0 ? (
        <Badge color="purple" value={pending.totalOrders}>
          {content}
        </Badge>
      ) : (
        content
      )}
    </div>
  )
}

export default MyOrders