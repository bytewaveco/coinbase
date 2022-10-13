import { _client } from '.'
import { type CoinbaseExchangeRate } from '../src/exchangeRates'

function validateExchangeRate(currency: CoinbaseExchangeRate) {
  expect(currency).toBeInstanceOf(Object)
  expect(currency.currency).toBeDefined()

  expect(currency.rates).toBeInstanceOf(Object)
  expect(Object.keys(currency.rates).length).toBeGreaterThan(0)

  for (const [crossCurrency, rate] of Object.entries(currency.rates)) {
    expect(typeof crossCurrency).toBe('string')
    expect(typeof rate).toBe('string')
  }
}

describe.concurrent('Exchange Rates API', async () => {
  it('returns the list of exchange rates', async () => {
    const client = _client()

    const rates = await client.exchangeRates.listExchangeRates()

    validateExchangeRate(rates)
  })
})
