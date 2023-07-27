import Tabs from './../Tabs'

const tabs = [
  {
    name: 'Top Pairs',
    type: 'pairs',
  },
  // {
  //   name: 'Top Tokens',
  //   type: 'tokens',
  // },
  // {
  //   name: 'Top Markets',
  //   type: 'coffin',
  // },
]

export default function DashboardTabs({ currentType, setType }): JSX.Element {
  return (
    <>
      <Tabs tabs={tabs} currentType={currentType} setType={setType} />
    </>
  )
}