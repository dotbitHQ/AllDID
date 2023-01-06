export enum AllDIDErrorCode {
  DidIsNotSupported = 'DidIsNotSupported',
  UnsupportedMethod = 'UnsupportedMethod',
  RecordNotFound = 'RecordNotFound',
  UnregisteredName = 'UnregisteredName',
}

export class AllDIDError extends Error {
  constructor (message: string, public code: AllDIDErrorCode) {
    super(code ? `${code}: ${message}` : message)
  }
}

export class UnregisteredNameError extends AllDIDError {
  constructor (serviceName: string) {
    super(`${serviceName} - Unregistered domain name`, AllDIDErrorCode.UnregisteredName)
  }
}

export class RecordNotFoundError extends AllDIDError {
  constructor (serviceName: string) {
    super(`${serviceName} - Record not found`, AllDIDErrorCode.RecordNotFound)
  }
}

export class UnsupportedNameError extends AllDIDError {
  constructor (serviceName: string) {
    super(`${serviceName} - Unsupported name`, AllDIDErrorCode.DidIsNotSupported)
  }
}

export class UnsupportedMethodError extends AllDIDError {
  constructor (serviceName: string) {
    super(`${serviceName} - Unsupported method`, AllDIDErrorCode.UnsupportedMethod)
  }
}
