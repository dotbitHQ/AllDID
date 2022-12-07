import { defaultCreateInstanceOptions } from '../src/createInstance'
import { DotbitService } from '../src/services/DotbitService'
import { EnsService } from '../src/services/EnsService'
import { SIDService } from '../src/services/SIDService'
import { AllDID } from '../src/AllDID'

describe('AllDID', () => {
  const alldid = new AllDID()

  alldid.installService(new DotbitService(defaultCreateInstanceOptions.dotbit))
  alldid.installService(new EnsService(defaultCreateInstanceOptions.ens))
  alldid.installService(new SIDService(defaultCreateInstanceOptions.sid))

  describe('isSupported', () => {
    it('support .bit .eth .bnb', () => {
      expect(alldid.isSupported('abc.bit')).toBe(true)
      expect(alldid.isSupported('abc.eth')).toBe(true)
      expect(alldid.isSupported('abc.bnb')).toBe(true)
    })

    it('do not support abc.bat', () => {
      expect(alldid.isSupported('abc.bat')).toBe(false)
    })
  })
})
