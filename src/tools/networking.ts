import { fetch } from 'cross-fetch'
import { UnregisteredNameError, UnsupportedNameError, RecordNotFoundError, InvalidParameterError, UnknownError } from '../errors/AllDIDError'

export class Networking {
  static serviceName = 'api'
  constructor (public baseUri: string) {
  }

  throwOnError (res: any) {
    // refer to https://github.com/dotbitHQ/AllDID/blob/main/docs/ApiService.md
    switch (res.code) {
      case 4000: throw new InvalidParameterError(Networking.serviceName)
      case 4001: throw new UnregisteredNameError(Networking.serviceName)
      case 4002: throw new RecordNotFoundError(Networking.serviceName)
      case 4003: throw new UnsupportedNameError(Networking.serviceName)
      
      case 500:
      case 5000: throw new UnknownError(Networking.serviceName, res.msg)
    }

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
