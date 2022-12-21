export enum AllDIDErrorCode {
  DidIsNotSupported = 'DidIsNotSupported',
  RecordIsNotFound = 'RecordIsNotFound'
}

export class AllDIDError extends Error {
  constructor (message: string, public code: AllDIDErrorCode) {
    super(code ? `${code}: ${message}` : message)
  }
}
