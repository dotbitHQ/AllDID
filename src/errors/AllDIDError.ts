export enum AllDIDErrorCode {
  DidIsNotSupported = 'DidIsNotSupported',
}

export class AllDIDError extends Error {
  constructor (message: string, public code: AllDIDErrorCode) {
    super(code ? `${code}: ${message}` : message)
  }
}
