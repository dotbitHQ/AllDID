import { defaultCreateInstanceOptions } from '../src/createInstance'
import { DotbitService } from '../src/services/DotbitService'
import { EnsService } from '../src/services/EnsService'
import { SIDService } from '../src/services/SIDService'
import { UnsService } from '../src/services/UnsService'
import { SolanaService } from '../src/services/SolanaService'
import { AllDID } from '../src/AllDID'

describe('AllDID', () => {
  jest.setTimeout(30000)

  const alldid = new AllDID()

  alldid.installService(new DotbitService(defaultCreateInstanceOptions.dotbit))
  alldid.installService(new EnsService(defaultCreateInstanceOptions.ens))
  alldid.installService(new SIDService(defaultCreateInstanceOptions.sid))
  alldid.installService(new UnsService(defaultCreateInstanceOptions.uns))
  alldid.installService(new SolanaService(defaultCreateInstanceOptions.solana))

  describe('isSupported', () => {
    it('support .bit .eth .bnb', async () => {
      expect(await alldid.isSupported('abc.bit')).toBe(true)
      expect(await alldid.isSupported('abc.eth')).toBe(true)
      expect(await alldid.isSupported('abc.bnb')).toBe(true)
    })

    it('do not support abc.bat', async () => {
      expect(await alldid.isSupported('abc.bat')).toBe(false)
    })

    it('support abc.sol', async () => {
      expect(await alldid.isSupported('abc.sol')).toBe(true)
    })

    it('support abc.crypto', async () => {
      expect(await alldid.isSupported('abc.crypto')).toBe(true)
    })
  })
  describe('isRegistered', () => {
    it('jeffx.bit Brad.crypto 🍍.sol has been registered', async () => {
      expect(await alldid.isRegistered('jeffx.bit')).toBe(true)
      expect(await alldid.isRegistered('Brad.crypto')).toBe(true)
      expect(await alldid.isRegistered('🍍.sol')).toBe(true)
    })

    it('abbbc.wallet is not registered', async () => {
      expect(await alldid.isRegistered('abbbc.wallet')).toBe(false)
    })
  })
})
