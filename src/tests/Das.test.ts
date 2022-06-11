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
export const dotbitAccountRPCRes = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    errno: 0,
    errmsg: '',
    data: {
      out_point: {
        tx_hash:
          '0x1b9c644633f90fb8e11859d2696083637da9479f2e5beb441d31882a5669bfc2',
        index: 36,
      },
      account_info: {
        account: 'dastodamoon.bit',
        account_alias: 'dastodamoon.bit',
        account_id_hex: '0x76ef9b455f12ce4c04db201d90660c733cbd828e',
        next_account_id_hex: '0x76f0661335ee962ba8a59aace4ed80fcc58ee7f2',
        create_at_unix: 1627458813,
        expired_at_unix: 1658994813,
        status: 0,
        das_lock_arg_hex:
          '0x035fd1d0dad20817951e40043fee7655548838d82e035fd1d0dad20817951e40043fee7655548838d82e',
        owner_algorithm_id: 3,
        owner_key: '0x5fd1d0dad20817951e40043fee7655548838d82e',
        manager_algorithm_id: 3,
        manager_key: '0x5fd1d0dad20817951e40043fee7655548838d82e',
      },
    },
  },
};
export const dotbitRecordsRPCRes = {
  id: 1,
  jsonrpc: '2.0',
  result: {
    errno: 0,
    errmsg: '',
    data: {
      account: 'dastodamoon.bit',
      records: [
        {
          key: 'address.ckb',
          label: 'BusinessAddress',
          value: 'ckb1qyq9j48k60dll8xjw04u2uu6vvd0fypqjkhqq84pmt',
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
          value: '0x1D643FAc9a463c9d544506006a6348c234dA485f',
          ttl: '300',
        },
        {
          key: 'address.doge',
          label: 'Have Fun',
          value: 'D5b9JnJf2P5eTH9FQmRmrM3DMfAv4SfwfK',
          ttl: '300',
        },
        {
          key: 'address.ckb',
          label: 'PersonalAddress',
          value: 'ckb1qyq9j48k60dll8xjw04u2uu6vvd0fypqjkhqq84pmt',
          ttl: '300',
        },
        {
          key: 'address.eth',
          label: 'Business',
          value: '0x1D643FAc9a463c9d544506006a6348c234dA485f',
          ttl: '300',
        },
        {
          key: 'profile.website',
          label: 'DAS Home',
          value: 'https://did.id',
          ttl: '300',
        },
        {
          key: 'profile.email',
          label: '',
          value: 'techsupport@did.id',
          ttl: '300',
        },
        {
          key: 'profile.twitter',
          label: 'DAS Twitter',
          value: 'dotbitHQ',
          ttl: '300',
        },
        {
          key: 'profile.github',
          label: 'Source Code',
          value: 'dotbitHQ',
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
    const spy1 = mockAsyncMethod(
      das,
      'account',
      dotbitAccountRPCRes.result.data.account_info,
    );
    const spy2 = mockAsyncMethod(
      das,
      '_records',
      dotbitRecordsRPCRes.result.data.records,
    );

    const twitterHandle = await resolution.twitter(DasAccountRegistered);
    expectSpyToBeCalled([spy1, spy2]);
    expect(twitterHandle).toBe('dotbitHQ');
  });

  it('returns owner of the domain', async () => {
    const eyes = mockAsyncMethod(Networking, 'fetch', {
      status: 200,
      json: () => dotbitAccountRPCRes,
    });
    const owner = await resolution.owner(DasAccountRegistered);
    expectSpyToBeCalled([eyes]);
    expect(owner).toBe('0x5fd1d0dad20817951e40043fee7655548838d82e');
  });

  it('should return a valid email from API', async () => {
    const spy1 = mockAsyncMethod(
      das,
      'account',
      dotbitAccountRPCRes.result.data.account_info,
    );
    const spy2 = mockAsyncMethod(
      das,
      '_records',
      dotbitRecordsRPCRes.result.data.records,
    );

    const email = await resolution.email(DasAccountRegistered);
    expectSpyToBeCalled([spy1, spy2]);
    expect(email).toBe('techsupport@did.id');
  });

  it('should return true for registered domain', async () => {
    const spies = mockAsyncMethod(
      das,
      'account',
      dotbitAccountRPCRes.result.data.account_info,
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
    const spy1 = mockAsyncMethod(
      das,
      'account',
      dotbitAccountRPCRes.result.data.account_info,
    );
    const spy2 = mockAsyncMethod(
      das,
      '_records',
      dotbitRecordsRPCRes.result.data.records,
    );
    const records = await resolution.allRecords(DasAccountRegistered);
    expectSpyToBeCalled([spy1, spy2]);
    expect(records).toMatchObject({
      'address.ckb': 'ckb1qyq9j48k60dll8xjw04u2uu6vvd0fypqjkhqq84pmt',
      'address.btc': '1JTbtf3DWswwauF44Qm4iA6jKTR7G8M77b',
      'address.eth': '0x1D643FAc9a463c9d544506006a6348c234dA485f',
      'address.doge': 'D5b9JnJf2P5eTH9FQmRmrM3DMfAv4SfwfK',
      'profile.website': 'https://did.id',
      'profile.email': 'techsupport@did.id',
      'profile.twitter': 'dotbitHQ',
      'profile.github': 'dotbitHQ',
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
