import ConfigurationError, { ConfigurationErrorCode } from './errors/configurationError'
import ResolutionError, { ResolutionErrorCode } from './errors/resolutionError'
import FetchProvider from './FetchProvider'
import { NamingService } from './NamingService'
import { BlockhanNetworkUrlMap, DasSupportedNetwork, hasProvider } from './types/index'
import { CryptoRecords, DasSource, NamingServiceName, Provider, ResolutionMethod } from './types/publicTypes'

export default class Das extends NamingService {
  static readonly UrlMap: BlockhanNetworkUrlMap = {
    'mainnet': '', // todo: fill
    'testnet': 'http://47.243.90.165:8223',
  }

  readonly name = NamingServiceName.DAS
  readonly network: string // check if there is some numeric network id todo:
  readonly url: string | undefined
  readonly provider: Provider // temporarily not in use todo:

  constructor (source?: DasSource) {
    super();

    if (!source) {
      source = {
        url: Das.UrlMap['mainnet'],
        network: 'mainnet'
      }
    }

    if (!source.network || !DasSupportedNetwork.guard(source.network)) {
      throw new ConfigurationError(ConfigurationErrorCode.UnsupportedNetwork, {
        method: NamingServiceName.DAS,
      })
    }

    this.network = source.network
    this.url = source['url'] || Das.UrlMap[this.network]
    this.provider = source['provider'] || new FetchProvider(this.name, this.url!)
  }

  // todo: implement autonetwork
  static async autonetwork(config: { url: string } | { provider: Provider }): Promise<Das> {
    return new Das()
  }

  serviceName (): ResolutionMethod {
    return this.name
  }

  isSupportedDomain (domain: string): boolean {
    return /.+\.bit/.test(domain) && domain.split('.').every(v => Boolean(v.length))
  }

  // todo: implement namehash
  namehash (domain: string): string {
    if (!this.isSupportedDomain(domain)) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain,
      })
    }

    return ''
  }

  // todo: implement childhash
  childhash (parentHash: string, label: string): string {
    return ''
  }

  // todo:
  async owner (domain: string): Promise<string> {
    return Promise.resolve('')
  }

  async resolver (domain: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      domain,
      methodName: 'resolver',
    })
  }

  async record(domain: string, key: string): Promise<string> {
    const returnee = (await this.allRecords(domain))[key]

    if (!returnee) {
      throw new ResolutionError(ResolutionErrorCode.RecordNotFound, {
        domain,
        recordName: key,
      })
    }

    return returnee
  }

  async records (domain: string, keys: string[]): Promise<CryptoRecords> {
    const records = await this.allRecords(domain)

    return keys.reduce((returnee, key) => {
      returnee[key] = records[key]
      return returnee
    }, {})
  }

  async reverse(address: string, currencyTicker: string): Promise<string | null> {
    if (!['ETH', 'CKB'].includes(currencyTicker)) {
      throw new Error('Das does not support any chain other than CKB and ETH')
    }

    const accounts = await this.allReverse(address)

    return accounts[0]
  }

  async allReverse(address: string): Promise<string[]> {
    const data = await this.provider.request({
      method: 'das_getAddressAccount',
      params: [address],
    }) as any

    const accounts = data.data.account_data

    return accounts.map(account => account.account)
  }

  twitter (domain: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      domain,
      methodName: 'twitter'
    })
  }

  async allRecords (domain: string): Promise<Record<string, string>> {
    const data = await this.provider.request({
      method: 'das_searchAccount',
      params: [
        domain,
      ]
    }) as any

    const records = data.data.account_data.records

    const returnee: CryptoRecords = {}

    records.forEach(record => {
      returnee[record.key] = record.value
    })

    return returnee
  }
}