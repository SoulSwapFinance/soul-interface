import { BigNumber, ethers } from "ethers"
import { CHAINLINKS } from "config/chainlinks/chainlinks"
import ProviderService from "./ProviderService"

class ChainLinkService {
  protected static instance: ChainLinkService
  protected providerService: ProviderService
  protected priceFeeds: { [key: string]: ethers.Contract }

  constructor() {
    this.priceFeeds = {}
    this.providerService = ProviderService.getInstance()
  }

  getPriceFeedContract(symbol: string): ethers.Contract | undefined {
    const token = CHAINLINKS.tokens[symbol]
    if (token) {
      if (this.priceFeeds[symbol]) {
        return this.priceFeeds[symbol]
      }
      this.priceFeeds[symbol] = new ethers.Contract(
        token.address,
        CHAINLINKS.abi,
        this.providerService.getProvider(token.chainId)
      )
      return this.priceFeeds[symbol]
    }
  }

  async getPrices(symbols: string[]): Promise<{ [key: string]: BigInt }> {
    const pricesMap = {} as { [key: string]: BigInt }
    const prices: BigNumber[] = await Promise.all(
      symbols.map((symbol: string): Promise<BigNumber> => {
        const priceFeedContract = this.getPriceFeedContract(symbol)
        if (!priceFeedContract) {
          return Promise.resolve(BigNumber.from("0"))
        }
        return priceFeedContract
          .latestRoundData()
          .then(([roundId, price]: [BigNumber, BigNumber]) =>
            Promise.resolve(price)
          )
          .catch(() => Promise.resolve(BigNumber.from("0")))
      })
    )
    symbols.forEach((symbol: string, index: number) => {
      pricesMap[symbol] = prices[index].toBigInt()
    })
    return pricesMap
  }

  static getInstance() {
    if (ChainLinkService.instance) {
      return ChainLinkService.instance
    }
    ChainLinkService.instance = new ChainLinkService()
    return ChainLinkService.instance
  }
}

export default ChainLinkService