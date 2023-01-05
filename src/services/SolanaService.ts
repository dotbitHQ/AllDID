import { NamingService, RecordItem, RecordItemAddr } from './NamingService'
import { Connection, Commitment, ConnectionConfig, PublicKey } from '@solana/web3.js'
import {
  getDomainKey,
  NameRegistryState,
  Record,
  getIpfsRecord,
  performReverseLookup,
  getAllDomains,
  resolve,
  NAME_TOKENIZER_ID,
  MINT_PREFIX
} from '@bonfida/spl-name-service'
import { AllDIDErrorCode } from '../errors/AllDIDError'

export function createProvider (
  endpoint: string,
  commitmentOrConfig?: Commitment | ConnectionConfig
): Connection {
  return new Connection(endpoint, commitmentOrConfig)
}

export interface SolanaServiceOptions {
  provider: Connection,
  network: string,
}

function getDwebKeys () {
  return [
    'IPFS',
    'ARWV',
    'SHDW',
    'Url'
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
    'Email',
    'Discord',
    'Github',
    'Reddit',
    'Twitter',
    'Telegram',
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

  protected async isValidPubkey (pubkey: PublicKey): Promise<boolean> {
    const nameAccount = await this.provider.getAccountInfo(pubkey)
    return !!nameAccount
  }

  protected getSolAddress (data: Buffer): string {
    return new PublicKey(data.slice(0, 32)).toString()
  }

  async isRegistered (name: string): Promise<boolean> {
    const { pubkey } = await getDomainKey(name)
    return await this.isValidPubkey(pubkey)
  }

  async isAvailable (name: string): Promise<boolean> {
    return !(await this.isRegistered(name))
  }

  async owner (name: string): Promise<string> {
    await this.checkRegistered(name)
    const { pubkey } = await getDomainKey(name)
    const { registry, nftOwner } = await NameRegistryState.retrieve(
      this.provider,
      pubkey
    )
    return nftOwner ? nftOwner.toString() : registry.owner.toString()
  }

  async manager (name: string): Promise<string> {
    this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod)
    return ''
  }

  // return MintAccount Address
  async tokenId (name: string): Promise<string> {
    const { pubkey } = await getDomainKey(name)
    const [mint] = await PublicKey.findProgramAddress(
      [MINT_PREFIX, pubkey.toBuffer()],
      NAME_TOKENIZER_ID
    )
    return mint.toBase58()
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
      value: '',
      ttl: 0,
    }
  }

  protected makeRecordKey (subtype: string): string {
    const textKey = subtype.slice(0, 1).toUpperCase() + subtype.slice(1).toLowerCase()
    const addressKey = subtype.toUpperCase()
    const key = Record[textKey] ? Record[textKey] : (Record[addressKey] ? Record[addressKey] : null)
    if (!key) {
      return ''
    }
    return key
  }

  protected async getRecord (name: string, key: string): Promise<string | null> {
    await this.checkRegistered(name)
    const { pubkey } = await getDomainKey(key + '.' + name, true)
    const isValidPubkey = await this.isValidPubkey(pubkey)
    if (!isValidPubkey) return null

    const { registry } = await NameRegistryState.retrieve(this.provider, pubkey)

    const idx = registry.data?.indexOf(0x00)
    const data: Buffer | undefined = registry.data?.slice(0, idx)

    return key === 'SOL' && data ? this.getSolAddress(data) : (data?.toString() ?? null)
  }

  async record (name: string, key: string): Promise<RecordItem | null> {
    const recordItem = this.makeRecordItem(key)
    const recordKey = this.makeRecordKey(recordItem.subtype)
    const value = await this.getRecord(name, recordKey)
    if (!value) return null
    recordItem.value = value
    return recordItem
  }

  async records (name: string, keys?: string[]): Promise<RecordItem[]> {
    let records: RecordItem[] = []
    const requestArray: Array<Promise<RecordItem | null>> = []
    if (!keys) {
      const addressKeys = getAddressKeys().map((key) => `${KeyPrefix.Address}.${key.toLowerCase()}`)
      const profileKeys = getProfileKeys().map((key) => `${KeyPrefix.Profile}.${key.toLowerCase()}`)
      const dwebKeys = getDwebKeys().map((key) => `${KeyPrefix.Dweb}.${key.toLowerCase()}`)
      const textKeys = getTextKeys().map((key) => `${KeyPrefix.Text}.${key.toLowerCase()}`)
      keys = addressKeys.concat(profileKeys).concat(dwebKeys).concat(textKeys)
    }
    keys.forEach((key) => requestArray.push(this.record(name, key)))
    const result = await Promise.all<RecordItem | null>(requestArray)
    result.forEach(v => { if (v !== null) records.push(v) })
    return records
  }

  async addrs (name: string, keys?: string | string[]): Promise<RecordItemAddr[]> {
    let records: RecordItemAddr[] = []
    if (!keys) {
      keys = getAddressKeys()
    }
    if (Array.isArray(keys)) {
      keys = keys.map((key) => `${KeyPrefix.Address}.${key.toLowerCase()}`)
      const recordsList = await this.records(name, keys)
      records = recordsList.map(record => ({
        ...record,
        symbol: record.subtype.toUpperCase()
      }))
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

  async addr (name: string, key: string): Promise<RecordItemAddr | null> {
    await this.checkRegistered(name)
    // solana queries addresses by querying records
    const recordItem = await this.record(name, `${KeyPrefix.Address}.${key}`)
    if (!recordItem) return null
    return {
      ...recordItem,
      symbol: recordItem.subtype.toUpperCase()
    }
  }

  async dweb (name: string): Promise<string | null> {
    let dweb
    if (await this.isRegistered(name)) {
      const { data } = await getIpfsRecord(this.provider, name)
      dweb = data?.toString()
    }
    return dweb ?? null
  }

  async dwebs (name: string): Promise<string[]> {
    const records = await this.records(name, getDwebKeys())
    return records.map(record => record.value)
  }

  // Solana address only
  async reverse (address: string): Promise<string | null> {
    let reverse
    const addressKey = new PublicKey(address)
    const isValid = await this.isValidPubkey(addressKey)
    if (isValid) {
      const domains = await getAllDomains(this.provider, addressKey)
      reverse = domains.length > 0 ? (await performReverseLookup(this.provider, domains[0])) + '.sol' : null
    }
    return reverse ?? null
  }

  // https://bonfida.github.io/solana-name-service-guide/domain-name/domain-tld.html
  async registryAddress (name: string): Promise<string> {
    return '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
  }
}
