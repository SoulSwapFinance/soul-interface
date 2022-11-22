export const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1)

export function chainIconUrl(chain) {
let logo = '/images/networks/ethereum.svg'
chain.toLowerCase() == 
    'arbitrum' ? logo = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/arbitrum/Arbitrum.png'
    : logo = `/images/networks/${chain.toLowerCase()}.svg`
return logo
}