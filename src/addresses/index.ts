import { CoinbaseAPI } from '../base'

/**
 * Information describing a Coinbase address.
 */
export interface CoinbaseAddress {
  id: string
  address: string
  name: string
  created_at: string
  updated_at: string
  network: string
  resource: 'address'
  resource_path: string
}

/**
 * Informations describing a Coinbase address transaction.
 */
export interface CoinbaseAddressTransaction {
  id: string
  type: string
  status: string
  amount: {
    amount: string
    currency: string
  }
  native_amount: {
    amount: string
    currency: string
  }
  description: string | null
  created_at: string
  updated_at: string
  resource: 'transaction'
  resource_path: string
  network: {
    status: string
    name: string
  }
  from: {
    id: string
    resource: string
  }
}

/**
 * Information for a address create operation.
 */
export interface CoinbaseAddressCreate {
  name: string
}

/**
 * The Coinbase addresses API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses
 */
export class CoinbaseAddressesAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase addresses endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey: string, private apiSecret: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get the API key owner's addresses for an account.
   *
   * @param accountId - The account id.
   * @returns A list of addresses.
   */
  async listAddresses(accountId: string) {
    return this.#api.paginatedGet<CoinbaseAddress>(`/v2/accounts/${accountId}/addresses`)
  }

  /**
   * Get the API key owner's address in an account by its id.
   *
   * @param accountId - The account id.
   * @param addressId - The address id.
   * @returns The address matching the addressId.
   */
  async getAddress(accountId: string, addressId: string) {
    return await this.#api.get<CoinbaseAddress>(
      `/v2/accounts/${accountId}/addresses/${addressId}`
    )
  }

  /**
   * Get the API key owner's transactions for an account's address.
   *
   * @param accountId - The account id.
   * @param addressId - The address id.
   * @returns The transactions for the address matching the addressId.
   */
  async listAddressTransactions(accountId: string, addressId: string) {
    return this.#api.paginatedGet<CoinbaseAddressTransaction>(
      `/v2/accounts/${accountId}/addresses/${addressId}/transactions`
    )
  }

  /**
   * Create a new address for an account.
   *
   * @param accountId - The account id.
   * @param options - The address create options.
   * @returns The created address.
   */
  async createAddress(accountId: string, options: Partial<CoinbaseAddressCreate>) {
    return await this.#api.post<CoinbaseAddress>(
      `/v2/accounts/${accountId}/addresses`,
      options
    )
  }
}
