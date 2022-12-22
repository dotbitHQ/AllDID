import {
  createInstance,
  DotBit,
  isSupportedAccount,
  BitNetwork,
  RemoteTxBuilderConfig,
  BitSigner,
  DefaultConfig,
  accountIdHex,
} from 'dotbit'
import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { formatsByName } from '@ensdomains/address-encoder'
import { AllDIDError, AllDIDErrorCode } from '../errors/AllDIDError'

// todo: export config interface from dotbit.js
export interface DotbitServiceOptions {
  network?: BitNetwork,
  bitIndexerUri?: string,
  remoteTxBuilderConfig?: RemoteTxBuilderConfig,
  signer?: BitSigner,
}

export const defaultDotbitServiceOptions: DotbitServiceOptions =
  DefaultConfig[BitNetwork.mainnet]

function bitARE2RecordItem (
  bitAccountRE: Record<string, any>
): RecordItem {
  return {
    key: bitAccountRE.key,
    type: bitAccountRE.type,
    subtype: bitAccountRE.subtype,
    label: bitAccountRE.label,
    value: bitAccountRE.value,
    ttl: parseInt(bitAccountRE.ttl),
  }
}

export class DotbitService extends NamingService {
  serviceName = 'dotbit'

  dotbit: DotBit
  constructor (options: DotbitServiceOptions) {
    super()
    this.dotbit = createInstance(options)
  }

  throwError(message: string, code: AllDIDErrorCode) {
    throw new AllDIDError(`${message}`, code)
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

  async tokenId (name: string): Promise<string> {
    return accountIdHex(name)
  }

  async record (name: string, key: string): Promise<RecordItem> {
    const records = await this.dotbit.records(name, key)
    return bitARE2RecordItem(records[0])
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    let records = await this.dotbit.records(name)
    records = keys ? records.filter(record => keys.find(key => record.key === key)) : records
    console.log(records)
    return records.map(record => bitARE2RecordItem(record))
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    let addrs
    if (Array.isArray(keys)) {
      addrs = Promise.all(keys.map(async (key) => await this.dotbit.addrs(name, `address.${key}`)))
    }
    else {
      addrs = await this.dotbit.addrs(name, keys)
    }
    return addrs
  }

  async addr (name: string, key: string): Promise<RecordItemAddr> {
    const addrs = await this.dotbit.addrs(name, key)
    if (addrs.length > 0) {
      return {
        ...bitARE2RecordItem(addrs[0]),
        symbol: addrs[0].subtype.toUpperCase()
      }
    }
    this.throwError(`${name}'s address is not found`, AllDIDErrorCode.RecordIsNotFound)
  }

  async dweb (name: string): Promise<any> {
    const dweb = await this.dotbit.dweb(name)
    if (!dweb) {
      this.throwError(`${name}'s dweb is not found`, AllDIDErrorCode.RecordIsNotFound)
    }
    return dweb.value
  }

  async dwebs (name: string, protocol?: string): Promise<string[]> {
    const dwebs = await this.dotbit.dwebs(name, protocol)
    if (!dwebs || dwebs.length <= 0) {
      this.throwError(`${name}'s dweb is not found`, AllDIDErrorCode.RecordIsNotFound)
    }
    return dwebs.map(dweb => (`${dweb.value}`))
  }

  async reverse (address: string, currencyTicker: string): Promise<string | null> {
    const format = formatsByName[currencyTicker]
    console.log(currencyTicker, format)
    const keyInfo = {
      coinType: format.coinType,
      key: address,
    }
    const bitAccount = await this.dotbit.reverse(keyInfo)
    return bitAccount?.account
  }

  registryAddress (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return null
  }
}
