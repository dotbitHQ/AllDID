import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { DotbitService } from '../../src/services/DotbitService'

describe('DotbitService', () => {
  const dotbitService = new DotbitService(defaultCreateInstanceOptions.dotbit)

  describe('isSupported', () => {
    it('support abc.bit', () => {
      expect(dotbitService.isSupported('abc.bit')).toBe(true)
    })

    it('do not support abc.eth', () => {
      expect(dotbitService.isSupported('abc.eth')).toBe(false)
    })

    it('leonx.bit has been registered', async () => {
      expect(await dotbitService.isRegistered('leonx.bit')).toBe(true)
    })

    it('leonx.bit is not available', async () => {
      expect(await dotbitService.isAvailable('leonx.bit')).toBe(false)
    })

    it('leonx.bit is owned by 0xc72b6f66017246d6a7f159f5c2bf358188ad9eca', async () => {
      expect(await dotbitService.owner('leonx.bit')).toBe('0xc72b6f66017246d6a7f159f5c2bf358188ad9eca')
    })

    it('The manager of leonx.bit is 0xc72b6f66017246d6a7f159f5c2bf358188ad9eca', async () => {
      expect(await dotbitService.manager('leonx.bit')).toBe('0xc72b6f66017246d6a7f159f5c2bf358188ad9eca')
    })

    it('leonx.bit\'s record is valid', async () => {
      expect(await dotbitService.record('leonx.bit', 'address.BSC')).toEqual(
        {
          key: 'address.bsc',
          label: '',
          subtype: 'bsc',
          ttl: 300,
          type: 'address',
          value: '0xc72b6f66017246d6a7f159f5c2bf358188ad9eca'
        }
      )
    })

    it('leonx.bit\'s records is valid', async () => {
      expect(await dotbitService.record('leonx.bit', 'address.BSC')).toEqual(
        [{
          key: 'address.bsc',
          label: '',
          subtype: 'bsc',
          ttl: 300,
          type: 'address',
          value: '0xc72b6f66017246d6a7f159f5c2bf358188ad9eca'
        }]
      )
    })

    it('leonx.bit\'s address is 0xc72b6f66017246d6a7f159f5c2bf358188ad9eca', async () => {
      expect((await dotbitService.addr('leonx.bit', 'bsc'))).toEqual(
        {
          key: 'address.bsc',
          label: '',
          subtype: 'bsc',
          ttl: 300,
          type: 'address',
          value: '0xc72b6f66017246d6a7f159f5c2bf358188ad9eca',
          symbol: 'BSC'
        }
      )
    })

    it('leonx.bit\'s addrs is valid', async () => {
      expect((await dotbitService.addrs('leonx.bit', ['bsc', 'eth']))).toEqual(
        [
          {
            key: 'address.bsc',
            label: '',
            subtype: 'bsc',
            ttl: 300,
            type: 'address',
            value: '0xc72b6f66017246d6a7f159f5c2bf358188ad9eca',
            symbol: 'BSC'
          },
          {
            key: 'address.eth',
            label: '',
            subtype: 'eth',
            ttl: 300,
            type: 'address',
            value: '0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa',
            symbol: 'ETH'
          }
        ]
      )
    })

    it('leonx.bit\'s dweb is valid', async () => {
      expect((await dotbitService.dweb('leonx.bit'))).toEqual(
        'QmcGV8fimB7aeBxnDqr7bSSLUWLeyFKUukGqDhWnvriQ3T',
      )
    })

    it('leonx.bit\'s dwebs is valid', async () => {
      expect((await dotbitService.dwebs('leonx.bit'))).toEqual(
        ['QmcGV8fimB7aeBxnDqr7bSSLUWLeyFKUukGqDhWnvriQ3T'],
      )
    })

    it('0x1d643fac9a463c9d544506006a6348c234da485f\'s reverse is valid', async () => {
      expect((await dotbitService.reverse('0x1d643fac9a463c9d544506006a6348c234da485f', 'eth'))).toEqual(
        'jeffx.bit',
      )
    })
  })
})
