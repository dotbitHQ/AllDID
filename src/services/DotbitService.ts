import {
  createInstance,
  DotBit,
  isSupportedAccount,
  BitNetwork,
  RemoteTxBuilderConfig,
  BitSigner,
  DefaultConfig,
  accountIdHex,
  CoinType,
  BitIndexerErrorCode
} from 'dotbit'
import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { AllDIDErrorCode } from '../errors/AllDIDError'

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

function makeRecordItem (key: string): RecordItem {
  const keyArray = key.split('.')
  const type = keyArray.length > 1 ? keyArray[0] : ''
  const subtype = keyArray[keyArray.length - 1]
  return {
    key,
    type,
    subtype,
    label: '',
    value: '',
    ttl: 0,
  }
}

enum KeyPrefix {
  Address= 'address',
  Profile= 'profile',
  Dweb = 'dweb',
  Text = 'text'
}

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

  async owner (name: string): Promise<string> {
    try {
      return await this.dotbit.accountInfo(name).then(info => info.owner_key)
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async manager (name: string): Promise<string> {
    try {
      return await this.dotbit.accountInfo(name).then(info => info.manager_key)
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  // AccountID
  async tokenId (name: string): Promise<string> {
    return accountIdHex(name)
  }

  async record (name: string, key: string): Promise<RecordItem | null> {
    try {
      const records = await this.dotbit.records(name, key)
      if (records.length > 0) {
        return bitARE2RecordItem(records[0])
      }
      else {
        return null
      }
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    try {
      let records = await this.dotbit.records(name)
      records = keys ? records.filter(record => keys.find(key => record.key === key)) : records
      return records.map(record => bitARE2RecordItem(record))
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    try {
      let addrs = []
      if (Array.isArray(keys)) {
        const dotbitAddrs = await this.dotbit.addrs(name)
        addrs = dotbitAddrs.filter(
          record => keys.find(key => key.toUpperCase() === record.subtype.toUpperCase())
        ).map(v => ({
          ...bitARE2RecordItem(v),
          symbol: v.subtype.toUpperCase()
        }))
      }
      else {
        addrs = await this.dotbit.addrs(name, keys.toUpperCase())
      }
      return addrs
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async addr (name: string, key: string): Promise<RecordItemAddr | null> {
    try {
      const addrs = await this.dotbit.addrs(name, key)
      if (addrs.length > 0) {
        return {
          ...bitARE2RecordItem(addrs[0]),
          symbol: addrs[0].subtype.toUpperCase()
        }
      }
      return null
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async dweb (name: string): Promise<any> {
    try {
      const dweb = await this.dotbit.dweb(name)
      if (!dweb) {
        return null
      }
      return dweb.value
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async dwebs (name: string, protocol?: string): Promise<string[]> {
    try {
      const dwebs = await this.dotbit.dwebs(name, protocol)
      if (!dwebs || dwebs.length <= 0) {
        return []
      }
      return dwebs.map(dweb => (`${dweb.value}`))
    }
    catch (e) {
      if (e.code == BitIndexerErrorCode.AccountNotExist) this.throwUnregistered(name)
      throw e
    }
  }

  async reverse (address: string, currencyTicker: string): Promise<string | null> {
    const coinType = CoinType[currencyTicker.toUpperCase()]
    if (!coinType) return null
    const keyInfo = {
      coinType,
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
