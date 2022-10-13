import { _client } from '.'
import { type CoinbasePrice } from '../src/prices'

function validatePrice(price: CoinbasePrice) {
  expect(price).toBeInstanceOf(Object)
  expect(price.amount).toBeDefined()
  expect(price.currency).toBeDefined()
}

describe.concurrent('Prices API', async () => {
  it('returns buy price', async () => {
    const client = _client()

    const price = await client.prices.getBuyPrice('BTC-USD')

    validatePrice(price)
  })

  it('returns sell price', async () => {
    const client = _client()

    const price = await client.prices.getSellPrice('BTC-USD')

    validatePrice(price)
  })

  it('returns spot price', async () => {
    const client = _client()

    const price = await client.prices.getSpotPrice('BTC-USD')

    validatePrice(price)
  })

  it('returns spot price with options', async () => {
    const client = _client()

    const price = await client.prices.getSpotPrice('BTC-USD', {
      date: '2021-01-01',
    })

    validatePrice(price)
  })
})
