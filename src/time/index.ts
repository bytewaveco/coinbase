import { CoinbaseAPI } from '../base'

/**
 * Information describing the Coinbase-centric time.
 */
export interface CoinbaseTime {
  iso: string
  epoch: number
}

/**
 * The Coinbase time API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-time
 */
export class CoinbaseTimeAPI {
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
   * Get the current Coinbase-centric time.
   *
   * @returns The current Coinbase-centric time.
   */
  async getTime() {
    return this.#api.get<CoinbaseTime>(`/v2/time`)
  }
}
