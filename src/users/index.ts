import { CoinbaseAPI } from '../base'

/**
 * Information describing a Coinbase user.
 */
export interface CoinbaseUser {
  id: string
  name: string
  username: string | null
  profile_location: string | null
  profile_bio: string | null
  profile_url: string | null
  avatar_url: string
  resource: 'user'
  resource_path: string
  email: string
}

/**
 * Information describing the API key owner.
 */
export interface CoinbaseUserSelf extends CoinbaseUser {
  legacy_id: string
  time_zone: string
  native_currency: string
  bitcoin_unit: string
  state: string
  country: {
    code: string
    name: string
    is_in_europe: boolean
  }
  nationality: { code: string; name: string }
  region_supports_fiat_transfers: boolean
  region_supports_crypto_to_crypto_transfers: boolean
  created_at: string
  supports_rewards: boolean
  tiers: {
    completed_description: string
    upgrade_button_text: string | null
    header: string | null
    body: string | null
  }
  referral_money: {
    amount: string
    currency: string
    currency_symbol: string
    referral_threshold: string
  }
  has_blocking_buy_restrictions: boolean
  has_made_a_purchase: boolean
  has_buy_deposit_payment_methods: boolean
  has_unverified_buy_deposit_payment_methods: boolean
  needs_kyc_remediation: boolean
  show_instant_ach_ux: boolean
  user_type: string
}

/**
 * Information for a user update operation.
 */
export interface CoinbaseUserUpdate {
  name: string
  time_zone: string
  native_currency: string
}

/**
 * The Coinbase users API.
 *
 * https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-users
 */
export class CoinbaseUsersAPI {
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
   * Get the API key owner's user profile.
   *
   * @returns The user matching the API key.
   */
  async getSelf() {
    return this.#api.get<CoinbaseUserSelf>('/v2/user')
  }

  /**
   * Get a user's profile.
   *
   * @param userId - The user's id.
   * @returns The user matching the userId.
   */
  async getUser(userId: string) {
    return this.#api.get<CoinbaseUser>(`/v2/users/${userId}`)
  }

  /**
   * Update the API key owner's user profile.
   *
   * @param userUpdate - The user's updated information.
   * @returns The updated user.
   */
  async updateSelf(userUpdate: Partial<CoinbaseUserUpdate>) {
    if (typeof userUpdate !== 'object' || Object.keys(userUpdate).length === 0) {
      throw new Error('No user update information provided.')
    }

    return this.#api.put<CoinbaseUserSelf>(`/v2/user`, userUpdate)
  }
}
