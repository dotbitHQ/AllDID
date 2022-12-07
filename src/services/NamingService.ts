import { AllDIDError, AllDIDErrorCode } from '../errors/AllDIDError'

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

  abstract records (name: string, keys?: string | string[]): Promise<Record<string, string>>
  abstract record (name: string, key: string): Promise<string>

  abstract addrs (name: string, keys?: string | string[]): Promise<string>
  abstract addr (name: string, keys?: string | string[]): Promise<string>

  abstract dwebs (name: string, keys?: string | string[]): Promise<string>
  abstract dweb (name: string): Promise<string>

  abstract reverse (address: string, currencyTicker: string): Promise<string | null>

  abstract registryAddress (name: string): Promise<string>
}
