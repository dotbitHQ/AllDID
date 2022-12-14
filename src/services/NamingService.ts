import { AllDIDError, AllDIDErrorCode } from '../errors/AllDIDError'

export interface RecordItem {
  key: string, // full key, like `address.60`
  type: string, // the type of the key, like `address`
  subtype: string, // the subtype of the key, like `60`
  label: string, // the user customized label of the key, like `personal`
  value: string, // the value of the key, like `0x123...abc`
  ttl: number, // the ttl of the key
}

export interface RecordItemAddr extends RecordItem {
  symbol: string, // the symbol of the coin_type, like 'ETH'
}

export interface RecordItemDweb extends RecordItem {
  protocolType: string,
  decoded: string,
}

export abstract class NamingService {
  abstract serviceName: string

  throwIfNotSupported (name: string) {
    if (!this.isSupported(name)) {
      throw new AllDIDError(`${this.serviceName} do not supported ${name}`, AllDIDErrorCode.DidIsNotSupported)
    }
  }

  /**
   * Check if the given name is a valid DID name.
   * @param name
   */
  abstract isSupported (name: string): boolean

  /**
   * Check if the given name is registered
   * @param name
   */
  abstract isRegistered (name: string): Promise<boolean>

  /**
   * Check if it is available to register
   * @param name
   */
  abstract isAvailable (name: string): Promise<boolean>

  abstract owner (name: string): Promise<string>
  abstract manager (name: string): Promise<string>

  abstract tokenId (name: string): Promise<string>

  abstract records (name: string, keys?: string | string[]): Promise<RecordItem[]>
  abstract record (name: string, key: string): Promise<RecordItem>

  abstract addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]>
  abstract addr (name: string, keys?: string | string[]): Promise<RecordItemAddr>

  // abstract dwebs (name: string, keys?: string | string[]): Promise<RecordItemDweb[]>
  // abstract dweb (name: string): Promise<RecordItemDweb>

  abstract reverse (address: string, currencyTicker: string): Promise<string | null>

  abstract registryAddress (name: string): Promise<string>
}
