import Container from '../../components/Container'
import Head from 'next/head'
import Menu from '../../features/analytics/AnalyticsMenu'
import Dashboard from '..'

export default function Analytics() {
  return (
    <Container maxWidth="full" className="grid h-full grid-cols-4 mx-auto gap-9">
      <Head>
        <title>Analytics Dashboard | Soul</title>
        <meta name="description" content="SoulSwap Analytics Dashboard by Soul..." />
      </Head>

      <div className="sticky top-0 hidden lg:block md:col-span-1" style={{ maxHeight: '40rem' }}>
        <Menu />
      </div>
      <Dashboard/>
    </Container>
  )
}
