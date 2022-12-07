import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { EnsService } from '../../src/services/EnsService'

describe('ENSService', () => {
  const ensService = new EnsService(defaultCreateInstanceOptions.ens)

  describe('isSupported', () => {
    it('support abc.eth', () => {
      expect(ensService.isSupported('abc.eth')).toBe(true)
    })

    it('do not support abc.bit', () => {
      expect(ensService.isSupported('abc.bit')).toBe(false)
    })
  })
})
