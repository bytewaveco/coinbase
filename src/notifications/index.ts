import { CoinbaseAPI } from '../base'

/**
 * Types of Coinbase notifications.
 */
export type CoinbaseNotificationType =
  | 'ping'
  | 'wallet:addresses:new-payment'
  | 'wallet:buys:created'
  | 'wallet:buys:completed'
  | 'wallet:buys:canceled'
  | 'wallet:sells:created'
  | 'wallet:sells:completed'
  | 'wallet:sells:canceled'
  | 'wallet:deposit:created'
  | 'wallet:deposit:completed'
  | 'wallet:deposit:canceled'
  | 'wallet:withdrawal:created'
  | 'wallet:withdrawal:completed'
  | 'wallet:withdrawal:canceled'

/**
 * Information describing a Coinbase notification.
 */
export interface CoinbaseNotification {
  id: string
  type: CoinbaseNotificationType
  data: {
    id: string
    status: string
    payment_method: {
      id: string
      resource: 'payment_method'
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
    total?: {
      amount: string
      currency: string
    }
    subtotal: {
      amount: string
      currency: string
    }
    created_at: string
    updated_at: string
    resource: string
    resource_path: string
    committed: boolean
    instant: boolean
    fee: {
      amount: string
      currency: string
    }
    payout_at: string
  }
  additional_data: Record<string, unknown>
  delivered_at: string
  delivery_response: {
    message: string
    body: string
    status_code: number
  }
  subscriber: {
    type: string
    client_id: string
  }
  user: {
    id: string
    resource: 'user'
    resource_path: string
  }
  account: {
    id: string
    resource: 'account'
    resource_path: string
  }
  delivery_attempts: number
  created_at: string
  resource: 'notification'
  resource_path: string
}

/**
 * The Coinbase notifications API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-notifications
 */
export class CoinbaseNotificationsAPI {
  #api: CoinbaseAPI

  /**
   * Create a client implementation of the Coinbase notifications endpoints.
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey: string, private apiSecret: string) {
    this.#api = new CoinbaseAPI(this.apiKey, this.apiSecret)
  }

  /**
   * Get the API key owner's notifications.
   *
   * @returns A list of notifications.
   */
  async listNotifications() {
    return this.#api.paginatedGet<CoinbaseNotification>('/v2/notifications')
  }

  /**
   *  Get a notification by its id.
   *
   * @param notificationId - The notification id.
   * @returns The notification matching the notificationId.
   */
  async getNotification(notificationId: string) {
    return await this.#api.get<CoinbaseNotification>(
      `/v2/notifications/${notificationId}`
    )
  }
}
