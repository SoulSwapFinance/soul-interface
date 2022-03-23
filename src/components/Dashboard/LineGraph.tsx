import React from 'react'
import 'react-vis/dist/style.css'
import { XYPlot, LineSeries, GradientDefs, AreaSeries, MarkSeries, Hint } from 'react-vis'
import { formatNumberScale, formatUnixTimestampToDay } from 'functions'

export default class DashboardLineGraph extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      crosshairValues: {},
      index: null,
    }
  }

  render() {
    const { width, height, data, theme } = this.props
    const yDomain =
      data
        .map(function (obj) {
          return obj.y
        })
        .reduce(function (a, b) {
          return Math.max(a, b)
        }) * 1.5
    const crosshairData = this.state.index === null ? [] : [this.state.crosshairValues]

    return (
      <XYPlot
        yDomain={[0, yDomain]}
        width={width}
        height={height}
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onMouseLeave={() => this.setState({ crosshairValues: {}, index: null })}
      >
        <GradientDefs>
          <linearGradient id="LineGraphGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1143FF" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#1143FF" stopOpacity={0} />
          </linearGradient>
        </GradientDefs>
        <AreaSeries stroke="rgba(17, 67, 255, 0)" curve={'curveNatural'} fill={'url(#LineGraphGradient)'} data={data} />
        <LineSeries
          stroke={theme === 'dark' ? '#88a0f8' : 'rgba(17, 67, 255, 0.5)'}
          curve={'curveNatural'}
          data={data}
          strokeWidth="1"
          onNearestX={(datapoint, { index }) => {
            this.setState({ crosshairValues: datapoint, index: index })
          }}
        />
        <MarkSeries
          fill={theme === 'dark' ? '#252525' : 'white'}
          stroke={theme === 'dark' ? '#88a0f8' : 'rgba(17, 67, 255, 0.5)'}
          strokeWidth="1"
          curve={'curveNatural'}
          data={crosshairData}
        />
        <Hint value={this.state.crosshairValues}>
          <div
            className="rounded-8 text-center"
            style={{
              background: theme === 'dark' ? '#4d4b6b' : '#1A1A1A',
              padding: '8px 12px',
              color: '#F2F2F2',
              display: this.state.index !== null ? 'block' : 'none',
            }}
          >
            <p style={{ fontSize: '12px', lineHeight: '15px' }}>
              {formatUnixTimestampToDay(this.state.crosshairValues.x).toUpperCase()}
            </p>
            <p style={{ fontSize: '14px', lineHeight: '20px' }} className="font-semibold">
              ${formatNumberScale(this.state.crosshairValues.y).toLowerCase()}
            </p>
          </div>
        </Hint>
      </XYPlot>
    )
  }
}
