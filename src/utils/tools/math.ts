import { BigNumber } from '@ethersproject/bignumber'

const ZERO = BigNumber.from(0).pow(18)
const ONE = BigNumber.from(1).pow(18)

// returns a deep copied + sorted list of values, as well as a sortmap
export function sortBigNumbers(values) {
  const valueMap = values.map((value, i) => ({ value, i }))
  
  valueMap.sort((a, b) => {
    if (a.value.isGreaterThan(b.value)) {
      return 1
    } else if (a.value.isLessThan(b.value)) {
      return -1
    } else {
      return 0
    }
  })
  
  return [
    valueMap.map((element) => values[element.i]),
    values.map((_, i) => valueMap.findIndex((element) => element.i === i)),
  ]
}

export function getMedian(values) {
  const [sortedValues, sortMap] = sortBigNumbers(values)
  if (values.length % 2 === 0) {
    const middle = values.length / 2
    const indices = [middle - 1, middle]
    return [
      sortedValues[middle - 1].plus(sortedValues[middle]).dividedBy(2),
      sortMap.map((element) => (indices.includes(element) ? BigNumber.from(0.5).pow(18) : ZERO)),
    ]
  } else {
    const middle = Math.floor(values.length / 2)
    return [sortedValues[middle], sortMap.map((element) => (element === middle ? ONE : ZERO))]
  }
}

export function getMean(values, _weights) {
  const weights = _weights ? _weights : values.map(() => ONE)

  const weightedValues = values.map((value, i) => value.multipliedBy(weights[i]))
  const numerator = weightedValues.reduce(
    (accumulator, currentValue) => accumulator.plus(currentValue),
    ZERO
  )
  const denominator = weights.reduce((accumulator, currentValue) => accumulator.plus(currentValue), ZERO)

  return [numerator.dividedBy(denominator), weights.map((weight) => weight.dividedBy(denominator))]
}
