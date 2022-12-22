import UNS, { SourceConfig, NamingServiceName } from '@unstoppabledomains/resolution'
import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { AllDIDError, AllDIDErrorCode } from '../errors/AllDIDError'

export type UnsServiceOptions = SourceConfig

const domainExtensionToNamingServiceName = {
  crypto: NamingServiceName.UNS,
  zil: NamingServiceName.ZNS,
};

function findNamingServiceName (
  domain: string,
): NamingServiceName {
  const extension = domain.split('.').pop();

  if (extension in domainExtensionToNamingServiceName) {
    return domainExtensionToNamingServiceName[extension];
  } else {
    return domainExtensionToNamingServiceName.crypto;
  }
};

function makeRecordItem (key: string, value: string): RecordItem {
  const keyArray = key.split('.')
  const type = keyArray.length > 1 ? keyArray.shift() : ''
  const subtype = keyArray.join(".")
  return {
    key,
    type,
    subtype,
    label: '',
    value,
    ttl: 0,
  }
}

function makeRecordItemAddr (value: RecordItem): RecordItemAddr {
  return {
    ...value,
    symbol: value.subtype.split('.')[1]
  }
}

function trimKeyPrefix (key: string): string {
  const recordLabels = key.split('.')
  recordLabels.shift()
  return recordLabels.join('.')
}

function getDwebKeys (): string[] {
  return ['text.ipfs.html.value', 'text.dweb.ipfs.hash']
}


export class UnsService extends NamingService {
  serviceName = 'uns'

  uns: UNS
  constructor (options: UnsServiceOptions) {
    super()
    this.uns = new UNS({ sourceConfig: options })
  }

  protected throwError (message: string, code: AllDIDErrorCode) {
    throw new AllDIDError(`${message}`, code)
  }

  isSupported (name: string): boolean {
    const tokens = name.split('.')
    return (
      !!tokens.length &&
      !(
        name === 'eth' ||
        /^[^-]*[^-]*\.(eth|luxe|xyz|kred|addr\.reverse)$/.test(name)
      ) &&
      tokens.every((v) => !!v.length)
    )
  }

  isRegistered (name: string): Promise<boolean> {
    return this.uns.isRegistered(name)
  }

  isAvailable (name: string): Promise<boolean> {
    return this.uns.isAvailable(name)
  }

  owner (name: string): Promise<string> {
    return this.uns.owner(name)
  }

  async manager (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return null
  }

  async tokenId (name: string): Promise<string> {
    const service = findNamingServiceName(name)
    return this.uns.namehash(name, service)
  }

  // key: 'address.${Uns key}'
  async record (name: string, key: string): Promise<RecordItem> {
    const value = await this.uns.record(name, trimKeyPrefix(key))
    return makeRecordItem(key, value)
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    let recordObj
    if (keys) {
      recordObj = await this.uns.records(name, keys.map(key => trimKeyPrefix(key)))
    }
    else {
      recordObj = await this.uns.allNonEmptyRecords(name)
    }
    const recordKeys = Object.keys(recordObj)
    return recordKeys.map(
      recordKey => makeRecordItem(keys.find(key => key.includes(recordKey)), recordObj[recordKey])
    )
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    if (!keys) {
      const records = await this.uns.allNonEmptyRecords(name)
      const recordKeys = Object.keys(records).filter(key => key.split('.')[0] === 'crypto')
      return recordKeys.map(key => {
        const record = makeRecordItem(key, records[key])
        return makeRecordItemAddr(record)
      })
    }
    else if (Array.isArray(keys)) {
      const records = await this.records(name, keys.map(key => `address.crypto.${key.toUpperCase()}.address`))
      return records.map(record => makeRecordItemAddr(record))
    }
    else {
      const record = await this.addr(name, keys)
      return [makeRecordItemAddr(record)]
    }
  }

  async addr (name: string, key: string): Promise<RecordItemAddr> {
    const recordKey = `address.crypto.${key.toUpperCase()}.address`
    const value = await this.record(name, recordKey)
    return {
      ...value,
      symbol: key
    }
  }

  async dweb (name: string): Promise<string> {
    const record = await this.record(name, 'text.ipfs.html.value')
    return record.value
  }

  async dwebs (name: string): Promise<string[]> {
    const records = await this.records(name, getDwebKeys())
    return records.map(v => v.value).filter(v => v)
  }

  reverse (address: string): Promise<string | null> {
    return this.uns.reverse(address)
  }

  registryAddress (name: string): Promise<string> {
    return this.uns.registryAddress(name)
  }
}
