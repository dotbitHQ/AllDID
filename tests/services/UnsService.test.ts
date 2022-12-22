import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { DotbitService } from '../../src/services/DotbitService'

describe('DotbitService', () => {
  const dotbitService = new DotbitService(defaultCreateInstanceOptions.dotbit)

  describe('isSupported', () => {
    it('support Brad.crypto', () => {
      expect(dotbitService.isSupported('Brad.crypto')).toBe(true)
    })

    it('do not support Brad.eth', () => {
      expect(dotbitService.isSupported('Brad.eth')).toBe(false)
    })

  })
})
