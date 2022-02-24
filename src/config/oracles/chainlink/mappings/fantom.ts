const FANTON_CHAINLINK_MAPPING = {
  // FTM / USD
  '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc': {
    from: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    to: '0x0000000000000000000000000000000000000001', // USD
    decimals: 8, // USD
    fromDecimals: 18, // WFTM
    toDecimals: 8, // USD
  },
  // BTC / USD
 // '0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4': {
  // from: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
  // to: '0x0000000000000000000000000000000000000001', // USD
  // decimals: 8, // USD
  // fromDecimals: 8, // WBTC
  // toDecimals: 8, // USD
  // },
  // ETH / USD
  '0x11DdD3d147E5b83D01cee7070027092397d63658': {
    from: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
    to: '0x0000000000000000000000000000000000000001', // USD
    decimals: 8, // USD
    fromDecimals: 18, // ETH
    toDecimals: 8, // USD
  },
  // USDC / USD
  // '0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c': {
  //    from: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
  //    to: '0x0000000000000000000000000000000000000001', // USD
  //    decimals: 8, // USD
  //    fromDecimals: 6, // USDC
  //    toDecimals: 8, // USD
  // },
  // DAI / USD
  '0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52': {
    from: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
    to: '0x0000000000000000000000000000000000000001', // USD
    decimals: 8, // USD
    fromDecimals: 18, // DAI
    toDecimals: 8, // USD
  },
  // CRV / USD
// '0xa141D7E3B44594cc65142AE5F2C7844Abea66D2B': {
//     from: '0x1E4F97b9f9F913c46F1632781732927B9019C68b', // CRV
//     to: '0x0000000000000000000000000000000000000001', // USD
//     decimals: 8, // USD
//     fromDecimals: 18, // CRV
//     toDecimals: 8, // USD
//   },
}  

export default FANTON_CHAINLINK_MAPPING
