export enum AllDIDErrorCode {
  DidIsNotSupported = 'DidIsNotSupported',
  UnsupportedMethod = 'UnsupportedMethod',
  RecordNotFound = 'RecordNotFound',
  UnregisteredName = 'UnregisteredName'
}

export class AllDIDError extends Error {
  constructor (message: string, public code: AllDIDErrorCode) {
    super(code ? `${code}: ${message}` : message)
  }
}
