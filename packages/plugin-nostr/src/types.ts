import { RecordItem } from 'alldid'

declare module 'alldid' {
  interface AllDID {
    nostrs: (name: string) => Promise<RecordItem[]>,
    nostr: (name: string) => Promise<RecordItem>,
  }

  interface NamingService {
    nostrs: (name: string) => Promise<RecordItem[]>,
    nostr: (name: string) => Promise<RecordItem>,
  }
}
