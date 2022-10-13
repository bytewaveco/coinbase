import { _client } from '.'
import { type CoinbaseAccount } from '../src/accounts'

function validateAccount(account: CoinbaseAccount) {
  expect(account).toBeInstanceOf(Object)
  expect(account.id).toBeDefined()
  expect(account.name).toBeDefined()
  expect(account.primary).toBeDefined()
  expect(account.type).toBeDefined()

  expect(account.currency).toBeInstanceOf(Object)
  expect(account.currency.code).toBeDefined()
  expect(account.currency.name).toBeDefined()
  expect(account.currency.color).toBeDefined()
  expect(account.currency.sort_index).toBeDefined()
  expect(account.currency.exponent).toBeDefined()
  expect(account.currency.type).toBeDefined()
  expect(account.currency.address_regex).toBeDefined()
  expect(account.currency.asset_id).toBeDefined()
  expect(account.currency.slug).toBeDefined()

  expect(account.balance).toBeInstanceOf(Object)
  expect(account.balance.amount).toBeDefined()
  expect(account.balance.currency).toBeDefined()

  expect(account.created_at).toBeDefined()
  expect(account.updated_at).toBeDefined()
  expect(account.resource).toBeDefined()
  expect(account.resource_path).toBeDefined()
  expect(account.allow_deposits).toBeDefined()
  expect(account.allow_withdrawals).toBeDefined()
}

describe.concurrent('Accounts API', async () => {
  it('returns the list of accounts', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()

    expect(accounts).toBeInstanceOf(Array)
    expect(accounts.length).toBeGreaterThan(0)

    for (const account of accounts) {
      validateAccount(account)
    }
  })

  it('returns single account', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    const account = await client.accounts.getAccount(accounts[0].id)

    validateAccount(account)
  })

  it('updates account', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    const account = await client.accounts.updateAccount(accounts[0].id, {
      name: accounts[0].name,
    })

    validateAccount(account)
  })

  it('throws if no update information provided', async () => {
    const client = _client()
    let didntThrow = false

    try {
      await client.accounts.updateAccount('', {})
      didntThrow = true
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('No account update information provided.')
    }

    expect(didntThrow).toBe(false)
  })

  it('deletes account', async () => {
    // const client = _client()
    // const accounts = await client.accounts.listAccounts()
    // const deleteReturn = await client.accounts.deleteAccount(accounts[0].id)
    // expect(deleteReturn).toBeDefined()
  })
})
