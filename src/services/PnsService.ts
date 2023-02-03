import { SDK as PNSSDK } from "pns-sdk";
import second, { Chains } from "pns-sdk/lib/constants";
import { setInterceptor } from "../errors/ErrorInterceptor";
import { NamingService, RecordItem, RecordItemAddr } from "./NamingService";

import type { Signer } from "@ethersproject/abstract-signer";
import { AllDIDErrorCode } from "src/errors/AllDIDError";
import { ethers } from "ethers";
import { makeRecordItem } from "./UnsService";

export interface PnsServiceOptions {
  pnsAddress: string;
  controllerAdddress: string;
  signer: Signer;
}

export const defaultPnsNetworkId = "1284";

export const PnsProvider = new ethers.providers.JsonRpcProvider(
  Chains[defaultPnsNetworkId].rpc
);

export class PnsService extends NamingService {
  serviceName = "pns";

  pns: PNSSDK;
  constructor(options: PnsServiceOptions) {
    super();
    this.pns = new PNSSDK(
      options.pnsAddress,
      options.controllerAdddress,
      options.signer
    );

    setInterceptor(PnsService, Error, this.errorHandler);
  }

  protected errorHandler(error: any) {
    // switch (error.code) {
    //   case AllDIDErrorCode.UnsupportedMethod:
    //     throw new UnsupportedMethodError(this.serviceName);
    //   case ResolutionErrorCode.UnsupportedDomain:
    //     throw new UnsupportedNameError(this.serviceName);
    //   case ResolutionErrorCode.UnregisteredDomain:
    //     throw new UnregisteredNameError(this.serviceName);
    //   case ResolutionErrorCode.RecordNotFound:
    //     return null;
    // }
    throw error;
  }

  isSupported(name: string): boolean {
    return /^.+\.dot$/.test(name);
  }

  async isRegistered(name: string): Promise<boolean> {
    return this.pns.exists(name);
  }

  async isAvailable(name: string): Promise<boolean> {
    //   TODO: conform available logic
    return this.pns.available(name);
  }

  async owner(name: string): Promise<string> {
    return this.pns.ownerOfName(name);
  }

  async manager(name: string): Promise<string> {
    this.throwError("Unsupported Method", AllDIDErrorCode.UnsupportedMethod);
    return "";
  }

  async tokenId(name: string): Promise<string> {
    return this.pns.namehash(name);
  }

  // key: 'address.${Uns key}'
  async record(name: string, key: string): Promise<RecordItem | null> {
    const recordItem = makeRecordItem(key);

    recordItem.value = await this.pns.getKey(name, key);
    return recordItem;
  }

  async records(name: string, keys: string[]): Promise<RecordItem[]> {
    const records = await this.pns.getKeys(name, keys);
    return records.map((record, index) => {
      const recordItem = makeRecordItem(keys[index]);
      recordItem.value = keys[index];
      return recordItem;
    });
  }

  async addrs(
    name: string,
    keys?: string | string[]
  ): Promise<RecordItemAddr[]> {
    // TODO: what's addrs mean
    return Promise.resolve([]);
  }

  async addr(name: string, key: string): Promise<RecordItemAddr | null> {
    // TODO: what's addrs mean
    return Promise.resolve(null);
  }

  async dweb(name: string): Promise<string> {
    this.throwError("Unsupported Method", AllDIDErrorCode.UnsupportedMethod);
    return Promise.resolve("");
  }

  async dwebs(name: string): Promise<string[]> {
    this.throwError("Unsupported Method", AllDIDErrorCode.UnsupportedMethod);
    return Promise.resolve([""]);
  }

  reverse(address: string): Promise<string | null> {
    //   TODO: it's mean born ???

    this.throwError("Unsupported Method", AllDIDErrorCode.UnsupportedMethod);
    return Promise.resolve(null);
  }

  async registryAddress(name: string): Promise<string> {
    // const loginAddress = PnsProvider.getSigner().getAddress();
    this.throwError("Unsupported Method", AllDIDErrorCode.UnsupportedMethod);
    return "";
    // return await this.pns.register(name, loginAddress, 365 * 86400, 1, [], []);
  }
}
