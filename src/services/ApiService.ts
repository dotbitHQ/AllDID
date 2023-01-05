import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { Networking } from '../tools/networking'

export interface ApiServiceOptions {
  baseUrl: string,
  network: string,
}

export function createLiteInstance (options: ApiServiceOptions) {
  return new ApiService(options)
}

export class ApiService extends NamingService {
  serviceName = 'api'
  api: Networking

  constructor (options: ApiServiceOptions) {
    super()
    this.api = new Networking(options.baseUrl)
  }

  async isSupported (name: string): Promise<boolean> {
    return await this.api.get(`api/v1/name/${name}/check/supported`)
  }

  async isRegistered (name: string): Promise<boolean> {
    return await this.api.get(`api/v1/name/${name}/check/registered`)
  }

  async isAvailable (name: string): Promise<boolean> {
    return await this.api.get(`api/v1/name/${name}/check/available`)
  }

  async owner (name: string): Promise<string> {
    return await this.api.get(`api/v1/name/${name}/owner`)
  }

  async manager (name: string): Promise<string> {
    return await this.api.get(`api/v1/name/${name}/manager`)
  }

  async tokenId (name: string): Promise<string> {
    return await this.api.get(`api/v1/name/${name}/tokenid`)
  }

  async record (name: string, key: string): Promise<RecordItem | null> {
    const records = await this.api.get(`api/v1/name/${name}/records?keys=${encodeURIComponent(JSON.stringify([key]))}`)
    return records.length > 0 ? records[0] : null
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    const records = await this.api.get(`api/v1/name/${name}/records?keys=${encodeURIComponent(JSON.stringify(keys || []))}`)
    return records
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    const addrs = await this.api.get(
      `api/v1/name/${name}/addrs?keys=${encodeURIComponent(JSON.stringify(keys || []))}`
    )
    return addrs
  }

  async addr (name: string, currencyTicker: string): Promise<RecordItemAddr | null> {
    const addrs = await this.api.get(
      `api/v1/name/${name}/addrs?keys=${encodeURIComponent(JSON.stringify([currencyTicker]))}`
    )
    return addrs.length > 0 ? addrs[0] : null
  }

  // todo
  // dweb (name: string): Promise<string | null> {
  //   return null
  // }

  // todo
  // dwebs (name: string): Promise<string[]> {
  //   return null
  // }

  // todo
  async reverse (address: string, currencyTicker: string): Promise<string | null> {
    return null
  }

  async registryAddress (name: string): Promise<string> {
    return await this.api.get(
      `api/v1/name/${name}/registry`
    )
  }
}
