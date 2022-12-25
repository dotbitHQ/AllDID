import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { SolanaService } from '../../src/services/SolanaService'

describe('SolanaService', () => {
  const solanaService = new SolanaService(defaultCreateInstanceOptions.solana)

  describe('isSupported', () => {
    it('support abc.sol', () => {
      expect(solanaService.isSupported('abc.sol')).toBe(true)
    })

    it('do not support abc.bit', () => {
      expect(solanaService.isSupported('abc.bit')).toBe(false)
    })
  })
})
