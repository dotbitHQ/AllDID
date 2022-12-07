import ENS from '@ensdomains/ensjs'
import { Provider, ExternalProvider } from '@ethersproject/providers'
import { NamingService } from './NamingService'

export interface EnsServiceOptions {
  provider: Provider | ExternalProvider,
  networkId: string,
}

// from https://github.com/Space-ID/sidjs/blob/master/src/index.js#L16
function getEnsAddress (networkId: string) {
  // .bnb bsc testnet
  if ([97].includes(parseInt(networkId))) {
    return '0xfFB52185b56603e0fd71De9de4F6f902f05EEA23'
  }
  // ens
  else if ([1, 3, 4, 5].includes(parseInt(networkId))) {
    return '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  }
  // .bnb bsc mainnet
  else if ([56].includes(parseInt(networkId))) {
    return '0x08CEd32a7f3eeC915Ba84415e9C07a7286977956'
  }
}

export class EnsService extends NamingService {
  serviceName = 'ens'

  ens: ENS
  constructor (options: EnsServiceOptions) {
    super()
    this.ens = new ENS({ provider: options.provider, ensAddress: getEnsAddress(options.networkId) })
  }

  isSupported (name: string): boolean {
    return /^.+\.eth$/.test(name)
  }

  isRegistered (name: string): Promise<boolean> {
    return this.ens.exist(name)
  }

  isAvailable (name: string): Promise<boolean> {
    return this.isRegistered(name).then(isRegistered => !isRegistered)
  }

  owner (name: string): Promise<string> {
    return this.ens.accountInfo(name).then(info => info.owner_key)
  }

  manager (name: string): Promise<string> {
    return this.ens.accountInfo(name).then(info => info.manager_key)
  }

  tokenId (name: string): Promise<string> {
    return null
  }

  record (name: string, key: string): Promise<string> {
    return null
  }

  records (name: string, keys?: string[]): Promise<Record<string, string>> {
    return null
  }

  addrs (name: string, keys?: string | string[]): Promise<string> {
    return null
  }

  addr (name: string): Promise<string> {
    return null
  }

  dweb (name: string): Promise<string> {
    return null
  }

  dwebs (name: string): Promise<string> {
    return null
  }

  reverse (address: string, currencyTicker: string): Promise<string | null> {
    return null
  }

  registryAddress (name: string): Promise<string> {
    return null
  }
}
