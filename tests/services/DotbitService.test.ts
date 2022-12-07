import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { DotbitService } from '../../src/services/DotbitService'

describe('DotbitService', () => {
  const dotbitService = new DotbitService(defaultCreateInstanceOptions.dotbit)

  describe('isSupported', () => {
    it('support abc.bit', () => {
      expect(dotbitService.isSupported('abc.bit')).toBe(true)
    })

    it('do not support abc.eth', () => {
      expect(dotbitService.isSupported('abc.eth')).toBe(false)
    })
  })
})
