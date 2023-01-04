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
    it('support .bit .eth .bnb .sol .crypto', async () => {
      expect(await alldid.isSupported('abc.bit')).toBe(true)
      expect(await alldid.isSupported('abc.eth')).toBe(true)
      expect(await alldid.isSupported('abc.bnb')).toBe(true)
      expect(await alldid.isSupported('abc.sol')).toBe(true)
      expect(await alldid.isSupported('abc.crypto')).toBe(true)
    })

    it('do not support abc.bat', async () => {
      expect(await alldid.isSupported('abc.bat')).toBe(false)
    })
  })

  describe('isRegistered', () => {
    it('jeffx.bit Brad.crypto 🍍.sol has been registered', async () => {
      expect(await alldid.isRegistered('jeffx.bit')).toBe(true)
      expect(await alldid.isRegistered('Brad.crypto')).toBe(true)
      expect(await alldid.isRegistered('🍍.sol')).toBe(true)
      expect(await alldid.isRegistered('leon.bnb')).toBe(true)
      expect(await alldid.isRegistered('leon.eth')).toBe(true)
    })

    it('abbccbc.wallet(.bnb .eth .bit .sol) are not registered', async () => {
      expect(await alldid.isRegistered('abbbc.wallet')).toBe(false)
      expect(await alldid.isRegistered('abbccbc.bnb')).toBe(false)
      expect(await alldid.isRegistered('abbccbc.eth')).toBe(false)
      expect(await alldid.isRegistered('abbccbc.bit')).toBe(false)
      expect(await alldid.isRegistered('abbccbc.sol')).toBe(false)
    })
  })

  describe('isAvailable', () => {
    it('leonttt.sol(.bit .bnb .eth .crypto) is available', async () => {
      expect(await alldid.isAvailable('scorpiocat51.sol')).toBe(true)
      expect(await alldid.isAvailable('leonx.bnb')).toBe(true)
      expect(await alldid.isAvailable('leonttt.bit')).toBe(true)
      expect(await alldid.isAvailable('leonttt.eth')).toBe(true)
      expect(await alldid.isAvailable('leonttt.crypto')).toBe(true)
    })

    it('leon.sol(.wallet .eth .bnb .bit) are not available', async () => {
      expect(await alldid.isAvailable('leon.sol')).toBe(false)
      expect(await alldid.isAvailable('leon.wallet')).toBe(false)
      expect(await alldid.isAvailable('leon.eth')).toBe(false)
      expect(await alldid.isAvailable('leon.bnb')).toBe(false)
      expect(await alldid.isAvailable('leon.bit')).toBe(false)
    })
  })

  describe('owner', () => {
    it('the owner of leon.wallet(.sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.owner('leon.bit')).toEqual('0x0403d6d288db8908b5ff21b60d347c6e450eb828')
      expect(await alldid.owner('leon.wallet')).toEqual('0x98e32B218Bd1d8F3C267466b8d7635501dBdd1C1')
      expect(await alldid.owner('leon.sol')).toEqual('FvfD9ziv4CuPj5BSD278jy6sX8Q2GTZeQZNfQ89eE4P9')
      expect(await alldid.owner('leon.eth')).toEqual('0xfA45C6991a2C3d74ada3A279E21135133CE3Da8A')
      expect(await alldid.owner('leon.bnb')).toEqual('0xec2F69E6EA001615297367b9F1B6c9e25f695E0a')
    })

    it('the owner of BBrraadd.bit(.sol .crypto .bnb .eth) is invalid', async () => {
      await expect(alldid.owner('BBrraadd.bit')).rejects.toThrow('UnregisteredName: dotbit: Unregistered domain name BBrraadd.bit')
      await expect(alldid.owner('BBrraadd.sol')).rejects.toThrow('UnregisteredName: solana: Unregistered domain name BBrraadd.sol')
      await expect(alldid.owner('BBrraadd.crypto')).rejects.toThrow('UnregisteredName: uns: Unregistered domain name BBrraadd.crypto')
      await expect(alldid.owner('BBrraadd.bnb')).rejects.toThrow('UnregisteredName: sid: Unregistered domain name BBrraadd.bnb')
      await expect(alldid.owner('BBrraadd.eth')).rejects.toThrow('UnregisteredName: ens: Unregistered domain name BBrraadd.eth')
    })
  })

  describe('manager', () => {
    it('the manager of leon.wallet(.sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.manager('leon.bit')).toEqual('0x0403d6d288db8908b5ff21b60d347c6e450eb828')
      // // uns sns is not supported manager method
      // expect(await alldid.manager('leon.wallet')).rejects.toThrow(`UnsupportedMethod: Unsupported Method`)
      // expect(await alldid.manager('leon.sol')).rejects.toThrow(`UnsupportedMethod: Unsupported Method`)
      expect(await alldid.manager('leon.eth')).toEqual('0xfA45C6991a2C3d74ada3A279E21135133CE3Da8A')
      expect(await alldid.manager('leon.bnb')).toEqual('0xec2F69E6EA001615297367b9F1B6c9e25f695E0a')
    })

    it('the manager of BBrraadd.bit(.sol .crypto .bnb .eth) is invalid', async () => {
      await expect(alldid.manager('BBrraadd.bit')).rejects.toThrow('UnregisteredName: dotbit: Unregistered domain name BBrraadd.bit')
      // await expect(alldid.manager('BBrraadd.sol')).rejects.toThrow(`UnsupportedMethod: Unsupported Method`)
      // await expect(alldid.manager('BBrraadd.crypto')).rejects.toThrow(`UnsupportedMethod: Unsupported Method`)
      await expect(alldid.manager('BBrraadd.bnb')).rejects.toThrow('UnregisteredName: sid: Unregistered domain name BBrraadd.bnb')
      await expect(alldid.manager('BBrraadd.eth')).rejects.toThrow('UnregisteredName: ens: Unregistered domain name BBrraadd.eth')
    })
  })

  describe('tokenId', () => {
    it('the tokenId of leon.wallet(.sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.tokenId('leon.bit')).toEqual('0x38ae79fc97c608c6a9707d5df4bf44d1a4d8d6ab')
      expect(await alldid.tokenId('leon.wallet')).toEqual('0x4b31d3721d4a91a3808983158bbe3294923a12d8ee371290dee158af23506ffa')
      expect(await alldid.tokenId('leon.sol')).toEqual('3iV8KnUZkM78tUAwWb9V9c7FWaFxCrqpC3tFzywrEayg')
      expect(await alldid.tokenId('leon.eth')).toEqual('0xfA45C6991a2C3d74ada3A279E21135133CE3Da8A')
      expect(await alldid.tokenId('leon.bnb')).toEqual('0xec2F69E6EA001615297367b9F1B6c9e25f695E0a')
    })

    it('the tokenId of BBrraadd.crypto(.bnb .eth) is invalid', async () => {
      // nameService will generate tokenId for name mapping
    })
  })

  describe('record', () => {
    it('the record of (.wallet .sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.record('leonx.bit', 'address.eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 300, type: 'address', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' })
      expect(await alldid.record('🍍.sol', 'address.eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6' })
      expect(await alldid.record('leon.wallet', 'address.eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', value: '0x98e32b218bd1d8f3c267466b8d7635501dbdd1c1' })
      expect(await alldid.record('leont.eth', 'address.eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' })
      expect(await alldid.record('leon.bnb', 'address.bnb')).toEqual({ key: 'address.bnb', label: '', subtype: 'bnb', ttl: 0, type: 'address', value: '0xec2F69E6EA001615297367b9F1B6c9e25f695E0a' })
    })

    it('the record of (.crypto .sol .crypto .bnb .eth) is invalid', async () => {
      await expect(alldid.record('BBrraadd.bit', 'address.bit')).rejects.toThrow('UnregisteredName: dotbit: Unregistered domain name BBrraadd.bit')
      await expect(alldid.record('BBrraadd.sol', 'address.sol')).rejects.toThrow('UnregisteredName: solana: Unregistered domain name BBrraadd.sol')
      await expect(alldid.record('BBrraadd.crypto', 'address.eth')).rejects.toThrow('UnregisteredName: uns: Unregistered domain name BBrraadd.crypto')
      await expect(alldid.record('BBrraadd.bnb', 'address.bnb')).rejects.toThrow('UnregisteredName: sid: Unregistered domain name BBrraadd.bnb')
      await expect(alldid.record('BBrraadd.eth', 'address.eth')).rejects.toThrow('UnregisteredName: ens: Unregistered domain name BBrraadd.eth')
    })
  })

  describe('records', () => {
    it('the record of (.wallet .sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.records('leonx.bit', ['address.eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 300, type: 'address', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' }])
      expect(await alldid.records('🍍.sol', ['address.eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6' }])
      expect(await alldid.records('leon.wallet', ['address.eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', value: '0x98e32b218bd1d8f3c267466b8d7635501dbdd1c1' }])
      expect(await alldid.records('leont.eth', ['address.eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' }])
      expect(await alldid.records('leon.bnb', ['address.bnb'])).toEqual([{ key: 'address.bnb', label: '', subtype: 'bnb', ttl: 0, type: 'address', value: '0xec2F69E6EA001615297367b9F1B6c9e25f695E0a' }])
    })

    it('the records of (.crypto .sol .crypto .bnb .eth) is invalid', async () => {
      await expect(alldid.records('BBrraadd.bit', ['address.bit'])).rejects.toThrow('UnregisteredName: dotbit: Unregistered domain name BBrraadd.bit')
      await expect(alldid.records('BBrraadd.sol', ['address.sol'])).rejects.toThrow('UnregisteredName: solana: Unregistered domain name BBrraadd.sol')
      await expect(alldid.records('BBrraadd.crypto', ['address.eth'])).rejects.toThrow('UnregisteredName: uns: Unregistered domain name BBrraadd.crypto')
      await expect(alldid.records('BBrraadd.bnb', ['address.bnb'])).rejects.toThrow('UnregisteredName: sid: Unregistered domain name BBrraadd.bnb')
      await expect(alldid.records('BBrraadd.eth', ['address.eth'])).rejects.toThrow('UnregisteredName: ens: Unregistered domain name BBrraadd.eth')
    })
  })

  describe('addr', () => {
    it('the addr of rr (.wallet .sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.addr('leonx.bit', 'eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 300, type: 'address', symbol: 'ETH', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' })
      expect(await alldid.addr('🍍.sol', 'eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', symbol: 'ETH', value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6' })
      expect(await alldid.addr('leon.wallet', 'eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', symbol: 'ETH', value: '0x98e32b218bd1d8f3c267466b8d7635501dbdd1c1' })
      expect(await alldid.addr('leont.eth', 'eth')).toEqual({ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', symbol: 'ETH', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' })
      expect(await alldid.addr('leon.bnb', 'bnb')).toEqual({ key: 'address.bnb', label: '', subtype: 'bnb', ttl: 0, type: 'address', symbol: 'BNB', value: '0xec2F69E6EA001615297367b9F1B6c9e25f695E0a' })
    })

    it('the addr of rr (.crypto .sol .crypto .bnb .eth) is invalid', async () => {
      expect(await alldid.addr('leonx.bit', 'rr')).toBe(null)
      expect(await alldid.addr('🍍.sol', 'rr')).toBe(null)
      expect(await alldid.addr('leon.wallet', 'rr')).toBe(null)
      expect(await alldid.addr('leont.eth', 'rr')).toBe(null)
      expect(await alldid.addr('leon.bnb', 'rr')).toBe(null)
    })
  })

  describe('addrs', () => {
    it('the addrs of eth (.wallet .sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.addrs('leonx.bit', ['eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 300, type: 'address', symbol: 'ETH', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' }])
      expect(await alldid.addrs('🍍.sol', ['eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', symbol: 'ETH', value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6' }])
      expect(await alldid.addrs('leon.wallet', ['eth'])).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', symbol: 'ETH', value: '0x98e32b218bd1d8f3c267466b8d7635501dbdd1c1' }])
      expect(await alldid.addrs('leont.eth', 'eth')).toEqual([{ key: 'address.eth', label: '', subtype: 'eth', ttl: 0, type: 'address', symbol: 'ETH', value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa' }])
      expect(await alldid.addrs('leon.bnb', 'bnb')).toEqual([{ key: 'address.bnb', label: '', subtype: 'bnb', ttl: 0, type: 'address', symbol: 'BNB', value: '0xec2F69E6EA001615297367b9F1B6c9e25f695E0a' }])
    })

    it('the addrs of rr (.crypto .sol .crypto .bnb .eth) is invalid', async () => {
      expect(await alldid.addrs('leonx.bit', ['rr'])).toStrictEqual([])
      expect(await alldid.addrs('🍍.sol', ['rr'])).toStrictEqual([])
      expect(await alldid.addrs('leon.wallet', ['rr'])).toStrictEqual([])
      expect(await alldid.addrs('leont.eth', ['rr'])).toStrictEqual([])
      expect(await alldid.addrs('leon.bnb', ['rr'])).toStrictEqual([])
    })
  })

  describe('registryAddress', () => {
    it('the registryAddress of eth (.wallet .sol .eth .bnb .bit) is valid', async () => {
      expect(await alldid.registryAddress('🍍.sol')).toEqual('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx')
      expect(await alldid.registryAddress('leon.wallet')).toEqual('0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f')
      expect(await alldid.registryAddress('leont.eth')).toEqual('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e')
      expect(await alldid.registryAddress('leon.bnb')).toEqual('0x08CEd32a7f3eeC915Ba84415e9C07a7286977956')
    })

    it('the registryAddress of rr (.crypto .sol .crypto .bnb .eth) is invalid', async () => {
      await expect(alldid.registryAddress('leonx.bit')).rejects.toThrow('UnsupportedMethod: Unsupported Method')
    })
  })
})
