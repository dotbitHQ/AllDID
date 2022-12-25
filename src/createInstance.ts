import { ethers } from 'ethers'
import { AllDID } from './AllDID'
import { DotbitService, DotbitServiceOptions } from './services/DotbitService'
import { EnsService, EnsServiceOptions } from './services/EnsService'
import { SIDService } from './services/SIDService'
import { SolanaService, SolanaServiceOptions, createProvider } from './services/SolanaService'

export interface CreateInstanceOptions {
  'dotbit': DotbitServiceOptions,
  'ens': EnsServiceOptions,
  'sid': EnsServiceOptions,
  'solana': SolanaServiceOptions,
}

export const defaultCreateInstanceOptions: CreateInstanceOptions = {
  dotbit: undefined,
  ens: {
    provider: new ethers.providers.JsonRpcProvider('https://web3.ens.domains/v1/mainnet'),
    networkId: '1',
  },
  sid: {
    // from https://github.com/Space-ID/sidjs/blob/master/src/constants/rpc.js
    provider: new ethers.providers.JsonRpcProvider('https://bsc-mainnet.nodereal.io/v1/d0c3ef1cdb0247f4b6fae228aa76c8b8'),
    networkId: '56'
  },
  solana: {
    // from https://github.com/solana-labs/solana-web3.js/blob/v1.72.0/src/utils/cluster.ts
    provider: createProvider('https://api.mainnet-beta.solana.com'),
    network: 'mainnet-beta'
  }
}

export function createInstance (options = defaultCreateInstanceOptions) {
  const alldid = new AllDID()
  const dotbitService = new DotbitService(options.dotbit)
  const ensService = new EnsService(options.ens)
  const sidService = new SIDService(options.sid)
  const solanaService = new SolanaService(options.solana)

  alldid.installService(dotbitService)
  alldid.installService(ensService)
  alldid.installService(sidService)
  alldid.installService(solanaService)

  return alldid
}
