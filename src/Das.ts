import {ResolutionError, ResolutionErrorCode} from './errors/resolutionError';
import FetchProvider from './FetchProvider';
import {NamingService} from './NamingService';
import {DasAccountCell, DasAccountData, DasAccountRecord} from './types/DAS';
import {DasSource, NamingServiceName, Provider} from './types/publicTypes';
import {constructRecords, isNullAddress} from './utils';

/**
 * @internal
 */
export default class Das extends NamingService {
  static readonly UrlMap = {
    mainnet: 'https://indexer.da.systems',
    lina: 'https://indexer.da.systems', // the current version of mainnet
  };

  readonly name = NamingServiceName.DAS;
  readonly network: string;
  readonly url: string | undefined;
  readonly provider: Provider;

  constructor(source?: DasSource) {
    super();

    this.network = source?.network || 'mainnet';
    this.url = source?.url || Das.UrlMap[this.network];
    this.provider = new FetchProvider(this.name, this.url!);
  }

  serviceName(): NamingServiceName {
    return this.name;
  }

  namehash(domain: string): string {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      methodName: 'namehash',
    });
  }

  childhash(parentHash: string, label: string): string {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      methodName: 'childhash',
    });
  }

  async isSupportedDomain(domain: string): Promise<boolean> {
    return this.checkSupportedDomain(domain);
  }

  async owner(domain: string): Promise<string> {
    const account = await this.account(domain);

    if (!account) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      });
    }

    return account.owner_address;
  }

  async record(domain: string, key: string): Promise<string> {
    const returnee = (await this.records(domain, [key]))[key];
    if (!returnee) {
      throw new ResolutionError(ResolutionErrorCode.RecordNotFound, {
        domain,
        recordName: key,
      });
    }
    return returnee;
  }

  async records(
    domain: string,
    keys: string[],
  ): Promise<Record<string, string>> {
    const account = await this.account(domain);

    if (!account) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      });
    }

    const dasKeys = keys.map((key) => this.fromUDRecordNameToDAS(key));

    const recordList = dasKeys.map((key) => {
      const record = account.records.find((record) => record.key === key);

      return record?.value;
    });

    return constructRecords(keys, recordList);
  }

  async reverse(
    address: string,
    currencyTicker: string,
  ): Promise<string | null> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      methodName: 'reverse',
    });
  }

  resolver(domain: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      method: NamingServiceName.DAS,
      methodName: 'resolver',
    });
  }

  async getTokenUri(tokenId: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      method: NamingServiceName.DAS,
      methodName: 'getTokenUri',
    });
  }

  async isAvailable(domain: string): Promise<boolean> {
    return !(await this.isRegistered(domain));
  }

  async isRegistered(domain: string): Promise<boolean> {
    const account = await this.account(domain);

    return Boolean(account);
  }

  async getDomainFromTokenId(tokenId: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      method: NamingServiceName.DAS,
      methodName: 'getDomainFromTokenId',
    });
  }

  async twitter(domain: string): Promise<string> {
    return this.record(domain, 'profile.twitter');
  }

  async allRecords(domain: string): Promise<Record<string, string>> {
    const account = await this.account(domain);

    if (!account) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain,
      });
    }

    return account.records.reduce((all, record) => {
      all[record.key] = all[record.value] || record.value;
      return all;
    }, {});
  }

  private fromUDRecordNameToDAS(key: string): string {
    const mapper = {
      'whois.email.value': 'profile.email',
      'social.twitter.username': 'profile.twitter',
    };

    if (key.startsWith('crypto')) {
      return 'address.' + key.split('.')[1].toLowerCase(); // crypto.ETH.address => address.eth
    }

    return mapper[key] || key;
  }

  private checkSupportedDomain(domain: string): boolean {
    return (
      /^[^-]*[^-]*\.bit$/.test(domain) &&
      domain.split('.').every((v) => !!v.length)
    );
  }

  registryAddress(domain: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      domain,
      methodName: 'registryAddress',
    });
  }

  /* added for DAS only */
  async account(account: string): Promise<DasAccountData> {
    const response = (await this.provider.request({
      method: 'das_searchAccount',
      params: [account],
    })) as {data: DasAccountCell};

    return response?.data?.account_data;
  }
}
