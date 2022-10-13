import { CoinbaseAPI } from '../base'

/**
 * Information describing a Coinbase account.
 */
export interface CoinbaseAccount {
  id: string
  name: string
  primary: boolean
  type: 'wallet'
  currency: {
    code: string
    name: string
    color: string
    sort_index: number
    exponent: number
    type: string
    address_regex: string
    asset_id: string
    slug: string
  }
  balance: { amount: string; currency: string }
  created_at: string
  updated_at: string
  resource: 'account'
  resource_path: string
  allow_deposits: boolean
  allow_withdrawals: boolean
}

/**
 * Information for a account update operation.
 */
export interface CoinbaseAccountUpdate {
  name: string
}

/**
 * The Coinbase accounts API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-accounts
 */
export class CoinbaseAccountsAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase accounts endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey: string, private apiSecret: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get the API key owner's accounts.
   *
   * @returns A list of accounts.
   */
  async listAccounts() {
    return this.#api.paginatedGet<CoinbaseAccount>('/v2/accounts')
  }

  /**
   *  Get an account by its id.
   *
   * @param accountId - The account id.
   * @returns The account matching the accountId.
   */
  async getAccount(accountId: string) {
    return await this.#api.get<CoinbaseAccount>(`/v2/accounts/${accountId}`)
  }

  /**
   * Update the specified account.
   *
   * @param accountId - The account id.
   * @param accountUpdate - The account's updated information.
   * @returns The updated account.
   */
  async updateAccount(accountId: string, accountUpdate: Partial<CoinbaseAccountUpdate>) {
    if (typeof accountUpdate !== 'object' || Object.keys(accountUpdate).length === 0) {
      throw new Error('No account update information provided.')
    }

    return await this.#api.put<CoinbaseAccount>(
      `/v2/accounts/${accountId}`,
      accountUpdate
    )
  }

  /**
   * Delete the specified account.
   *
   * The account cannot be a primary account, account with non-zero balance, a
   * fiat account, nor a vault with a pending withdrawal.
   *
   * @param accountId - The account id.
   * @returns Unknown.
   */
  async deleteAccount(accountId: string) {
    return await this.#api.delete(`/v2/accounts/${accountId}`)
  }
}
