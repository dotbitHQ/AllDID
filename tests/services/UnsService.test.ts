import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { UnsService } from '../../src/services/UnsService'

describe('UnsService', () => {
  const unsService = new UnsService(defaultCreateInstanceOptions.uns)

  describe('isSupported', () => {
    it('support Brad.crypto', () => {
      expect(unsService.isSupported('Brad.crypto')).toBe(true)
    })

    it('do not support Brad.eth', () => {
      expect(unsService.isSupported('Brad.eth')).toBe(false)
    })

    it('Brad.crypto is registered', async () => {
      expect(await unsService.isRegistered('Brad.crypto')).toBe(true)
    })

    it('scorpiocat51.crypto is available', async () => {
      expect(await unsService.isAvailable('scorpiocat51.crypto')).toBe(true)
    })

    it('Brad.crypto\'s owner is 0x8aaD44321A86b170879d7A244c1e8d360c99DdA8', async () => {
      expect(await unsService.owner('Brad.crypto')).toEqual('0x8aaD44321A86b170879d7A244c1e8d360c99DdA8')
    })

    it('Brad.crypto\'s tokenId is 0x756e4e998dbffd803c21d23b06cd855cdc7a4b57706c95964a37e24b47c10fc9', async () => {
      expect(await unsService.tokenId('Brad.crypto')).toEqual('0x756e4e998dbffd803c21d23b06cd855cdc7a4b57706c95964a37e24b47c10fc9')
    })

    it('Brad.crypto\'s address record is valid', 
      async () => {
        expect(await unsService.record('Brad.crypto', `address.crypto.ETH.address`)).toEqual(
          {
            key: "address.crypto.ETH.address", 
            label: "", 
            subtype: "crypto.ETH.address", 
            ttl: 0, 
            type: "address", 
            value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8"
          }
        )
    })

    it('Brad.crypto\'s address records is valid', 
      async () => {
        expect(await unsService.records('Brad.crypto', [`address.crypto.ETH.address`])).toEqual(
          [{
            key: "address.crypto.ETH.address", 
            label: "", 
            subtype: "crypto.ETH.address", 
            ttl: 0, 
            type: "address", 
            value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8"
          }]
        )
    })

    it('Brad.crypto\'s addrs is valid', 
      async () => {
        expect(await unsService.addrs('Brad.crypto', ['ETH',  'BTC'])).toEqual(
          [
            {
              key: "address.crypto.ETH.address", 
              label: "", 
              subtype: "crypto.ETH.address", 
              ttl: 0, 
              type: "address", 
              value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8",
              symbol: 'ETH'
            },
            {
              key: "address.crypto.BTC.address", 
              label: "", 
              subtype: "crypto.BTC.address", 
              ttl: 0, 
              type: "address", 
              value: "bc1q359khn0phg58xgezyqsuuaha28zkwx047c0c3y",
              symbol: 'BTC'
            }
          ]
        )
    })

    it('Brad.crypto\'s addr is valid', 
      async () => {
        expect(await unsService.addr('Brad.crypto', 'ETH')).toEqual(
          {
            key: "address.crypto.ETH.address", 
            label: "", 
            subtype: "crypto.ETH.address", 
            ttl: 0, 
            type: "address", 
            value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8",
            symbol: 'ETH'
          }, 
        )
    })

    it('Brad.crypto\'s dweb is valid', 
      async () => {
        expect(await unsService.dweb('Brad.crypto')).toEqual('QmTiqc12wo2pBsGa9XsbpavkhrjFiyuSWsKyffvZqVGtut')
    })

    it('Brad.crypto\'s dwebs is valid', 
      async () => {
        expect(await unsService.dwebs('Brad.crypto')).toEqual(['QmTiqc12wo2pBsGa9XsbpavkhrjFiyuSWsKyffvZqVGtut'])
    })

    // it('Brad.crypto\'s reverse is invalid', 
    //   async () => {
    //     expect(await unsService.reverse('0x8aaD44321A86b170879d7A244c1e8d360c99DdA8')).toBe(null)
    // })

    it('Brad.crypto\'s registryAddress is valid', 
      async () => {
        expect(await unsService.registryAddress('brad.crypto')).toBe('0xD1E5b0FF1287aA9f9A268759062E4Ab08b9Dacbe')
    })
  })
})
