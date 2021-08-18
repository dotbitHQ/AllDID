export enum DasRecordType {
  address = 'address',
  profile = 'profile',
  dweb = 'dweb',
  custom = 'custom_key',
}

export interface DasRecord {
  key: string;
  label: string;
  value: string; // 'abc_xyz123'
  ttl: string; // seconds
}

// add some useful fields
export interface DasAccountRecord extends Omit<DasRecord, 'ttl'> {
  ttl: number;
  avatar: string;
}

export interface DasAccountData<T = DasRecord> {
  account: string; // abc.bit
  account_id_hex: string; // 0x1234...
  next_account_id_hex: string; // 0x1234...
  create_at_unix: number; // seconds
  expired_at_unix: number; // seconds
  status: number; // 0
  owner_lock_args_hex: string; // '0x1234...'
  owner_address: string;
  owner_address_chain: string;
  manager_lock_args_hex: string; // '0x1234...'
  manager_address: string;
  manager_address_chain: string;
  records: T[];
}

export interface DasAccountCell<T = DasRecord> {
  out_point: {
    tx_hash: string;
    index: number;
  };
  account_data: DasAccountData<T>;
}
