import crypto from 'crypto-js'
import fetch from 'isomorphic-fetch'

/**
 * Information describing the Coinbase pagination.
 */
export interface CoinbasePagination {
  ending_before?: string
  starting_after?: string
  limit: number
  order: 'asc' | 'desc'
  previous_uri?: string
  next_uri?: string
}

/**
 * The format of data returned by the Coinbase API.
 */
export interface CoinbaseAPIData<T> {
  pagination?: CoinbasePagination
  data: T
  error?: unknown
}

/**
 * The Coinbase API base.
 */
export class CoinbaseAPI {
  #apiUrlBase = 'https://api.coinbase.com'
  #apiVersion = '2021-07-26'

  /**
   *
   *
   * @param apiKey - The API key.
   * @param apiSecret - The API secret.
   */
  constructor(private apiKey?: string, private apiSecret?: string) {}

  /**
   * Getter for a timestamp.
   *
   * @returns The current timestamp.
   */
  get #timestamp() {
    return Math.floor(Date.now() / 1000).toString()
  }

  #simplify<T>(res: CoinbaseAPIData<T>): T | CoinbaseAPIData<T> {
    if (res.error) {
      throw new Error(res.error as string)
    } else if (Object.keys(res).length === 1 && res.data) {
      return res.data
    }

    return res
  }

  /**
   * Make a GET request to the Coinbase API.
   *
   * @param url - The URL to send the request to.
   * @param params - The query parameters to send with the request.
   * @returns The response data.
   */
  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    url = `${url}${params ? `?${new URLSearchParams(params)}` : ''}`

    const headers: HeadersInit = {
      accept: 'application/json',
      'CB-VERSION': this.#apiVersion,
    }

    if (typeof this.apiKey === 'string' && typeof this.apiSecret === 'string') {
      const cbAccessTimestamp = this.#timestamp
      const message = `${cbAccessTimestamp}GET${url}`
      const cbAccessSign = crypto.algo.HMAC.create(crypto.algo.SHA256, this.apiSecret)
        .update(message)
        .finalize()
        .toString(crypto.enc.Hex)

      headers['CB-ACCESS-KEY'] = this.apiKey
      headers['CB-ACCESS-SIGN'] = cbAccessSign
      headers['CB-ACCESS-TIMESTAMP'] = cbAccessTimestamp
    }

    return fetch(`${this.#apiUrlBase}${url}`, {
      method: 'GET',
      headers,
    })
      .then((res) => res.json())
      .then(this.#simplify<T>) as T
  }

  /**
   * Make a series of GET requests to the Coinbase API.
   *
   * @param url - The URL to send the request to.
   * @param params - The initial query parameters to send with the request.
   * @returns The cumulative response data array.
   */
  async paginatedGet<T>(url: string, params?: Record<string, string>) {
    params = params ?? {}

    const data: T[] = []
    let pagination: CoinbasePagination | undefined

    do {
      const res = await this.get<CoinbaseAPIData<T>>(url, {
        limit: '100',
        ...params,
      })

      if (res.pagination) {
        pagination = res.pagination
        data.push(...(Array.isArray(res.data) ? res.data : []))

        if (pagination.next_uri) {
          params.starting_after = pagination.next_uri
        }
      } else {
        break
      }
    } while (
      typeof pagination === 'undefined' ||
      typeof pagination?.next_uri === 'string'
    )

    return data
  }

  /**
   * Make a POST-ish request to the Coinbase API.
   *
   * @param url - The URL to send the request to.
   * @param body - The body of the request.
   * @param method - The HTTP method to use.
   * @returns The response data.
   */
  async post<T>(
    url: string,
    body?: Record<string, unknown>,
    method = 'POST'
  ): Promise<T> {
    const _body = JSON.stringify(body ?? {})

    const cbAccessTimestamp = this.#timestamp
    const message = `${cbAccessTimestamp}${method}${url}${_body}`
    const cbAccessSign = crypto.algo.HMAC.create(crypto.algo.SHA256, this.apiSecret)
      .update(message)
      .finalize()
      .toString(crypto.enc.Hex)

    return fetch(`${this.#apiUrlBase}${url}`, {
      method,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'CB-ACCESS-KEY': this.apiKey,
        'CB-ACCESS-SIGN': cbAccessSign,
        'CB-ACCESS-TIMESTAMP': cbAccessTimestamp,
        'CB-VERSION': this.#apiVersion,
      },
      body: _body,
    })
      .then((res) => res.json())
      .then(this.#simplify<T>) as T
  }

  /**
   * Make a PUT request to the Coinbase API.
   *
   * @param url - The URL to send the request to.
   * @param body - The body of the request.
   * @returns The response body.
   */
  async put<T>(url: string, body?: Record<string, unknown>) {
    return this.post<T>(url, body, 'PUT')
  }

  /**
   * Make a DELETE request to the Coinbase API.
   *
   * @param url - The URL to send the request to.
   * @returns The response body.
   */
  async delete(url: string) {
    return this.post<unknown>(url, undefined, 'DELETE')
  }
}
