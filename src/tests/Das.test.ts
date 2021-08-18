import nock from 'nock';
import Resolution from '../index';
import Das from '../Das';
import Networking from '../utils/Networking';
import {
  mockAsyncMethod,
  expectSpyToBeCalled,
  expectResolutionErrorCode,
} from './helpers';
import {NamingServiceName} from '../types/publicTypes';
import {ResolutionErrorCode} from '../errors/resolutionError';

let resolution: Resolution;
let das: Das;

const DasAccountRegistered = 'dastodamoon.bit';
const DasAccountUnregistered = 'dastodamoon1.bit';
export const jsonRpcResponse = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    errno: 0,
    errmsg: '',
    data: {
      out_point: {
        tx_hash:
          '0x8fe0c562ab6c85cbc234341ac72387d682e378dd1eb27806858af7fb1ed3cb5b',
        index: 0,
      },
      account_data: {
        account: 'dastodamoon.bit',
        account_id_hex: '0x76ef9b455f12ce4c04db201d90660c733cbd828e',
        next_account_id_hex: '0x7706a39db805e2d87f0f90c4287703f0d482ef43',
        create_at_unix: 1627458813,
        expired_at_unix: 1658994813,
        status: 0,
        das_lock_arg_hex:
          '035fd1d0dad20817951e40043fee7655548838d82e035fd1d0dad20817951e40043fee7655548838d82e',
        owner_address_chain: 'ETH',
        owner_lock_args_hex: '0x5fd1d0dad20817951e40043fee7655548838d82e',
        owner_address: '0x5fd1d0dad20817951e40043fee7655548838d82e',
        manager_address_chain: 'ETH',
        manager_address: '0x5fd1d0dad20817951e40043fee7655548838d82e',
        manager_lock_args_hex: '0x5fd1d0dad20817951e40043fee7655548838d82e',
        records: [
          {
            key: 'address.ckb',
            label: 'BusinessAddress',
            value: 'ckb1qyqzeajw8xtqgvw0d6q8ey7sysvv7evxvwqqvnvmwu',
            ttl: '300',
          },
          {
            key: 'address.ckb',
            label: 'PersonalAddress',
            value: 'ckb1qyqzeajw8xtqgvw0d6q8ey7sysvv7evxvwqqvnvmwu',
            ttl: '300',
          },
          {
            key: 'address.btc',
            label: 'DeFi',
            value: '1JTbtf3DWswwauF44Qm4iA6jKTR7G8M77b',
            ttl: '300',
          },
          {
            key: 'address.eth',
            label: 'Personal',
            value: '0x058937f5bf64c43a4c2212236a6eca0aa036b438',
            ttl: '300',
          },
          {
            key: 'address.doge',
            label: 'Have Fun',
            value: 'D5b9JnJf2P5eTH9FQmRmrM3DMfAv4SfwfK',
            ttl: '300',
          },
          {
            key: 'profile.website',
            label: 'DAS Home',
            value: 'https://da.systems',
            ttl: '300',
          },
          {
            key: 'profile.email',
            label: 'DAS Help',
            value: 'help@da.systems',
            ttl: '300',
          },
          {
            key: 'profile.twitter',
            label: 'DAS Twitter',
            value: 'realDASystems',
            ttl: '300',
          },
          {
            key: 'profile.github',
            label: 'Source Code',
            value: 'DeAccountSystems',
            ttl: '300',
          },
          {
            key: 'profile.description',
            label: 'Join Now',
            value: 'This is the most awesome way to show your DAS account!',
            ttl: '300',
          },
          {
            key: 'custom_key.bitcc_theme',
            label: 'bitcc_theme',
            value: 'dark',
            ttl: '300',
          },
          {
            key: 'custom_key.bitcc_welcome',
            label: 'bitcc_welcome',
            value: 'Hi! It\u0027s time to DAS!',
            ttl: '300',
          },
        ],
      },
    },
  },
};
beforeEach(() => {
  nock.cleanAll();
  jest.restoreAllMocks();
  resolution = new Resolution();
  das = resolution.serviceMap[NamingServiceName.DAS] as Das;
});

