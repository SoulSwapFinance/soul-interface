export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const AnyswapEthOperaBridgeAddress = '0x5cbe98480a790554403694b98bff71a525907f5d'

export const Ethereum$FTM = '0x4E15361FD6b4BB609Fa63C81A2be19d873717870'

export const ContractScan = {
    1: 'https://etherscan.io/address/',
    250: 'https://ftmscan.com/address/',
    4002: 'https://testnet.ftmscan.com/address/',
}

// old: 0x27FCdd0DA2F9328Bd8Eede0e7F74e2E5a50a2e7D
// new: 0x0d36535b2666959a52c0c73CB940A59b1EbE9FD6
export const SoulCircleAddress = "0x5063Fc9D759B5b03DD5fBC0B882b5F68CF881C32"

// connected chain -> targeted chain -> address
export const AnyswapBridge = {
    1: {
        250: '0x5cbe98480a790554403694b98bff71a525907f5d',
    },
    250: {
        1: '',
    }
}

// connected chain -> address
export const TokenFantom = {
    1: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
}