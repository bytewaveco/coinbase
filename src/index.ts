import { CoinbaseAccountsAPI } from './accounts'
import { CoinbaseAddressesAPI } from './addresses'
import { CoinbaseCurrenciesAPI } from './currencies'
import { CoinbaseExchangeRatesAPI } from './exchangeRates'
import { CoinbaseNotificationsAPI } from './notifications'
import { CoinbasePricesAPI } from './prices'
import { CoinbaseTimeAPI } from './time'
import { CoinbaseTransactionsAPI } from './transactions'
import { CoinbaseUsersAPI } from './users'

/**
 * A Coinbase API client.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/getting-started
 */
export class CoinbaseClient {
  // Notifications API
  notifications: CoinbaseNotificationsAPI

  // Wallet API
  users: CoinbaseUsersAPI
  accounts: CoinbaseAccountsAPI
  addresses: CoinbaseAddressesAPI
  transactions: CoinbaseTransactionsAPI

  // Data API
  currencies: CoinbaseCurrenciesAPI
  exchangeRates: CoinbaseExchangeRatesAPI
  prices: CoinbasePricesAPI
  time: CoinbaseTimeAPI

  /**
   * Create a client implementation of the Coinbase API.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey?: string, private apiSecret?: string) {
    // Notifications API
    this.notifications = new CoinbaseNotificationsAPI(this.apiKey, this.apiSecret)

    // Wallet API
    this.users = new CoinbaseUsersAPI(this.apiKey, this.apiSecret)
    this.accounts = new CoinbaseAccountsAPI(this.apiKey, this.apiSecret)
    this.addresses = new CoinbaseAddressesAPI(this.apiKey, this.apiSecret)
    this.transactions = new CoinbaseTransactionsAPI(this.apiKey, this.apiSecret)

    // Data API
    this.currencies = new CoinbaseCurrenciesAPI(this.apiKey, this.apiSecret)
    this.exchangeRates = new CoinbaseExchangeRatesAPI(this.apiKey, this.apiSecret)
    this.prices = new CoinbasePricesAPI(this.apiKey, this.apiSecret)
    this.time = new CoinbaseTimeAPI(this.apiKey, this.apiSecret)
  }
}
