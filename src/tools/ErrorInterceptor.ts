export function setInterceptor (service: any, errorType?: any, handler?: (e: Error) => void) {
  const methodNames = Object.getOwnPropertyNames(service.prototype).filter(v => v !== 'constructor')
  methodNames.forEach(methodName => {
    service.prototype[methodName] =
        new Proxy(service.prototype[methodName], new AllDIDInterceptor(handler, errorType))
  })
}

export const AsyncFunction = async function () {}.constructor

export class AllDIDInterceptor {
  // handler error
  constructor (public handler, public errorType?) {}

  apply (target, thisArg, argumentList) {
    // async method
    if (target.apply(thisArg, argumentList).catch) {
      return target.apply(thisArg, argumentList).catch(e => {
        if (e instanceof this.errorType) {
          this.handler.call(thisArg, e)
        }
        else throw e
      })
    }
    return target.apply(thisArg, argumentList)
  }
}
