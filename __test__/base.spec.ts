import fetch from 'isomorphic-fetch'
import { type Mock } from 'vitest'
import { CoinbaseAPI } from '../src/base'

vi.mock('isomorphic-fetch', () => ({
  default: vi.fn(),
}))

describe.concurrent('API Base', async () => {
  it('throws if res error', async () => {
    ;(fetch as Mock).mockResolvedValueOnce({
      json: async () => ({
        error: "Oooops! That's an error!",
      }),
    })

    const base = new CoinbaseAPI()

    let didntThrow = false

    try {
      await base.get('')
      didntThrow = true
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe("Oooops! That's an error!")
    }

    expect(didntThrow).toBe(false)
  })

  it('makes GET with no credentials', async () => {
    ;(fetch as Mock).mockResolvedValueOnce({
      json: async () => ({
        data: [],
      }),
    })

    const base = new CoinbaseAPI()

    const res = await base.get('/v2/currencies')

    expect(res).toBeInstanceOf(Array)
  })

  it('continues paginated request if no data', async () => {
    const base = new CoinbaseAPI()

    base.get = vi
      .fn()
      .mockResolvedValueOnce({
        data: undefined,
        pagination: {},
      })
      .mockResolvedValueOnce({
        data: undefined,
      })

    const paginatedData = await base.paginatedGet('')

    expect(paginatedData).toEqual([])
  })

  it('posts with no body', async () => {
    ;(fetch as Mock).mockResolvedValueOnce({
      json: async () => ({}),
    })

    const base = new CoinbaseAPI('', '')

    const post = await base.post('')

    expect(post).toEqual({})
  })
})
