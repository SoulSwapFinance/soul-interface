export const getEarningsText = (numFarmsToCollect, hasEarningsPoolToCollect, earningsUsd, isPool) => {
    const count = numFarmsToCollect
    const earningsUsdToString = earningsUsd.toString()
  
    const textEnds = isPool ? 'pool' : 'farm'
  
    let earningsText = '0 to collect'
  
    if (numFarmsToCollect > 0 && hasEarningsPoolToCollect) {
      if (numFarmsToCollect > 1) {
        earningsText = `${earningsUsdToString} to collect from ${count} ${textEnds}s`
      } else {
        earningsText = `${earningsUsdToString} to collect from ${count} ${textEnds}`
      }
    } else if (numFarmsToCollect > 0) {
      if (numFarmsToCollect > 1) {
        earningsText = `${earningsUsdToString} to collect from ${count} ${textEnds}s`
      } else {
        earningsText = `${earningsUsdToString} to collect from ${count} ${textEnds}`
      }
    } else if (hasEarningsPoolToCollect) {
      earningsText = `${earningsUsdToString} to collect from ${textEnds}`
    }
  
    return earningsText
  }