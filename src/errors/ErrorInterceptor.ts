export function setInterceptor (service: any, errorType?: any, handler?: (e: Error) => void) {
  const methodNames = Object.getOwnPropertyNames(service.prototype).filter(v => v !== 'constructor')
  methodNames.forEach(methodName => {
    service.prototype[methodName] =
        new Proxy(service.prototype[methodName], new AllDIDInterceptor(handler, errorType))
  })
}

export class AllDIDInterceptor {
  // handler error
  constructor (public handler, public errorType?) {}

  apply (target, thisArg, argumentList) {
    const promise = target.apply(thisArg, argumentList)
    // async method
    if (promise.catch) {
      return promise.catch(e => {
        if (e instanceof this.errorType) {
          return this.handler.call(thisArg, e)
        }
        else throw e
      })
    }
    return promise
  }
}
