import { CoinbaseAPI } from '../base'

interface CoinbaseTransactionDetails extends Record<string, unknown> {
  title: string
  subtitle: string
}

/**
 * Information describing a generic Coinbase transaction.
 */
interface CoinbaseTransactionBase {
  id: string
  type: 'buy' | 'sell' | 'send' | 'request'
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
  details: CoinbaseTransactionDetails
}

/**
 * Information describing a Coinbase buy transaction.
 */
export interface CoinbaseTransactionBuy extends CoinbaseTransactionBase {
  type: 'buy'
  buy: {
    id: string
    resource: 'buy'
    resource_path: string
  }
}

/**
 * Information describing a Coinbase send transaction.
 */
export interface CoinbaseTransactionSend extends CoinbaseTransactionBase {
  type: 'send'
  network: {
    status: string
    status_description: string | null
  }
  to: {
    id: string
    resource: string
    resource_path: string
  }
}

/**
 * Information describing a Coinbase request transaction.
 */
export interface CoinbaseTransactionRequest extends CoinbaseTransactionBase {
  type: 'request'
  to: {
    resource: 'email'
    email: string
  }
}

/**
 * Information describing a generic Coinbase transaction request.
 */
interface CoinbaseTransactionCreateOptionsBase extends Record<string, unknown> {
  type: 'send' | 'transfer' | 'request'
  to: string
  amount: string
  currency: string
  description?: string
}

/**
 * Information describing a Coinbase send request.
 */
export interface CoinbaseTransactionMoneySend
  extends CoinbaseTransactionCreateOptionsBase {
  type: 'send'
  skip_notifications?: boolean
  fee?: string
  idem?: string
  to_financial_institution?: boolean
  financial_institution_website?: boolean
}

/**
 * Information describing a Coinbase transfer request.
 */
export interface CoinbaseTransactionMoneyTransfer
  extends CoinbaseTransactionCreateOptionsBase {
  type: 'transfer'
}

/**
 * Information describing a Coinbase money request request.
 */
export interface CoinbaseTransactionMoneyRequest
  extends CoinbaseTransactionCreateOptionsBase {
  type: 'request'
}

/**
 * Information describing a Coinbase transaction.
 */
export type CoinbaseTransaction =
  | CoinbaseTransactionBuy
  | CoinbaseTransactionSend
  | CoinbaseTransactionRequest

/**
 * The Coinbase transactions API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions
 */
export class CoinbaseTransactionsAPI {
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
   * Get the API key owner's transactions for an account.
   *
   * @param accountId - The account id.
   * @returns A list of addresses.
   */
  async listTransactions(accountId: string) {
    return this.#api.paginatedGet<CoinbaseTransactionBuy | CoinbaseTransactionSend>(
      `/v2/accounts/${accountId}/transactions`
    )
  }

  /**
   * Get the API key owner's account transaction by its id.
   *
   * @param accountId - The account id.
   * @param transactionId - The address id.
   * @returns The address matching the transactionId.
   */
  async getTransaction(accountId: string, transactionId: string) {
    return await this.#api.get<CoinbaseTransactionBuy | CoinbaseTransactionSend>(
      `/v2/accounts/${accountId}/transactions/${transactionId}`
    )
  }

  /**
   * Send money from the API key owner's account to another account.
   *
   * @param accountId - The account id.
   * @param options - The send information.
   * @returns The resulting transaction.
   */
  async sendMoney(accountId: string, options: CoinbaseTransactionMoneySend) {
    return await this.#api.post<CoinbaseTransactionSend>(
      `/v2/accounts/${accountId}/transactions`,
      options
    )
  }

  /**
   * Transfer money from the API key owner's account to another owned account.
   *
   * @param accountId - The account id.
   * @param options - The transfer information.
   * @returns The resulting transaction.
   */
  async transferMoney(accountId: string, options: CoinbaseTransactionMoneyTransfer) {
    return await this.#api.post<CoinbaseTransactionSend>(
      `/v2/accounts/${accountId}/transactions`,
      options
    )
  }

  /**
   * Request money from a user via email.
   *
   * @param accountId - The account id.
   * @param options - The transfer information.
   * @returns The resulting transaction.
   */
  async requestMoney(accountId: string, options: CoinbaseTransactionMoneyRequest) {
    return await this.#api.post<CoinbaseTransactionRequest>(
      `/v2/accounts/${accountId}/transactions`,
      options
    )
  }

  /**
   * Re-send a money request to a user via email.
   *
   * @param accountId - The account id.
   * @param transactionId - The transaction id.
   * @returns Unknown.
   */
  async resendRequestMoney(accountId: string, transactionId: string) {
    return await this.#api.post<unknown>(
      `/v2/accounts/${accountId}/transactions/${transactionId}/resend`
    )
  }

  /**
   * Cancel a money request.
   *
   * @param accountId - The account id.
   * @param transactionId - The transaction id.
   * @returns Unknown.
   */
  async cancelRequestMoney(accountId: string, transactionId: string) {
    return await this.#api.delete(
      `/v2/accounts/${accountId}/transactions/${transactionId}`
    )
  }
}
