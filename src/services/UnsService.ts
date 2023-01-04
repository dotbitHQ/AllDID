import UNS, { SourceConfig, NamingServiceName, ResolutionErrorCode } from '@unstoppabledomains/resolution'
import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { AllDIDErrorCode } from '../errors/AllDIDError'

export type UnsServiceOptions = SourceConfig

const domainExtensionToNamingServiceName = {
  crypto: NamingServiceName.UNS,
  zil: NamingServiceName.ZNS,
}

function findNamingServiceName (
  domain: string,
): NamingServiceName {
  const extension = domain.split('.').pop()

  if (extension in domainExtensionToNamingServiceName) {
    return domainExtensionToNamingServiceName[extension]
  }
  else {
    return domainExtensionToNamingServiceName.crypto
  }
};

function makeRecordItem (key: string): RecordItem {
  const keyArray = key.split('.')
  const type = keyArray.length > 1 ? keyArray[0] : ''
  const subtype = keyArray.length > 1 ? keyArray[keyArray.length - 1] : ''
  return {
    key,
    type,
    subtype,
    label: '',
    value: null,
    ttl: 0,
  }
}

function allDIDKeyToUnsKey (key: string): string {
  const keys = key.split('.')
  let unsKey = ''
  switch (keys[0]) {
    case KeyPrefix.Address: unsKey = `crypto.${keys[1].toUpperCase()}.address`; break
    case KeyPrefix.Dweb: unsKey = `dweb.${keys[1].toLowerCase()}.hash`; break
    case KeyPrefix.Profile:
      if (keys[1] == 'picture') unsKey = 'social.picture.value'
      if (keys[1] == 'email' || keys[1] == 'for_sale' || keys[1] == 'url') {
        unsKey = `whois.${keys[1]}.value`
      }
      break
    case KeyPrefix.Text: break
  }
  return unsKey
}

enum KeyPrefix {
  Address= 'address',
  Profile= 'profile',
  Dweb = 'dweb',
  Text = 'text'
}

function unsKeyToAllDIDKey (key: string): string {
  const keys = key.split('.')
  let unsKey = ''
  switch (keys[0]) {
    case 'crypto': unsKey = `${KeyPrefix.Address}.${keys[1].toLowerCase()}`; break

    case 'ipfs':
    case 'dweb': unsKey = `${KeyPrefix.Dweb}.${keys[1].toLowerCase()}_${keys[2]}`; break

    case 'gundb':
    case 'whois':
    case 'social':
    case 'forwarding': unsKey = `${KeyPrefix.Profile}.${keys[1].toLowerCase()}`; break
  }
  return unsKey
}

function getDwebKeys (): string[] {
  return ['ipfs.html.value', 'dweb.ipfs.hash', 'dweb.bzz.hash']
}

export class UnsService extends NamingService {
  serviceName = 'uns'

  uns: UNS
  constructor (options: UnsServiceOptions) {
    super()
    this.uns = new UNS({ sourceConfig: options })
  }

  async isSupported (name: string): Promise<boolean> {
    try {
      const isSupported = await this.uns.isSupportedDomain(name)
      return isSupported
    }
    catch (e) {
      if (
        e.code === ResolutionErrorCode.InvalidDomainAddress ||
        e.code === ResolutionErrorCode.UnsupportedDomain
      ) return false
      throw e
    }
  }

  async isRegistered (name: string): Promise<boolean> {
    try {
      return await this.uns.isRegistered(name)
    }
    catch (e) {
      if (e.code === ResolutionErrorCode.UnregisteredDomain) return false
      throw e
    }
  }

  isAvailable (name: string): Promise<boolean> {
    return this.uns.isAvailable(name)
  }

  async owner (name: string): Promise<string> {
    try {
      return await this.uns.owner(name)
    }
    catch (e) {
      console.log(e.code)
      if (e.code == ResolutionErrorCode.UnregisteredDomain) this.throwUnregistered(name)
      throw e
    }
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
  async record (name: string, key: string): Promise<RecordItem | null> {
    const recordItem = makeRecordItem(key)
    const unsKey = allDIDKeyToUnsKey(key)
    try {
      recordItem.value = await this.uns.record(name, unsKey)
    }
    catch (e) {
      if (e.code == ResolutionErrorCode.RecordNotFound) return null
      if (e.code == ResolutionErrorCode.UnregisteredDomain) this.throwUnregistered(name)
      throw e
    }
    return recordItem
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    let recordObj
    if (keys) {
      recordObj = await this.uns.records(name, keys.map(key => allDIDKeyToUnsKey(key)))
    }
    else {
      recordObj = await this.uns.allNonEmptyRecords(name)
    }
    const recordKeys = Object.keys(recordObj)
    // when the keys are passed in, there may be Null in the query result
    return recordKeys.filter(recordKey => recordObj[recordKey])
      .map(
        recordKey => {
          const recordItem = makeRecordItem(unsKeyToAllDIDKey(recordKey))
          recordItem.value = recordObj[recordKey]
          return recordItem
        }
      )
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    if (!keys) {
      const records = await this.uns.allNonEmptyRecords(name)
      const recordKeys = Object.keys(records)
        .filter(key => key.split('.')[0] === 'crypto')
      return recordKeys.map(key => {
        const allDIDKey = unsKeyToAllDIDKey(key)
        const record = makeRecordItem(allDIDKey)
        record.value = records[key]
        return {
          ...record,
          symbol: record.subtype.toUpperCase()
        }
      })
    }
    else if (Array.isArray(keys)) {
      const records = await this.records(name, keys.map(key => `${KeyPrefix.Address}.${key.toLowerCase()}`))
      return records.map(record => ({
        ...record,
        symbol: record.subtype.toUpperCase()
      }))
    }
    else {
      const record = await this.addr(name, keys)
      if (!record) return null
      return [{
        ...record,
        symbol: record.subtype.toUpperCase()
      }]
    }
  }

  async addr (name: string, key: string): Promise<RecordItemAddr | null> {
    const recordItem = makeRecordItem(`${KeyPrefix.Address}.${key.toLowerCase()}`)
    try {
      recordItem.value = await this.uns.addr(name, key)
    }
    catch (e) {
      if (e.code == ResolutionErrorCode.RecordNotFound) return null
      if (e.code == ResolutionErrorCode.UnregisteredDomain) this.throwUnregistered(name)
      throw e
    }
    return {
      ...recordItem,
      symbol: recordItem.subtype.toUpperCase()
    }
  }

  async dweb (name: string): Promise<string> {
    try {
      return await this.uns.ipfsHash(name)
    }
    catch (e) {
      if (e.code == ResolutionErrorCode.UnregisteredDomain) this.throwUnregistered(name)
      throw e
    }
  }

  async dwebs (name: string): Promise<string[]> {
    let records: Record<string, string>
    try {
      records = await this.uns.records(name, getDwebKeys())
    }
    catch (e) {
      if (e.code == ResolutionErrorCode.RecordNotFound) return []
      if (e.code == ResolutionErrorCode.UnregisteredDomain) this.throwUnregistered(name)
      throw e
    }
    return Object.values(records).filter(v => v)
  }

  reverse (address: string): Promise<string | null> {
    return this.uns.reverse(address)
  }

  registryAddress (name: string): Promise<string> {
    return this.uns.registryAddress(name)
  }
}
