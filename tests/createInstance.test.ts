import { createInstance } from '../src/createInstance'

describe('AllDID', () => {
  const alldid = createInstance()

  describe('isSupported', () => {
    it('support .bit .eth .bnb', async () => {
      expect(await alldid.isSupported('abc.bit')).toBe(true)
      expect(await alldid.isSupported('abc.eth')).toBe(true)
      expect(await alldid.isSupported('abc.bnb')).toBe(true)
    })

    it('do not support abc.bat', async () => {
      expect(await alldid.isSupported('abc.bat')).toBe(false)
    })
  })
})
