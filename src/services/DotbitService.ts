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
  BitIndexerErrorCode,
  DotbitError,
} from 'dotbit'
import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { AllDIDErrorCode, UnregisteredNameError, UnsupportedNameError } from '../errors/AllDIDError'
import { setInterceptor } from '../errors/ErrorInterceptor'
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
    setInterceptor(DotbitService, DotbitError, this.errorHandler)
  }

  protected errorHandler (error: any) {
    switch (error.code) {
      case BitIndexerErrorCode.AccountNotExist: throw new UnregisteredNameError(this.serviceName)
      case BitIndexerErrorCode.AccountFormatInvalid: throw new UnsupportedNameError(this.serviceName)
    }
    throw error
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

  // AccountID
  async tokenId (name: string): Promise<string> {
    return accountIdHex(name)
  }

  async record (name: string, key: string): Promise<RecordItem | null> {
    const records = await this.dotbit.records(name, key)
    if (records.length > 0) {
      return bitARE2RecordItem(records[0])
    }
    else {
      return null
    }
  }

  async records (name: string, keys: string | string[] = []): Promise<RecordItem[]> {
    let records = await this.dotbit.records(name)
    if (Array.isArray(keys)) {
      records = records.filter(record => keys.find(key => record.key === key))
    }
    else {
      records = records.filter(record => record.key === keys)
    }
    return records.map(record => bitARE2RecordItem(record))
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    let addrs: RecordItemAddr[] = []
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
      const bitAddr = await this.dotbit.addrs(name, keys?.toUpperCase())
      addrs = bitAddr.map(v => {
        return {
          ...bitARE2RecordItem(v),
          symbol: v.subtype.toUpperCase()
        }
      })
    }
    return addrs
  }

  async addr (name: string, key: string): Promise<RecordItemAddr | null> {
    const addrs = await this.dotbit.addrs(name, key)
    if (addrs.length > 0) {
      return {
        ...bitARE2RecordItem(addrs[0]),
        symbol: addrs[0].subtype.toUpperCase()
      }
    }
    return null
  }

  async dweb (name: string): Promise<any> {
    const dweb = await this.dotbit.dweb(name)
    if (!dweb) {
      return null
    }
    return dweb.value
  }

  async dwebs (name: string, protocol?: string): Promise<string[]> {
    const dwebs = await this.dotbit.dwebs(name, protocol)
    if (!dwebs || dwebs.length <= 0) {
      return []
    }
    return dwebs.map(dweb => (`${dweb.value}`))
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

  async registryAddress (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return ''
  }
}
