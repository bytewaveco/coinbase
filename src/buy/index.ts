import { CoinbaseAPI } from '../base'

export interface CoinbaseBuy {
  id: string
  status: string
  payment_method: {
    id: string
    resource: string
    resource_path: string
  }
  transaction: {
    id: string
    resource: 'transaction'
    resource_path: string
  }
  amount: {
    amount: string
    currency: string
  }
  total: {
    amount: string
    currency: string
  }
  subtotal: {
    amount: string
    currency: string
  }
  created_at: string
  updated_at: string
  resource: 'buy'
  resource_path: string
  committed: boolean
  instant: boolean
  fee: {
    amount: string
    currency: string
  }
  payout_at: string
}

/**
 * The Coinbase users API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-users
 */
export class CoinbaseBuysAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase users endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey: string, private apiSecret: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get the API key owner's account buys.
   *
   * @param accountId - The account id.
   * @returns A list of buys.
   */
  async listBuys(accountId: string) {
    return this.#api.paginatedGet<CoinbaseBuy>(`/v2/accounts/${accountId}/buys`)
  }

  /**
   * Get a buy.
   *
   * @param accountId - The account id.
   * @param buyId - The buy id.
   * @returns A list of buys.
   */
  async getBuy(accountId: string) {
    return this.#api.get<CoinbaseBuy>(`/v2/accounts/${accountId}/buys/${buyId}`)
  }
}
