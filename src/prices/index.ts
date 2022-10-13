import { CoinbaseAPI } from '../base'

/**
 * Information describing a Coinbase currency pair buy price.
 */
export interface CoinbasePrice {
  amount: string
  currency: string
}

/**
 * Information describing spot price request options.
 *
 * date - The date for the spot price. Defaults to the current date. Must be in
 * YYYY-MM-DD (UTC) format.
 */
export interface CoinbaseSpotPriceOptions {
  date: string
}

/**
 * The Coinbase prices API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-prices
 */
export class CoinbasePricesAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase prices endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey?: string, private apiSecret?: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get a Coinbase currency pair buy price.
   *
   * @param currencyPair - The currency pair.
   * @returns A buy price for a currency pair.
   */
  async getBuyPrice(currencyPair: string) {
    return this.#api.get<CoinbasePrice>(`/v2/prices/${currencyPair}/buy`)
  }

  /**
   * Get a Coinbase currency pair sell price.
   *
   * @param currencyPair - The currency pair.
   * @returns A sell price for a currency pair.
   */
  async getSellPrice(currencyPair: string) {
    return this.#api.get<CoinbasePrice>(`/v2/prices/${currencyPair}/sell`)
  }

  /**
   * Get a Coinbase currency pair spot price.
   *
   * @param currencyPair - The currency pair.
   * @param options - Request options.
   * @returns A spot price for a currency pair.
   */
  async getSpotPrice(currencyPair: string, options?: Partial<CoinbaseSpotPriceOptions>) {
    return this.#api.get<CoinbasePrice>(`/v2/prices/${currencyPair}/spot`, options)
  }
}
