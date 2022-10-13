import { _client } from '.'
import { type CoinbaseUser, type CoinbaseUserSelf } from '../src/users'

function validateUser(user: CoinbaseUser) {
  expect(user).toBeInstanceOf(Object)
  expect(user.id).toBeDefined()
  expect(user.name).toBeDefined()
  expect(user.username).toBeDefined()
  expect(user.profile_location).toBeDefined()
  expect(user.profile_bio).toBeDefined()
  expect(user.profile_url).toBeDefined()
  expect(user.avatar_url).toBeDefined()
  expect(user.resource).toBeDefined()
  expect(user.resource_path).toBeDefined()
  expect(user.email).toBeDefined()
}

function validateSelf(user: CoinbaseUserSelf) {
  validateUser(user)

  expect(user.legacy_id).toBeDefined()
  expect(user.time_zone).toBeDefined()
  expect(user.native_currency).toBeDefined()
  expect(user.bitcoin_unit).toBeDefined()
  expect(user.state).toBeDefined()

  expect(user.country).toBeInstanceOf(Object)
  expect(user.country.code).toBeDefined()
  expect(user.country.name).toBeDefined()
  expect(user.country.is_in_europe).toBeDefined()

  expect(user.nationality).toBeInstanceOf(Object)
  expect(user.nationality.code).toBeDefined()
  expect(user.nationality.name).toBeDefined()

  expect(user.region_supports_fiat_transfers).toBeDefined()
  expect(user.region_supports_crypto_to_crypto_transfers).toBeDefined()
  expect(user.created_at).toBeDefined()
  expect(user.supports_rewards).toBeDefined()

  expect(user.tiers).toBeInstanceOf(Object)
  expect(user.tiers.completed_description).toBeDefined()
  expect(user.tiers.upgrade_button_text).toBeDefined()
  expect(user.tiers.header).toBeDefined()
  expect(user.tiers.body).toBeDefined()

  expect(user.referral_money).toBeInstanceOf(Object)
  expect(user.referral_money.amount).toBeDefined()
  expect(user.referral_money.currency).toBeDefined()
  expect(user.referral_money.currency_symbol).toBeDefined()
  expect(user.referral_money.referral_threshold).toBeDefined()

  expect(user.has_blocking_buy_restrictions).toBeDefined()
  expect(user.has_made_a_purchase).toBeDefined()
  expect(user.has_buy_deposit_payment_methods).toBeDefined()
  expect(user.has_unverified_buy_deposit_payment_methods).toBeDefined()
  expect(user.needs_kyc_remediation).toBeDefined()
  expect(user.show_instant_ach_ux).toBeDefined()
  expect(user.user_type).toBeDefined()
}

describe.concurrent('Users API', async () => {
  it('returns API key owner', async () => {
    const client = _client()

    const user = await client.users.getSelf()

    validateSelf(user)
  })

  it('returns user by id', async () => {
    const client = _client()

    const self = await client.users.getSelf()
    const user = await client.users.getUser(self.id)

    validateUser(user)
  })

  it('updates user', async () => {
    const client = _client()

    const self = await client.users.getSelf()
    const user = await client.users.updateSelf({
      name: self.name,
    })

    validateSelf(user)
  })

  it('throws if no update information provided', async () => {
    const client = _client()
    let didntThrow = false

    try {
      await client.users.updateSelf({})
      didntThrow = true
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('No user update information provided.')
    }

    expect(didntThrow).toBe(false)
  })
})
