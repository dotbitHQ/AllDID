import { fetch } from 'cross-fetch'

export class Networking {
  constructor (public baseUri: string) {
  }

  throwOnError (res: any) {
    return res
  }

  get (path: string) {
    return fetch(this.baseUri + '/' + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(this.throwOnError)
  }

  post (path: string, body?: any) {
    return fetch(this.baseUri + '/' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(this.throwOnError)
  }
}