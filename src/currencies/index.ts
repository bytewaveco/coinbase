import { CoinbaseAPI } from '../base'

/**
 * Information describing a Coinbase currency.
 */
export interface CoinbaseCurrency {
  id: string
  name: string
  min_size: string
}

/**
 * The Coinbase currencies API.
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-currencies
 */
export class CoinbaseCurrenciesAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase currencies endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey?: string, private apiSecret?: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get the Coinbase currencies.
   *
   * @returns A list of currencies.
   */
  async listCurrencies() {
    return this.#api.get<CoinbaseCurrency[]>('/v2/currencies')
  }
}
