import React, { Fragment } from 'react'
import 'react-vis/dist/style.css'
import Typography from '../../components/Typography'
import { formatNumber } from '../../functions'
import QuestionHelper from '../QuestionHelper'

export default class DashboardChartLegend extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, hasInfo, currency, leadingCurrency, theme } = this.props

    return (
      <div className="m-auto mt-7 sm:m-0 sm:ml-12">
        {data.map((el, i) => (
          <div key={i} style={{ paddingTop: i > 0 ? '24px' : 0 }}>
            <Typography
              className="flex gap-1 items-center"
              style={{ fontSize: '12px', lineHeight: '15px', color: theme === 'dark' ? '#CCCCCC' : '#808080' }}
            >
              <svg className="inline-block" style={{ width: '16px', height: '16px', borderRadius: '4px' }}>
                <rect fill={el.color} x="0" y="0" width="16" height="16"></rect>
              </svg>
              {el.label}
              {el.text ? (
                <QuestionHelper 
                // width={'small'} 
                text={<div className="flex flex-col space-y-2">
                    {el.text}</div>
                    } 
                />
              ) : (
                ''
              )}
            </Typography>
            <span
              className="font-semibold black align-middle"
              style={{ marginTop: '4px', fontSize: '14px', lineHeight: '20px' }}
            >
              {leadingCurrency
                ? `${currency}${formatNumber(el.angle).toLowerCase()}`
                : `${formatNumber(el.angle).toLowerCase()} ${currency}`}
              <span className="text-accent">{el.percent ? ' (' + el.percent + '%)' : ''}</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
}
