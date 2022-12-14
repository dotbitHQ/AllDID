import { createInstance } from '../src/createInstance'

describe('AllDID', () => {
  const alldid = createInstance()

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
