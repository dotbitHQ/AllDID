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

export interface DasAccountData {
  account: string; // abc.bit
  account_id_hex: string; // 0x1234...
  next_account_id_hex: string; // 0x1234...
  create_at_unix: number; // seconds
  expired_at_unix: number; // seconds
  status: number; // 0
  das_lock_arg_hex: string;
  owner_algorithm_id: number; // 3: eth personal sign, 4: tron sign, 5: eip-712
  manager_algorithm_id: number;
  owner_key: string;
  manager_key: string;
}

export interface DasAccountCell<T = DasRecord> {
  out_point: {
    tx_hash: string;
    index: number;
  };
  account_info: DasAccountData;
}

export interface DotBitAccountRecordsRes {
  account: string;
  records: DasRecord[];
}
