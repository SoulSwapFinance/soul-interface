/*/ rules /*/
// `token0Symbol` && `token1Symbol`: always use "w" prefix
// `depositSymbol`: never use "w" prefix
// `depositSymbol`: always frontload native

export const InactiveAvalanchePools = [
  {
    pid: 0, // SURV
  }, 
  {
    pid: 1, // SURV
  }
]

export const InactiveFantomPools = [
  {
    pid: 0, // SURV
  },
   {
     pid: 1, // SURV
   },
]

export const AvalanchePools = [
  // {
  //   pid: 1,
  // },
]

export const FantomPools = [
  {
    pid: 2, // FANTIE
  },
]