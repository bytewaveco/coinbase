import { _client } from '.'
import { type CoinbaseTime } from '../src/time'

function validateTime(time: CoinbaseTime) {
  expect(time).toBeInstanceOf(Object)
  expect(time.iso).toBeDefined()
  expect(time.epoch).toBeDefined()
}

describe.concurrent('Time API', async () => {
  it('returns buy price', async () => {
    const client = _client()

    const time = await client.time.getTime()

    validateTime(time)
  })
})
