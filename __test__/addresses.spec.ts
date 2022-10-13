import { _client } from '.'
import { type CoinbaseAddress, type CoinbaseAddressTransaction } from '../src/addresses'

function validateAddress(address: CoinbaseAddress) {
  expect(address).toBeInstanceOf(Object)
  expect(address.id).toBeDefined()
  expect(address.address).toBeDefined()
  expect(address.name).toBeDefined()
  expect(address.created_at).toBeDefined()
  expect(address.updated_at).toBeDefined()
  expect(address.network).toBeDefined()
  expect(address.resource).toBeDefined()
  expect(address.resource_path).toBeDefined()
}

function validateTransaction(transaction: CoinbaseAddressTransaction) {
  expect(transaction).toBeInstanceOf(Object)
  expect(transaction.id).toBeDefined()
  expect(transaction.type).toBeDefined()
  expect(transaction.status).toBeDefined()
  expect(transaction.amount).toBeInstanceOf(Object)
  expect(transaction.amount.amount).toBeDefined()
  expect(transaction.amount.currency).toBeDefined()
  expect(transaction.native_amount).toBeInstanceOf(Object)
  expect(transaction.native_amount.amount).toBeDefined()
  expect(transaction.native_amount.currency).toBeDefined()
  expect(transaction.description).toBeDefined()
  expect(transaction.created_at).toBeDefined()
  expect(transaction.updated_at).toBeDefined()
  expect(transaction.resource).toBeDefined()
  expect(transaction.resource_path).toBeDefined()
  expect(transaction.network).toBeInstanceOf(Object)
  expect(transaction.network.status).toBeDefined()
  expect(transaction.network.name).toBeDefined()
  expect(transaction.from).toBeInstanceOf(Object)
  expect(transaction.from.id).toBeDefined()
  expect(transaction.from.resource).toBeDefined()
}

const testAddressName = 'Test Address'

describe.concurrent('Addresses API', async () => {
  it('returns the list of addresses for an account', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    await client.addresses.createAddress(accounts[0].id, {
      name: testAddressName,
    })
    const addresses = await client.addresses.listAddresses(accounts[0].id)

    expect(addresses).toBeInstanceOf(Array)
    expect(addresses.length).toBeGreaterThan(0)

    for (const address of addresses) {
      validateAddress(address)
    }
  })

  it('returns single address', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    await client.addresses.createAddress(accounts[0].id, {
      name: testAddressName,
    })
    const addresses = await client.addresses.listAddresses(accounts[0].id)
    const address = await client.addresses.getAddress(accounts[0].id, addresses[0].id)

    validateAddress(address)
  })

  it('returns list of address transactions', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    await client.addresses.createAddress(accounts[0].id, {
      name: testAddressName,
    })
    const addresses = await client.addresses.listAddresses(accounts[0].id)
    const transactions = await client.addresses.listAddressTransactions(
      accounts[0].id,
      addresses[0].id
    )

    expect(transactions).toBeInstanceOf(Array)

    for (const transaction of transactions) {
      validateTransaction(transaction)
    }
  })

  it('creates address', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    const address = await client.addresses.createAddress(accounts[0].id, {
      name: testAddressName,
    })

    validateAddress(address)
  })
})
