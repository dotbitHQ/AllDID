import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { Connection, Commitment, ConnectionConfig, PublicKey } from '@solana/web3.js'
import { getDomainKey, NameRegistryState, Record, getRecord, getIpfsRecord, performReverseLookup } from "@bonfida/spl-name-service";
import { AllDIDErrorCode } from 'src/errors/AllDIDError';

export function createProvider(
  endpoint: string,
  commitmentOrConfig?: Commitment | ConnectionConfig
): Connection {
  return new Connection(endpoint, commitmentOrConfig)
}

export type SolanaServiceOptions = {
  provider: Connection,
  network: string
}

function getDwebKeys () {
  return [
    "IPFS",
    "ARWV",
    "SHDW",
    "Url"
  ]
}

function getTextKeys () {
  return [
    'POINT',
    'Injective',
    'Pic'
  ]
}

function getProfileKeys () {
  return [
    "Email",
    "Discord",
    "Github",
    "Reddit",
    "Twitter",
    "Telegram",
  ]
}

function getAddressKeys () {
  return [
    'ETH',
    'BTC',
    'SOL',
    'LTC',
    'DOGE',
    'BSC'
  ]
}

enum KeyPrefix {
  Address= 'address',
  Profile= 'profile',
  Dweb = 'dweb',
  Text = 'text'
} 


export class SolanaService extends NamingService {
  serviceName = 'solana'
  
  provider: Connection
  constructor (options: SolanaServiceOptions) {
    super()
    this.provider = options.provider
  }

  isSupported (name: string): boolean {
    return /^.+\.sol$/.test(name)
  }

  async isRegistered (name: string): Promise<boolean> {
    const owner = await this.owner(name)
    return owner ? true : false
  }

  async isAvailable (name: string): Promise<boolean> {
    return !(await this.isRegistered(name))
  }

  async owner (name: string): Promise<string> {
    const { pubkey } = await getDomainKey(name);
    const { registry, nftOwner } = await NameRegistryState.retrieve(
      this.provider,
      pubkey
    );
    return nftOwner ? nftOwner.toString() : registry.owner.toString()
  }

  manager (name: string): Promise<string> {
    return this.owner(name)
  }

  tokenId (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return null
  }

  async getRecord (name: string, subtype: string): Promise<string> {
    let textKey = subtype.slice(0, 1).toUpperCase() + subtype.slice(1).toLowerCase()
    let addressKey = subtype.toUpperCase()
    const key = Record[textKey] ? Record[textKey] : (Record[addressKey] ? Record[addressKey] : null)
    if (!key) {
      this.throwError('Record Not Found', AllDIDErrorCode.RecordNotFound)
      return
    }
    const { data } = await getRecord(this.provider, name, key);
    return data.toString()
  }

  async record (name: string, key: string): Promise<RecordItem> {
    const keyArray = key.split('.')
    const type = keyArray.length > 1 ? keyArray[0] : ''
    const subtype = keyArray[keyArray.length - 1]
    const value = await this.getRecord(name, subtype)
    return {
      key,
      type,
      subtype,
      label: '',
      value,
      ttl: 0,
    }
  }

  records (name: string, keys?: string[]): Promise<RecordItem[]> {
    const requestArray: Array<Promise<RecordItem>> = []
    if (!keys) {
      const addressKeys = getAddressKeys().map((key) => `${KeyPrefix.Address}.${key}`)
      const profileKeys = getProfileKeys().map( key => `${KeyPrefix.Profile}.${key}`)
      const dwebKeys = getDwebKeys().map( key => `${KeyPrefix.Dweb}.${key}`)
      const textKeys = getTextKeys().map( key => `${KeyPrefix.Text}.${key}` )
      keys = addressKeys.concat(profileKeys).concat(dwebKeys).concat(textKeys)
    }
    keys.forEach((key) => requestArray.push(this.record(name, key)))
    return Promise.all<RecordItem>(requestArray)
  } 

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    let records = []
    if (!keys) keys = getAddressKeys().map((key) => `${KeyPrefix.Address}.${key}`)
    else if (Array.isArray(keys)) {
      const records = await this.records(name, keys)
      records.concat(records.map(record => ({
        ...record,
        symbol: record.subtype
      })))
    }
    else {
      const record = await this.record(name, keys)
      records.push(
        {
          ...record,
          symbol: record.subtype
        }
      )
    }
    return records
  }

  async addr (name: string): Promise<RecordItemAddr> {
    const addrs = this.addrs(name, `${KeyPrefix.Address}.SOL`)
    return addrs[0]
  }

  async dweb (name: string): Promise<string> {
    const { data } = await getIpfsRecord(this.provider, name)
    return data.toString()
  }

  async dwebs (name: string): Promise<string[]> {
    const records = await this.records(name, getDwebKeys())
    return records.map(record => record.value)
  }

  // Solana address only
  reverse (address: string): Promise<string | null> {
    const domainKey = new PublicKey(address)
    return performReverseLookup(this.provider, domainKey)
  }
  
  // https://bonfida.github.io/solana-name-service-guide/domain-name/domain-tld.html
  async registryAddress (name: string): Promise<string> {
    return '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
  }
}
