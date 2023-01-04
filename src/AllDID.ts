import { AllDIDError, AllDIDErrorCode } from './errors/AllDIDError'
import { NamingService, RecordItem, RecordItemAddr } from './services/NamingService'

export class AllDID {
  services: NamingService[] = []

  installService (service: NamingService) {
    this.services.push(service)
  }

  async getServiceOrThrow (name: string) {
    const service = await this.asyncFindService(service => service.isSupported(name))

    if (!service) {
      throw new AllDIDError(`AllDID do not supported ${name}`, AllDIDErrorCode.DidIsNotSupported)
    }

    return service
  }

  async asyncFindService (callback: (service: NamingService) => any): Promise<NamingService | null> {
    for (const nameService of this.services) {
      const item = await callback(nameService)
      if (item) return nameService
    }
  }

  async isSupported (name: string): Promise<boolean> {
    const nameService = await this.asyncFindService(service => service.isSupported(name))
    return !!nameService
  }

  async isRegistered (name: string): Promise<boolean> {
    const service = await this.getServiceOrThrow(name)

    return await service.isRegistered(name)
  }

  async isAvailable (name: string): Promise<boolean> {
    const service = await this.getServiceOrThrow(name)

    return await service.isAvailable(name)
  }

  async owner (name: string): Promise<string> {
    const service = await this.getServiceOrThrow(name)

    return await service.owner(name)
  }

  async manager (name: string): Promise<string> {
    const service = await this.getServiceOrThrow(name)

    return await service.manager(name)
  }

  async tokenId (name: string): Promise<string> {
    const service = await this.getServiceOrThrow(name)

    return await service.tokenId(name)
  }

  async record (name: string, key: string): Promise<RecordItem> {
    const service = await this.getServiceOrThrow(name)

    return await service.record(name, key)
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    const service = await this.getServiceOrThrow(name)

    return await service.records(name, keys)
  }

  async addrs (name: string, filter?: string | string[]): Promise<RecordItemAddr[]> {
    const service = await this.getServiceOrThrow(name)

    return await service.addrs(name, filter)
  }

  async addr (name: string, filter?: string): Promise<RecordItemAddr> {
    const service = await this.getServiceOrThrow(name)

    return await service.addr(name, filter)
  }

  // async dweb (name: string): Promise<string> {
  //   const service = await this.getServiceOrThrow(name)

  //   return service.dweb(name)
  // }

  // async dwebs (name: string): Promise<string[]>{
  //   const service = await this.getServiceOrThrow(name)

  //   return service.dwebs(name)
  // }

  // reverse (address: string, currencyTicker: string) {

  // }

  async registryAddress (name: string): Promise<string> {
    const service = await this.getServiceOrThrow(name)
    return await service.registryAddress(name)
  }
}
