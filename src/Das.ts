import {ResolutionError, ResolutionErrorCode} from './errors/resolutionError';
import FetchProvider from './FetchProvider';
import {NamingService} from './NamingService';
import {
  DasAccountCell,
  DasAccountData,
  DasAccountRecord,
  DotBitAccountRecordsRes,
} from './types/DAS';
import {DasSource, NamingServiceName, Provider} from './types/publicTypes';
import {constructRecords} from './utils';

/**
 * @internal
 */
export default class Das extends NamingService {
  static readonly UrlMap = {
    mainnet: 'https://indexer-v1.did.id',
    mirana: 'https://indexer-v1.did.id', // the current version of mainnet
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

    return account.owner_key;
  }

  private async _records(account: string) {
    const response = (await this.provider.request({
      method: 'das_accountRecords',
      params: [{account}],
    })) as {data: DotBitAccountRecordsRes};

    return response?.data?.records;
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

    const records = await this._records(domain);

    const recordList = dasKeys.map((key) => {
      const record = records.find((record) => record.key === key);

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

    const records = await this._records(domain);

    return records.reduce((all, record) => {
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
      method: 'das_accountInfo',
      params: [{account}],
    })) as {data: DasAccountCell};

    return response?.data?.account_info;
  }

  async recordList(account: string, key: string): Promise<DasAccountRecord[]> {
    const accountData = await this.account(account);

    if (!accountData) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      });
    }

    const records = await this._records(account);

    return records
      .filter((record) => record.key === key)
      .map((record) => {
        return {
          ...record,
          ttl: Number(record.ttl),
          avatar: `https://display.did.id/identicon/${account}`,
        };
      });
  }

  async addrList(account: string, ticker: string): Promise<DasAccountRecord[]> {
    return await this.recordList(account, `address.${ticker.toLowerCase()}`);
  }
}
