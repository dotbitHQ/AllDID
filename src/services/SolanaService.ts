import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { Connection, Commitment, ConnectionConfig, PublicKey } from '@solana/web3.js'
import { 
  getDomainKey, 
  NameRegistryState, 
  Record, 
  getIpfsRecord, 
  performReverseLookup,
  getAllDomains,
  resolve
} from "@bonfida/spl-name-service";
import { AllDIDErrorCode } from '../errors/AllDIDError';

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
    // 'BSC' // @bonfida/spl-name-service v0.1.51 does not support BSC
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

  protected async isValidPubkey(pubkey: PublicKey): Promise<boolean> {
    const nameAccount = await this.provider.getAccountInfo(pubkey)
    return nameAccount ? true : false
  }

  protected getSolAddress (data: Buffer ): string {
    return new PublicKey(data.slice(0, 32)).toString()
  }

  async isRegistered (name: string): Promise<boolean> {
    const { pubkey } = await getDomainKey(name);
    return this.isValidPubkey(pubkey)
  }

  async isAvailable (name: string): Promise<boolean> {
    return !(await this.isRegistered(name))
  }

  async owner (name: string): Promise<string> {
    if (!(await this.isRegistered(name))) {
      this.throwError(`${this.serviceName}: Unregistered domain name ${name}`, AllDIDErrorCode.UnregisteredName)
    }
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

  protected makeRecordItem (key: string): RecordItem {
    const keyArray = key.split('.')
    const type = keyArray.length > 1 ? keyArray[0] : ''
    const subtype = keyArray[keyArray.length - 1]
    return {
      key,
      type,
      subtype,
      label: '',
      value: null,
      ttl: 0,
    }
  }

  protected makeRecordKey (subtype: string): string {
    let textKey = subtype.slice(0, 1).toUpperCase() + subtype.slice(1).toLowerCase()
    let addressKey = subtype.toUpperCase()
    const key = Record[textKey] ? Record[textKey] : (Record[addressKey] ? Record[addressKey] : null)
    if (!key) {
      return null
    }
    return key
  }

  protected async getRecord (name: string, key: string): Promise<string | null> {
    const { pubkey } = await getDomainKey(key + "." + name, true)
    const isValidPubkey = await this.isValidPubkey(pubkey)
    if (!isValidPubkey) return null

    let { registry } = await NameRegistryState.retrieve(this.provider, pubkey)
  
    const idx = registry.data?.indexOf(0x00);
    const data = registry.data?.slice(0, idx);

    return key === 'SOL' ? this.getSolAddress(data) : data.toString()
  }

  async record (name: string, key: string): Promise<RecordItem | null> {
    const recordItem = this.makeRecordItem(key)
    const recordKey = this.makeRecordKey(recordItem.subtype)
    recordItem.value = await this.getRecord(name, recordKey)
    if (!recordItem.value) return null
    return recordItem
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    const requestArray: Array<Promise<RecordItem>> = []
    if (!keys) {
      const addressKeys = getAddressKeys().map((key) => `${KeyPrefix.Address}.${key.toLowerCase()}`)
      const profileKeys = getProfileKeys().map((key) => `${KeyPrefix.Profile}.${key.toLowerCase()}`)
      const dwebKeys = getDwebKeys().map((key) => `${KeyPrefix.Dweb}.${key.toLowerCase()}`)
      const textKeys = getTextKeys().map((key) => `${KeyPrefix.Text}.${key.toLowerCase()}`)
      keys = addressKeys.concat(profileKeys).concat(dwebKeys).concat(textKeys)
    }
    keys.forEach((key) => requestArray.push(this.record(name, key)))
    return (await Promise.all<RecordItem>(requestArray)).filter(v => v)
  } 

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    let records = []
    if (!keys) keys = getAddressKeys().map((key) => `${KeyPrefix.Address}.${key.toLowerCase()}`)
    if (Array.isArray(keys)) {
      const recordsList = await this.records(name, keys)
      records = records.concat(recordsList.map(record => ({
        ...record,
        symbol: record.subtype
      })))
    }
    else {
      const record = await this.record(name, keys)
      if (!record) return records
      records.push(
        {
          ...record,
          symbol: record.subtype
        }
      )
    }
    return records
  }

  async addr (name: string): Promise<RecordItemAddr | null> {
    const recordItem = this.makeRecordItem(`${KeyPrefix.Address}.sol`)
    if (!(await this.isRegistered(name))) {
      this.throwError(this.serviceName + ": Unregistered domain name", AllDIDErrorCode.UnregisteredName)
    }
    const address = await resolve(this.provider, name);
    recordItem.value = address.toString()
    if (!recordItem.value) return null
    return {
      ...recordItem,
      symbol: recordItem.subtype
    }
  }

  async dweb (name: string): Promise<string> {
    let dweb = null
    if (await this.isRegistered(name)) {
      const { data } = await getIpfsRecord(this.provider, name)
      dweb = data.toString()
    }
    return dweb
  }

  async dwebs (name: string): Promise<string[]> {
    const records = await this.records(name, getDwebKeys())
    return records.map(record => record.value)
  }

  // Solana address only
  async reverse (address: string): Promise<string | null> {
    let reverse = null
    const addressKey = new PublicKey(address)
    const isValid = await this.isValidPubkey(addressKey)
    if (isValid) {
      const domains = await getAllDomains(this.provider, addressKey);
      reverse = domains.length > 0 ? (await performReverseLookup(this.provider, domains[0])) + '.sol' : null
    }
    return reverse
  }
  
  // https://bonfida.github.io/solana-name-service-guide/domain-name/domain-tld.html
  async registryAddress (name: string): Promise<string> {
    return '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
  }
}