describe('DAS', () => {
  it('should return correct name', () => {
    expect(das.serviceName()).toBe(NamingServiceName.DAS);
  });

  it('should throw error for registryAddress', async () => {
    await expectResolutionErrorCode(
      () => resolution.registryAddress(DasAccountRegistered),
      ResolutionErrorCode.UnsupportedMethod,
    );
  });

  it('should throw error for namehash', async () => {
    await expectResolutionErrorCode(
      () => resolution.namehash(DasAccountRegistered),
      ResolutionErrorCode.UnsupportedMethod,
    );
  });

  it('should throw error for childhash', async () => {
    await expectResolutionErrorCode(
      () =>
        resolution.childhash(
          DasAccountRegistered,
          'www',
          NamingServiceName.DAS,
        ),
      ResolutionErrorCode.UnsupportedMethod,
    );
  });

  it('should return true for isSupportedDomain', async () => {
    expect(await das.isSupportedDomain(DasAccountRegistered)).toBe(true);
  });

  it('should return false for isSupportedDomain', async () => {
    expect(await das.isSupportedDomain('test.eth')).toBe(false);
  });

  it('should return verified twitter handle', async () => {
    const eyes = mockAsyncMethod(Networking, 'fetch', {
      status: 200,
      json: () => jsonRpcResponse,
    });
    const twitterHandle = await resolution.twitter(DasAccountRegistered);
    expectSpyToBeCalled([eyes]);
    expect(twitterHandle).toBe('realDASystems');
  });

  it('returns owner of the domain', async () => {
    const eyes = mockAsyncMethod(Networking, 'fetch', {
      status: 200,
      json: () => jsonRpcResponse,
    });
    const owner = await resolution.owner(DasAccountRegistered);
    expectSpyToBeCalled([eyes]);
    expect(owner).toBe('0x5fd1d0dad20817951e40043fee7655548838d82e');
  });

  it('should return a valid email from API', async () => {
    const eyes = mockAsyncMethod(Networking, 'fetch', {
      status: 200,
      json: () => jsonRpcResponse,
    });
    const email = await resolution.email(DasAccountRegistered);
    expectSpyToBeCalled([eyes]);
    expect(email).toBe('help@da.systems');
  });

  it('should return true for registered domain', async () => {
    const spies = mockAsyncMethod(
      das,
      'account',
      jsonRpcResponse.result.data.account_data,
    );
    const isRegistered = await das.isRegistered(DasAccountRegistered);
    expectSpyToBeCalled([spies]);
    expect(isRegistered).toBe(true);
  });

  it('should return false for unregistered domain', async () => {
    const spies = mockAsyncMethod(das, 'account', null);
    const isRegistered = await resolution.isRegistered(DasAccountUnregistered);
    expectSpyToBeCalled([spies]);
    expect(isRegistered).toBe(false);
  });

  it('should return true for available domain', async () => {
    const spies = mockAsyncMethod(das, 'account', null);
    const isAvailable = await resolution.isAvailable(DasAccountUnregistered);
    expectSpyToBeCalled([spies]);
    expect(isAvailable).toBe(true);
  });

  it('should get all records from API', async () => {
    const eyes = mockAsyncMethod(Networking, 'fetch', {
      status: 200,
      json: () => jsonRpcResponse,
    });
    const records = await resolution.allRecords(DasAccountRegistered);
    expectSpyToBeCalled([eyes]);
    expect(records).toMatchObject({
      'address.ckb': 'ckb1qyqzeajw8xtqgvw0d6q8ey7sysvv7evxvwqqvnvmwu',
      'address.btc': '1JTbtf3DWswwauF44Qm4iA6jKTR7G8M77b',
      'address.eth': '0x058937f5bf64c43a4c2212236a6eca0aa036b438',
      'address.doge': 'D5b9JnJf2P5eTH9FQmRmrM3DMfAv4SfwfK',
      'profile.website': 'https://da.systems',
      'profile.email': 'help@da.systems',
      'profile.twitter': 'realDASystems',
      'profile.github': 'DeAccountSystems',
      'profile.description':
        'This is the most awesome way to show your DAS account!',
      'custom_key.bitcc_theme': 'dark',
      'custom_key.bitcc_welcome': 'Hi! It\u0027s time to DAS!',
    });
  });

  it('should throw error for unregistered account', async () => {
    const eyes = mockAsyncMethod(das, 'account', null);

    await expectResolutionErrorCode(
      () => resolution.allRecords(DasAccountRegistered),
      ResolutionErrorCode.UnregisteredDomain,
    );

    expectSpyToBeCalled([eyes]);
  });

  it('should throw error for unregistered account when using recordList', async () => {
    const eyes = mockAsyncMethod(das, 'account', null);

    await expectResolutionErrorCode(
      () => resolution.addrList(DasAccountRegistered, 'eth'),
      ResolutionErrorCode.UnregisteredDomain,
    );

    expectSpyToBeCalled([eyes]);
  });
});
