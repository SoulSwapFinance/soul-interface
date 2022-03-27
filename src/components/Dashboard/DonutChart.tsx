import React from 'react'
import 'react-vis/dist/style.css'
import { RadialChart } from 'react-vis'

export default class DashboardDonutChart extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { width, data } = this.props

    return (
      <RadialChart
        data={data}
        width={width}
        height={width}
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        innerRadius={(width / 2) * 0.65}
        radius={width / 2}
        padAngle={(width / 2) * 0.0005}
        colorType="literal"
        className="m-auto sm:m-0"
      />
    )
  }
}
