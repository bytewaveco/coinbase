import { CoinbaseAPI } from '../base'

/**
 * Information describing a Coinbase exchange rate.
 */
export interface CoinbaseExchangeRate {
  currency: string
  rates: Record<string, string>
}

/**
 * The Coinbase exchange rates API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates
 */
export class CoinbaseExchangeRatesAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase exchange rates endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey?: string, private apiSecret?: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get the Coinbase exchange rates for a currency.
   *
   * @returns A record of current exchange rates.
   */
  async listExchangeRates(currency = 'USD') {
    return this.#api.get<CoinbaseExchangeRate>('/v2/exchange-rates', { currency })
  }
}
