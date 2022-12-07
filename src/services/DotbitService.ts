import { createInstance, DotBit, isSupportedAccount } from 'dotbit'
import { NamingService } from './NamingService'

export type DotbitServiceOptions = any // todo: export config interface from dotbit.js

export class DotbitService extends NamingService {
  serviceName = 'dotbit'

  dotbit: DotBit
  constructor (options: DotbitServiceOptions) {
    super()
    this.dotbit = createInstance(options)
  }

  isSupported (name: string): boolean {
    return isSupportedAccount(name)
  }

  isRegistered (name: string): Promise<boolean> {
    return this.dotbit.exist(name)
  }

  isAvailable (name: string): Promise<boolean> {
    return this.isRegistered(name).then(isRegistered => !isRegistered)
  }

  owner (name: string): Promise<string> {
    return this.dotbit.accountInfo(name).then(info => info.owner_key)
  }

  manager (name: string): Promise<string> {
    return this.dotbit.accountInfo(name).then(info => info.manager_key)
  }

  tokenId (name: string): Promise<string> {
    return null
  }

  record (name: string, key: string): Promise<string> {
    return null
  }

  records (name: string, keys?: string[]): Promise<Record<string, string>> {
    return null
  }

  addrs (name: string, keys?: string | string[]): Promise<string> {
    return null
  }

  addr (name: string): Promise<string> {
    return null
  }

  dweb (name: string): Promise<string> {
    return null
  }

  dwebs (name: string): Promise<string> {
    return null
  }

  reverse (address: string, currencyTicker: string): Promise<string | null> {
    return null
  }

  registryAddress (name: string): Promise<string> {
    return null
  }
}
