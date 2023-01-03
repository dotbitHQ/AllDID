import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { Networking } from '../tools/networking'

export interface ApiServiceOptions {
    baseUri: string,
    network: string
}

export function createLiteInstance (options: ApiServiceOptions) {
  return new ApiService(options)
}

export class ApiService extends NamingService {
  serviceName = 'api'
  api: Networking

  constructor (options: ApiServiceOptions) {
    super()
    this.api = new Networking(options.baseUri)
  }

  async isSupported (name: string): Promise<boolean> {
    const res = await this.api.get('/')
    return null
  }

  isRegistered (name: string): Promise<boolean> {
    return null
  }

  isAvailable (name: string): Promise<boolean> {
    return null
  }

  owner (name: string): Promise<string> {
    return null
  }

  manager (name: string): Promise<string> {
    return null
  }

  tokenId (name: string): Promise<string> {
    return null
  }

  record (name: string, key: string): Promise<RecordItem | null> {
    return null
  }

  records (name: string, keys?: string[]): Promise<RecordItem[]> {
    return null
  }

  addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    return null
  }

  addr (name: string, currencyTicker: string): Promise<RecordItemAddr | null> {
    return null
  }

  dweb (name: string): Promise<string | null> {
    return null
  }

  dwebs (name: string): Promise<string[]> {
    return null
  }

  async reverse (address: string, currencyTicker: string): Promise<string | null> {
    return null
  }

  registryAddress (name: string): Promise<string> {
    return null
  }
}
