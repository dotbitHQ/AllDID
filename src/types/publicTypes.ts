import {
  DasSupportedNetwork,
  CnsSupportedNetwork,
  EnsSupportedNetwork,
  EventFilter,
  RequestArguments,
  RpcProviderLogEntry,
  TransactionRequest,
  ZnsSupportedNetwork,
} from '.';

export type DasSupportedNetworks = typeof DasSupportedNetwork.type
export type CnsSupportedNetworks = typeof CnsSupportedNetwork.type;
export type EnsSupportedNetworks = typeof EnsSupportedNetwork.type;
export type ZnsSupportedNetworks = typeof ZnsSupportedNetwork.type;

export type NamingServiceSource = {url?: string} | {provider?: Provider}; // data source，either provider or url

export type CnsSource = NamingServiceSource & {
  network: CnsSupportedNetworks;
  proxyReaderAddress?: string;
};

export type EnsSource = NamingServiceSource & {
  network: EnsSupportedNetworks;
  registryAddress?: string;
};

export type ZnsSource = NamingServiceSource & {
  network: ZnsSupportedNetworks;
  registryAddress?: string;
};

export type DasSource = NamingServiceSource & {
  network: DasSupportedNetworks
}

export type SourceConfig = {
  das?: DasSource
  cns?: CnsSource
  zns?: ZnsSource
  ens?: EnsSource
};

export enum NamingServiceName {
  DAS = 'DAS',
  ENS = 'ENS',
  CNS = 'CNS',
  ZNS = 'ZNS',
}

export type ResolutionMethod = NamingServiceName

export type AutoNetworkConfigs = {
  ens?: {url: string} | {provider: Provider};
  cns?: {url: string} | {provider: Provider};
};

/**
 * ResolutionResulution
 * @typedef ResolutionResponse
 * @property {Object} addresses - Resolution addresses for various currency addresses attached to the domain
 * @property {Object} meta - meta information about the owner of the domain
 */
export type ResolutionResponse = {
  addresses: {
    [key: string]: string;
  };
  meta: {
    owner: string | null;
    type: string; // available domain
    namehash: string;
    resolver: string;
    ttl: number;
  };
  records: {
    [key: string]: string;
  };
};
export interface Web3Version0Provider {
  sendAsync: ProviderMethod;
}
export interface Web3Version1Provider {
  send: ProviderMethod;
}

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export interface Provider {
  request: (request: RequestArguments) => Promise<unknown>;
}
type ProviderMethod = (
  payload: JsonRpcPayload,
  callback: (error: Error | null, result?: JsonRpcResponse) => void,
) => void;
export const UnclaimedDomainResponse: ResolutionResponse = {
  addresses: {},
  meta: {
    namehash: '',
    resolver: '',
    owner: null, // available domain
    type: '',
    ttl: 0,
  },
  records: {},
};

/**
 * @see https://github.com/ethereum/web3.js/blob/1.x/packages/web3-core-helpers/types/index.d.ts#L216
 */
export interface JsonRpcPayload {
  jsonrpc: string;
  method: string;
  params: any[];
  id?: string | number;
}
export interface JsonRpcResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: string;
}

/**
 * @see https://github.com/ethers-io/ethers.js/blob/v5.0.4/packages/abstract-provider/src.ts/index.ts#L224
 */
export interface EthersProvider {
  call(transaction: TransactionRequest, blockTag?: never): Promise<string>;
  getLogs(filter: EventFilter): Promise<RpcProviderLogEntry[]>;
}

export type NamehashOptions = {
  readonly format?: 'dec' | 'hex';
  readonly prefix?: boolean;
};

export const NamehashOptionsDefault = {format: 'hex', prefix: true} as const;

export enum DnsRecordType {
  A = 'A',
  AAAA = 'AAAA',
  AFSDB = 'AFSDB',
  APL = 'APL',
  CAA = 'CAA',
  CDNSKEY = 'CDNSKEY',
  CDS = 'CDS',
  CERT = 'CERT',
  CNAME = 'CNAME',
  CSYNC = 'CSYNC',
  DHCID = 'DHCID',
  DLV = 'DLV',
  DNAME = 'DNAME',
  DNSKEY = 'DNSKEY',
  DS = 'DS',
  EUI48 = 'EUI48',
  EUI64 = 'EUI64',
  HINFO = 'HINFO',
  HIP = 'HIP',
  HTTPS = 'HTTPS',
  IPSECKEY = 'IPSECKEY',
  KEY = 'KEY',
  KX = 'KX',
  LOC = 'LOC',
  MX = 'MX',
  NAPTR = 'NAPTR',
  NS = 'NS',
  NSEC = 'NSEC',
  NSEC3 = 'NSEC3',
  NSEC3PARAM = 'NSEC3PARAM',
  OPENPGPKEY = 'OPENPGPKEY',
  PTR = 'PTR',
  RP = 'RP',
  RRSIG = 'RRSIG',
  SIG = 'SIG',
  SMIMEA = 'SMIMEA',
  SOA = 'SOA',
  SRV = 'SRV',
  SSHFP = 'SSHFP',
  SVCB = 'SVCB',
  TA = 'TA',
  TKEY = 'TKEY',
  TLSA = 'TLSA',
  TSIG = 'TSIG',
  TXT = 'TXT',
  URI = 'URI',
  ZONEMD = 'ZONEMD',
}

export interface DnsRecord {
  type: DnsRecordType;
  TTL: number;
  data: string;
}
export type CryptoRecords = Record<string, string>;
export type DomainData = {
  owner: string;
  resolver: string;
  records: CryptoRecords;
};
