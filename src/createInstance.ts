import { ethers } from 'ethers'
import { AllDID } from './AllDID'
import { DotbitService, DotbitServiceOptions, defaultDotbitServiceOptions } from './services/DotbitService'
import { EnsService, EnsServiceOptions } from './services/EnsService'
import { SIDService } from './services/SIDService'

export interface CreateInstanceOptions {
  'dotbit': DotbitServiceOptions,
  'ens': EnsServiceOptions,
  'sid': EnsServiceOptions,
}

export const defaultCreateInstanceOptions: CreateInstanceOptions = {
  dotbit: defaultDotbitServiceOptions,
  ens: {
    provider: new ethers.providers.JsonRpcProvider('https://web3.ens.domains/v1/mainnet'),
    networkId: '1',
  },
  sid: {
    // from https://github.com/Space-ID/sidjs/blob/master/src/constants/rpc.js
    provider: new ethers.providers.JsonRpcProvider('https://bsc-mainnet.nodereal.io/v1/d0c3ef1cdb0247f4b6fae228aa76c8b8'),
    networkId: '56'
  }
}

export function createInstance (options = defaultCreateInstanceOptions) {
  const alldid = new AllDID()
  const dotbitService = new DotbitService(options.dotbit)
  const ensService = new EnsService(options.ens)
  const sidService = new SIDService(options.sid)

  alldid.installService(dotbitService)
  alldid.installService(ensService)
  alldid.installService(sidService)

  return alldid
}
