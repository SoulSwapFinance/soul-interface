import { withSentry } from '@sentry/nextjs'
import getAnalyticsDashboard from 'features/analytics/Dashboard/getAnalyticsDashboard'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const chainId = Number(req.query.chainId)
  const pairs = await getAnalyticsDashboard()
  res.status(200).json(pairs)
}

export default withSentry(handler)