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
  
  describe('isRegistered', () => {
    it('scorpiocat51.sol is available', async () => {
      expect(await alldid.isAvailable('scorpiocat51.sol')).toBe(true)
    })
    it('leonx.bnb is available', async () => {
      expect(await alldid.isAvailable('leonx.bnb')).toBe(true)
    })

    it('scorpiocat51.nft is not available', async () => {
      expect(await alldid.isAvailable('scorpiocat51.nft')).toBe(false)
    })
  })
  
  describe('owner', () => {
    it('the owner of Brad.crypto is valid', async () => {
      expect(await alldid.owner('Brad.crypto')).toEqual('0x8aaD44321A86b170879d7A244c1e8d360c99DdA8')
    })
    it('the owner of leon.bnb is valid', async () => {
      expect(await alldid.owner('leon.bnb')).toEqual('0xec2F69E6EA001615297367b9F1B6c9e25f695E0a')
    })

    it('the owner of BBrraadd.bnb is invalid', async () => {
      await expect(alldid.owner('BBrraadd.bnb')).rejects.toThrow(`UnregisteredName: sid: Unregistered domain name BBrraadd.bnb`)
    })

    it('the owner of BBrraadd.sol is invalid', async () => {
      await expect(alldid.owner('BBrraadd.sol')).rejects.toThrow(`UnregisteredName: solana: Unregistered domain name BBrraadd.sol`)
    })
  })
})
