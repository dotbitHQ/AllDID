import {
  defaultPnsNetworkId,
  PnsProvider,
  PnsService,
  PnsServiceOptions,
} from "./services/PnsService";
// import { SnsService, SnsServiceOptions } from "./services/SnsService";
import { ethers } from "ethers";
import { AllDID } from "./AllDID";

import {
  DotbitService,
  DotbitServiceOptions,
  defaultDotbitServiceOptions,
} from "./services/DotbitService";

import { EnsService, EnsServiceOptions } from "./services/EnsService";
import { SIDService } from "./services/SIDService";
import { DotbitExtensionService } from "./services/DotbitExtensionService";
import {
  SolanaService,
  SolanaServiceOptions,
  createProvider,
} from "./services/SolanaService";

import { UnsService, UnsServiceOptions } from "./services/UnsService";
import { ApiService, ApiServiceOptions } from "./services/ApiService";
import { Chains, ContractAddrMap } from "pns-sdk/lib/constants";

export interface CreateInstanceOptions {
  dotbit: DotbitServiceOptions;
  ens: EnsServiceOptions;
  sid: EnsServiceOptions;
  solana: SolanaServiceOptions;
  uns: UnsServiceOptions;
  // sns: SnsServiceOptions;
  pns: PnsServiceOptions;
}

export const defaultCreateInstanceOptions: CreateInstanceOptions = {
  dotbit: defaultDotbitServiceOptions,
  ens: {
    provider: new ethers.providers.JsonRpcProvider(
      "https://web3.ens.domains/v1/mainnet"
    ),
    networkId: "1",
  },
  sid: {
    // from https://github.com/Space-ID/sidjs/blob/master/src/constants/rpc.js
    provider: new ethers.providers.JsonRpcProvider(
      "https://bsc-mainnet.nodereal.io/v1/d0c3ef1cdb0247f4b6fae228aa76c8b8"
    ),
    networkId: "56",
  },
  solana: {
    // from https://solana.com/rpc
    provider: createProvider("https://rpc.ankr.com/solana"),
    network: "mainnet-beta",
  },
  uns: {},
  // sns: {
  //   provider: new ethers.providers.JsonRpcProvider(
  //     "https://web3.ens.domains/v1/mainnet"
  //   ),
  //   networkId: "1",
  // },
  pns: {
    pnsAddress: ContractAddrMap[defaultPnsNetworkId].pns,
    controllerAddress: ContractAddrMap[defaultPnsNetworkId].controller,
    signer: PnsProvider.getSigner(ethers.constants.AddressZero),
  },
};

export function createInstance(options = defaultCreateInstanceOptions) {
  const alldid = new AllDID();
  const dotbitService = new DotbitService(options.dotbit);
  const ensService = new EnsService(options.ens);
  const sidService = new SIDService(options.sid);
  const dotbitExtensionService = new DotbitExtensionService(options.dotbit);
  const solanaService = new SolanaService(options.solana);
  const unsService = new UnsService(options.uns);
  const pnsService = new PnsService(options.pns);
  // const snsService = new SnsService(options.sns);
  alldid.installService(dotbitService);
  alldid.installService(ensService);
  alldid.installService(sidService);
  alldid.installService(dotbitExtensionService);
  alldid.installService(solanaService);
  alldid.installService(unsService);
  alldid.installService(pnsService);
  // alldid.installService(snsService);
  return alldid;
}

export function createLiteInstance(options: ApiServiceOptions) {
  const alldid = new AllDID();
  const apiService = new ApiService(options);
  alldid.installService(apiService);
  return alldid;
}
