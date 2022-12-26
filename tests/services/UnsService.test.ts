import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { UnsService } from '../../src/services/UnsService'

describe('UnsService', () => {
  const unsService = new UnsService(defaultCreateInstanceOptions.uns)

  describe('isSupported', () => {
    jest.setTimeout(30000)

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
        expect(await unsService.record('Brad.crypto', `address.eth`)).toEqual(
          {
            key: "address.eth", 
            label: "", 
            subtype: "eth", 
            ttl: 0, 
            type: "address", 
            value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8"
          }
        )
    })

    it('Brad.crypto\'s address records is valid', 
      async () => {
        expect(await unsService.records('Brad.crypto')).toEqual(
          [
            {
              key: "address.btc", 
              label: "", 
              subtype: "btc", 
              ttl: 0, 
              type: "address", 
              value: "bc1q359khn0phg58xgezyqsuuaha28zkwx047c0c3y"
            },
            {
              key: "address.eth", 
              label: "", 
              subtype: "eth", 
              ttl: 0, 
              type: "address", 
              value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8"
            },
            {
              key: "address.ada", 
              label: "", 
              subtype: "ada", 
              ttl: 0, 
              type: "address", 
              value: "DdzFFzCqrhsuwQKiR3CdQ1FzuPAydtVCBFTRdy9FPKepAHEoXCee2qrio975M4cEbqYwZBsWJTNyrJ8NLJmAReSwAakQEHWBEd2HvSS7"
            },
            {
              key: "profile.picture", 
              label: "", 
              subtype: "picture", 
              ttl: 0, 
              type: "profile", 
              value: "1/erc1155:0xc7e5e9434f4a71e6db978bd65b4d61d3593e5f27/14317"
            },
            {
              key: "profile.username", 
              label: "", 
              subtype: "username", 
              ttl: 0, 
              type: "profile", 
              value: "0x8912623832e174f2eb1f59cc3b587444d619376ad5bf10070e937e0dc22b9ffb2e3ae059e6ebf729f87746b2f71e5d88ec99c1fb3c7c49b8617e2520d474c48e1c"
            },
            {
              key: "profile.public_key", 
              label: "", 
              subtype: "public_key", 
              ttl: 0, 
              type: "profile", 
              value: "pqeBHabDQdCHhbdivgNEc74QO-x8CPGXq4PKWgfIzhY.7WJR5cZFuSyh1bFwx0GWzjmrim0T5Y6Bp0SSK0im3nI"
            },
            {
              key: "dweb.html_value", 
              label: "", 
              subtype: "html_value", 
              ttl: 0, 
              type: "dweb", 
              value: "QmTiqc12wo2pBsGa9XsbpavkhrjFiyuSWsKyffvZqVGtut"
            },
            {
              key: "dweb.redirect_domain_value", 
              label: "", 
              subtype: "redirect_domain_value", 
              ttl: 0, 
              type: "dweb", 
              value: "https://abbfe6z95qov3d40hf6j30g7auo7afhp.mypinata.cloud/ipfs/Qme54oEzRkgooJbCDr78vzKAWcv6DDEZqRhhDyDtzgrZP6"
            },
          ]
        )
    })

    it('Brad.crypto\'s addrs is valid', 
      async () => {
        expect(await unsService.addrs('Brad.crypto', ['eth',  'btc'])).toEqual(
          [
            {
              key: "address.eth", 
              label: "", 
              subtype: "eth", 
              ttl: 0, 
              type: "address", 
              value: "0x8aaD44321A86b170879d7A244c1e8d360c99DdA8",
              symbol: 'ETH'
            },
            {
              key: "address.btc", 
              label: "", 
              subtype: "btc", 
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
        expect(await unsService.addr('Brad.crypto', 'eth')).toEqual(
          {
            key: "address.eth", 
            label: "", 
            subtype: "eth", 
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

    it('Brad.crypto\'s reverse is invalid', 
      async () => {
        expect(await unsService.reverse('0x8aaD44321A86b170879d7A244c1e8d360c99DdA8')).toBe(null)
    })

    it('Brad.crypto\'s registryAddress is valid', 
      async () => {
        expect(await unsService.registryAddress('brad.crypto')).toBe('0xD1E5b0FF1287aA9f9A268759062E4Ab08b9Dacbe')
    })
  })
})
