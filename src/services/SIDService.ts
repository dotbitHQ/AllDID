import { EnsService } from './EnsService'
import { RecordItemAddr } from './NamingService'

enum KeyPrefix {
  Address= 'address',
  Profile= 'profile',
  Dweb = 'dweb',
  Text = 'text'
}

export class SIDService extends EnsService {
  serviceName = 'sid'

  isSupported (name: string): boolean {
    return /^.+\.bnb$/.test(name)
  }

  protected getAddressKeys (): string[] {
    const addressKeys = super.getAddressKeys()
    return addressKeys.concat('BNB')
  }

  async addr (name: string, key: string): Promise<RecordItemAddr | null> {
    let bnbKey = key
    if (bnbKey.toUpperCase() === 'BNB') {
      bnbKey = 'ETH'
    }
    const recordItemAddr = await super.addr(name, bnbKey)
    if (recordItemAddr) {
      recordItemAddr.key = `${KeyPrefix.Address}.${key.toLowerCase()}`
      recordItemAddr.subtype = key.toLowerCase()
      recordItemAddr.symbol = key.toUpperCase()
    }
    return recordItemAddr
  }
}
