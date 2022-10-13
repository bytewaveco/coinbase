import { _client } from '.'
import {
  type CoinbaseTransaction,
  type CoinbaseTransactionBuy,
  type CoinbaseTransactionRequest,
  type CoinbaseTransactionSend,
} from '../src/transactions'

function validateTransaction(transaction: CoinbaseTransaction) {
  expect(transaction).toBeInstanceOf(Object)
  expect(transaction.id).toBeDefined()
  expect(transaction.type).toBeDefined()
  expect(transaction.status).toBeDefined()

  if (transaction.amount) {
    expect(transaction.amount).toBeInstanceOf(Object)
    expect(transaction.amount.amount).toBeDefined()
    expect(transaction.amount.currency).toBeDefined()
  }

  if ((transaction as CoinbaseTransactionBuy).buy) {
    expect((transaction as CoinbaseTransactionBuy).buy).toBeInstanceOf(Object)
    expect((transaction as CoinbaseTransactionBuy).buy.id).toBeDefined()
    expect((transaction as CoinbaseTransactionBuy).buy.resource).toBe('buy')
    expect((transaction as CoinbaseTransactionBuy).buy.resource_path).toBeDefined()
  }

  if ((transaction as CoinbaseTransactionSend).network) {
    expect((transaction as CoinbaseTransactionSend).network).toBeInstanceOf(Object)
    expect((transaction as CoinbaseTransactionSend).network.status).toBeDefined()

    if ((transaction as CoinbaseTransactionSend).network.status_description) {
      expect(
        (transaction as CoinbaseTransactionSend).network.status_description
      ).toBeDefined()
    } else {
      expect(
        (transaction as CoinbaseTransactionSend).network.status_description
      ).toBeNull()
    }
  }

  if ((transaction as CoinbaseTransactionSend).to) {
    expect((transaction as CoinbaseTransactionSend).to).toBeInstanceOf(Object)
    expect((transaction as CoinbaseTransactionSend).to.id).toBeDefined()
    expect((transaction as CoinbaseTransactionSend).to.resource).toBeDefined()
    expect((transaction as CoinbaseTransactionSend).to.resource_path).toBeDefined()
  }

  if (
    (transaction as CoinbaseTransactionRequest).to &&
    (transaction as CoinbaseTransactionRequest).to.resource === 'email'
  ) {
    expect((transaction as CoinbaseTransactionRequest).to.email).toBeDefined()
  }

  if (transaction.native_amount) {
    expect(transaction.native_amount).toBeInstanceOf(Object)
    expect(transaction.native_amount.amount).toBeDefined()
    expect(transaction.native_amount.currency).toBeDefined()
  }

  if (transaction.description) {
    expect(transaction.description).toBeDefined()
  } else {
    expect(transaction.description).toBeNull()
  }

  expect(transaction.created_at).toBeDefined()
  expect(transaction.updated_at).toBeDefined()
  expect(transaction.resource).toBe('transaction')
  expect(transaction.resource_path).toBeDefined()

  expect(transaction.details).toBeInstanceOf(Object)
  expect(transaction.details.title).toBeDefined()
  expect(transaction.details.subtitle).toBeDefined()
}

describe.concurrent('Transactions API', async () => {
  it('returns the list of transactions', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    const transactions = await client.transactions.listTransactions(accounts[0].id)

    expect(transactions).toBeInstanceOf(Array)
    expect(transactions.length).toBeGreaterThan(0)

    for (const transaction of transactions) {
      validateTransaction(transaction)
    }
  })

  it('returns single transaction', async () => {
    const client = _client()

    const accounts = await client.accounts.listAccounts()
    const transactions = await client.transactions.listTransactions(accounts[0].id)
    const transaction = await client.transactions.getTransaction(
      accounts[0].id,
      transactions[0].id
    )

    validateTransaction(transaction)
  })
})
