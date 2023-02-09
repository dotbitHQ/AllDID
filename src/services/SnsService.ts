// /*
//    this package is not supported on Node environment
// */
// import { EnsService } from './EnsService';
// import { Provider } from '@ethersproject/providers';
// import { setupSNS } from 'sns-app-contract-api';
// import { SNSResolver } from 'sns-app-contract-api/src/sns.resolver';
// import { NamingService, RecordItem, RecordItemAddr } from './NamingService';
// import { setInterceptor } from '../errors/ErrorInterceptor';
// import {
//   AllDIDErrorCode,
//   UnsupportedMethodError,
// } from 'src/errors/AllDIDError';

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

// export class SnsService extends NamingService {
//   serviceName = 'sns';

//   sns: any;
//   snsResolver: SNSResolver;
//   constructor(options: SnsServiceOptions) {
//     super();
//     const { sns, snsResolver } = setupSNS({ ...options });
//     this.sns = sns;
//     this.snsResolver = snsResolver;
//     setInterceptor(SnsService, Error, this.errorHandler);
//   }

//   protected errorHandler(error: any) {
//     switch (error.code) {
//       case AllDIDErrorCode.UnsupportedMethod:
//         throw new UnsupportedMethodError(this.serviceName);
//     }
//     throw error;
//   }

//   isSupported(name: string): boolean {
//     return /^.+\.key$/.test(name);
//   }

//   async isRegistered(name: string): Promise<boolean> {
//     return this.sns.recordExists(name);
//   }

//   async isAvailable(name: string): Promise<boolean> {}

//   async owner(name: string): Promise<string> {
//     return this.sns.getResolverOwner(name);
//   }

//   async manager(name: string): Promise<string> {}

//   async tokenId(name: string): Promise<string> {
//     return this.sns.getTokenIdOfName(name);
//   }

//   //  e.g:+xxx+yyy+zz+++aaa+b+
//   async record(name: string, key: string): Promise<RecordItem | null> {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return null;
//   }

//   async records(name: string, keys?: string[]): Promise<RecordItem[]> {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return [];
//   }

//   async addrs(
//     name: string,
//     keys?: string | string[]
//   ): Promise<RecordItemAddr[]> {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return [];
//   }

//   async addr(name: string, key: string): Promise<RecordItemAddr | null> {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return null;
//   }

//   async dweb(name: string) {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return '';
//   }

//   async dwebs(name: string) {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return '';
//   }

//   reverse(address: string): Promise<string | null> {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return Promise.resolve(null);
//   }

//   registryAddress(name: string): Promise<string> {
//     this.throwError('Unsupported Method', AllDIDErrorCode.UnsupportedMethod);
//     return Promise.resolve('');
//   }
// }
