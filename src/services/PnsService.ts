import { ethers } from 'ethers'
import { SDK as PNSSDK } from 'pns-sdk'
import { Chains } from 'pns-sdk/lib/constants'

import { setInterceptor } from '../errors/ErrorInterceptor'
import { AllDIDErrorCode, UnsupportedMethodError } from '../errors/AllDIDError'
import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { makeRecordItem } from './UnsService'

import type { Signer } from 'ethers'

export type PnsNetworkType = 1284 | 1287
export interface PnsServiceOptions {
  pnsAddress: string,
  controllerAddress: string,
  signer: Signer,
}

export const defaultPnsNetworkId: PnsNetworkType = 1287

enum PnsKeyPrefix {
  Address = 'address',
}

export const PnsProvider = new ethers.providers.JsonRpcProvider(
  Chains[defaultPnsNetworkId].rpc[0]
)

function getAddressKeys (): string[] {
  return ['ETH', 'BTC']
}

export class PnsService extends NamingService {
  serviceName = 'pns'

  pns: PNSSDK
  constructor (options: PnsServiceOptions) {
    super()
    this.pns = new PNSSDK(
      options.pnsAddress,
      options.controllerAddress,
      options.signer
    )

    setInterceptor(PnsService, Error, this.errorHandler)
  }

  protected errorHandler (error: any) {
    switch (error.code) {
      case AllDIDErrorCode.UnsupportedMethod:
        throw new UnsupportedMethodError(this.serviceName)
    }
    throw error
  }

  isSupported (name: string): boolean {
    return /^.+\.dot$/.test(name)
  }

  async isRegistered (name: string): Promise<boolean> {
    return await this.pns.exists(name)
  }

  // TODO: confirm available logic
  async isAvailable (name: string): Promise<boolean> {
    return await this.pns.available(name)
  }

  async owner (name: string): Promise<string> {
    return await this.pns.ownerOfName(name)
  }

  // TODO: just mock the coding style like uns service to solve errors situation
  // TODO: it's not a good coding style that throw a error after return a value
  // TODO: it's better to update NamingService function's type？
  async manager (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return ''
  }

  async tokenId (name: string): Promise<string> {
    return this.pns.namehash(name)
  }

  async record (name: string, key: string): Promise<RecordItem | null> {
    const recordItem = makeRecordItem(
      `${PnsKeyPrefix.Address}.${key.toLowerCase()}`
    )
    recordItem.value = await this.pns.getKey(name, key.toUpperCase())
    return recordItem
  }

  async records (name: string, keys: string[]): Promise<RecordItem[]> {
    const records = await this.pns.getKeys(
      name,
      keys.map((item) => item.toUpperCase())
    )
    const recordsFormat = records.map((record, index) => {
      const recordItem = makeRecordItem(
        `${PnsKeyPrefix.Address}.${keys[index].toLowerCase()}`
      )
      recordItem.value = record
      return recordItem
    })
    return recordsFormat
  }

  async addrs (name: string, keys?: string[]): Promise<RecordItemAddr[]> {
    if (!keys) {
      keys = getAddressKeys()
    }

    const records = await this.records(name, keys)
    const addrs: RecordItemAddr[] = records.map((item, index) => {
      return {
        ...item,
        symbol: (keys as string[])[index].toUpperCase(),
      }
    })
    return addrs
  }

  async addr (name: string, key: string): Promise<RecordItemAddr | null> {
    const record = await this.record(name, key)
    return record
      ? {
        ...record,
        symbol: key.toUpperCase(),
      }
      : null
  }

  async dweb (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return await Promise.resolve('')
  }

  async dwebs (name: string): Promise<string[]> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return await Promise.resolve([''])
  }

  reverse (address: string): Promise<string | null> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return Promise.resolve(null)
  }

  async registryAddress (name: string): Promise<string> {
    // const loginAddress = PnsProvider.getSigner().getAddress();
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return ''
  }
}
