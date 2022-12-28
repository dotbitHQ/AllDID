import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { DotbitExtensionService } from '../../src/services/DotbitExtensionService'

describe('DotbitExtensionService', () => {
  const dotbitExtensionService = new DotbitExtensionService(defaultCreateInstanceOptions.dotbit)

  describe('isSupported', () => {
    it('support abc.', () => {
      expect(dotbitExtensionService.isSupported('abc.')).toBe(true)
    })

    it('do not support abc', () => {
      expect(dotbitExtensionService.isSupported('abc')).toBe(false)
    })
  })
})
