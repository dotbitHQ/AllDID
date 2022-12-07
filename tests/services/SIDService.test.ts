import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { SIDService } from '../../src/services/SIDService'

describe('SIDService', () => {
  const sidService = new SIDService(defaultCreateInstanceOptions.sid)

  describe('isSupported', () => {
    it('support abc.bnb', () => {
      expect(sidService.isSupported('abc.bnb')).toBe(true)
    })

    it('do not support abc.bit', () => {
      expect(sidService.isSupported('abc.bit')).toBe(false)
    })
  })
})
