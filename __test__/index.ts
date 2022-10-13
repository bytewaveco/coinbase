import { CoinbaseClient } from '../src'

const creds = {
  apiKey: process.env.COINBASE_API_KEY,
  apiSecret: process.env.COINBASE_API_SECRET,
}

export function _client() {
  return new CoinbaseClient(creds.apiKey, creds.apiSecret)
}
