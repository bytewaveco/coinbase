import { _client } from '.'
import { type CoinbaseCurrency } from '../src/currencies'

function validateCurrency(currency: CoinbaseCurrency) {
  expect(currency).toBeInstanceOf(Object)
  expect(currency.id).toBeDefined()
  expect(currency.name).toBeDefined()
  expect(currency.min_size).toBeDefined()
}

describe.concurrent('Currencies API', async () => {
  it('returns the list of currencies', async () => {
    const client = _client()

    const currencies = await client.currencies.listCurrencies()

    expect(currencies).toBeInstanceOf(Array)
    expect(currencies.length).toBeGreaterThan(0)

    for (const currency of currencies) {
      validateCurrency(currency)
    }
  })
})
