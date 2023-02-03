// import { EnsService } from "./EnsService";
// import { Provider } from "@ethersproject/providers";
// import { setupSNS } from "sns-app-contract-api";
// import { SNS } from "sns-app-contract-api/src/sns";
// import { SNSResolver } from "sns-app-contract-api/src/sns.resolver";
// import { RecordItemAddr } from "./NamingService";
// import { setInterceptor } from "../errors/ErrorInterceptor";

// export interface SnsServiceOptions {
//   networkId: string;
//   registryAddress?: string;
//   provider: Provider;
// }

// export interface AddrResult {
//   name: string; // An SNS name
//   label: string; // An SNS name(remove suffix)
//   labelhash: string; // A hash value of an SNS name
//   owner: string; // Address of owner
//   resolver: string; // The resolver address
//   addr: string; // custom address
//   content: null; // custom content
// }

// export class SnsService extends EnsService {
//   serviceName = "sns";

//   sns: any;
//   snsResolver: SNSResolver;
//   constructor(options: SnsServiceOptions) {
//     super({ networkId: options.networkId, provider: options.provider });
//     const { sns, snsResolver } = setupSNS({ ...options });
//     this.sns = new setupSNS();
//     this.snsResolver = snsResolver;
//     setInterceptor(SnsService, Error, this.errorHandler);
//   }

//   protected errorHandler(error: any) {
//     // switch (error.code) {
//     //   case BitIndexerErrorCode.AccountNotExist:
//     //     throw new UnregisteredNameError(this.serviceName);
//     //   case BitIndexerErrorCode.AccountFormatInvalid:
//     //     throw new UnsupportedNameError(this.serviceName);
//     // }
//     throw error;
//   }

//   isSupported(name: string): boolean {
//     return /^.+\.key$/.test(name);
//   }

//   async isRegistered(name: string): Promise<boolean> {
//     return this.sns.recordExists(name);
//   }

//   //   async isAvailable(name: string): Promise<boolean> {}

//   async owner(name: string): Promise<string> {
//     return this.sns.getResolverOwner(name);
//   }

//   //   async manager(name: string): Promise<string> {}

//   async tokenId(name: string): Promise<string> {
//     return this.sns.getTokenIdOfName(name);
//   }

//   //  e.g:+xxx+yyy+zz+++aaa+b+
//   //   async record(name: string, key: string): Promise<string | null> {
//   //     return await this.snsResolver.getAllProperties(name);
//   //   }

//   //   async records(name: string, keys?: string[]): Promise<RecordItem[]> {}

//   async addrs(
//     name: string,
//     keys?: string | string[]
//   ): Promise<RecordItemAddr[]> {
//     const addrResults = await this.sns.getDomainDetails(name);
//     return [addrResults];
//   }

//   //   async addr(name: string, key: string) {}

//   //   async dweb(name: string) {}

//   //   async dwebs(name: string) {}

//   //   reverse(address: string): Promise<string | null> {}

//   registryAddress(name: string): Promise<string> {
//     return this.sns.registry(name);
//   }
// }
