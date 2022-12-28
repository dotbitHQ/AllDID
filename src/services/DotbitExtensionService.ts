import { DotbitService, DotbitServiceOptions } from './DotbitService'
import { RecordItem, RecordItemAddr } from './NamingService'

export class DotbitExtensionService extends DotbitService {
  constructor (options: DotbitServiceOptions) {
    super(options)
  }

  protected nameTransfer (name: string) {
    return name + "bit"
  }

  isSupported (name: string): boolean {
    return super.isSupported(this.nameTransfer(name))
  }

  isRegistered (name: string): Promise<boolean> {
    return super.isRegistered(this.nameTransfer(name))
  }

  isAvailable (name: string): Promise<boolean> {
    return super.isAvailable(this.nameTransfer(name))
  }

  owner (name: string): Promise<string> {
    return super.owner(this.nameTransfer(name))
  }

  manager (name: string): Promise<string> {
    return super.manager(this.nameTransfer(name))
  }

  tokenId (name: string): Promise<string> {
    return super.tokenId(this.nameTransfer(name))
  }

  record (name: string, key: string): Promise<RecordItem | null> {
    return super.record(this.nameTransfer(name), key)
  }

  records (name: string, keys?: string[]): Promise<RecordItem[]> {
    return super.records(this.nameTransfer(name), keys)
  }

  addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    return super.addrs(this.nameTransfer(name), keys)
  }

  addr (name: string): Promise<RecordItemAddr | null> {
    return super.addr(this.nameTransfer(name))
  }

  dweb (name: string): Promise<string | null> {
    return super.dweb(this.nameTransfer(name))
  }

  dwebs (name: string): Promise<string | null> {
    return super.dwebs(this.nameTransfer(name))
  }

  async reverse (address: string, currencyTicker: string): Promise<string | null> {
    const reverseValue = await super.reverse(address, currencyTicker)
    if (!reverseValue) return null
    const labels = reverseValue.split('.')
    labels.pop()
    return labels.join(".")
  }

  registryAddress (name: string): Promise<string> {
    return super.registryAddress(this.nameTransfer(name))
  }
}
