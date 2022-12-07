import { AllDIDError, AllDIDErrorCode } from './errors/AllDIDError'
import { NamingService } from './services/NamingService'

export class AllDID {
  services: NamingService[] = []

  installService (service: NamingService) {
    this.services.push(service)
  }

  isSupported (name: string) {
    return this.services.some(service => service.isSupported(name))
  }

  getServiceOrThrow (name: string) {
    const service = this.services.find(service => service.isSupported(name))

    if (!service) {
      throw new AllDIDError(`AllDID do not supported ${name}`, AllDIDErrorCode.DidIsNotSupported)
    }

    return service
  }

  records () {

  }

  record () {

  }

  dwebs () {

  }

  dweb () {

  }

  addrs (name: string, filter?: string) {
    const service = this.getServiceOrThrow(name)

    return service.addrs(name, filter)
  }

  addr (name: string, filter?: string) {
    const service = this.getServiceOrThrow(name)

    return service.addr(name)
  }

  reverse (address: string, currencyTicker: string) {

  }
}
