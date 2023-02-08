import { createLiteInstance } from '../../src/createInstance'

describe('ApiService', () => {
  const alldid = createLiteInstance({
    baseUrl: 'http://localhost:3000',
    network: 'api'
  })

  describe('isSupported', () => {
    jest.setTimeout(30000)

    it('support Brad.crypto', async () => {
      expect(await alldid.isSupported('Brad.crypto')).toEqual({ is_supported: true })
    })

    it('Brad.crypto is registered', async () => {
      expect(await alldid.isRegistered('Brad.crypto')).toEqual({ is_registered: true })
    })

    it('scorpiocat51.crypto is available', async () => {
      expect(await alldid.isAvailable('scorpiocat51.crypto')).toEqual({ is_available: true })
    })

    it('Brad.crypto\'s owner is 0x8aaD44321A86b170879d7A244c1e8d360c99DdA8', async () => {
      expect(await alldid.owner('Brad.crypto')).toEqual({ owner: '0x8aaD44321A86b170879d7A244c1e8d360c99DdA8' })
    })

    it('Brad.crypto\'s tokenId is 0x756e4e998dbffd803c21d23b06cd855cdc7a4b57706c95964a37e24b47c10fc9', async () => {
      expect(await alldid.tokenId('Brad.crypto')).toEqual({ token_id: '0x756e4e998dbffd803c21d23b06cd855cdc7a4b57706c95964a37e24b47c10fc9' })
    })

    it('Brad.crypto\'s address record is valid',
      async () => {
        expect(await alldid.record('Brad.crypto', 'address.eth')).toEqual(
          {
            key: 'address.eth',
            label: '',
            subtype: 'eth',
            ttl: 0,
            type: 'address',
            value: '0x8aaD44321A86b170879d7A244c1e8d360c99DdA8'
          }
        )
      })

    it('Brad.crypto\'s records is valid',
      async () => {
        expect(await alldid.records('Brad.crypto')).toEqual(
          [
            {
              key: 'address.btc',
              type: 'address',
              subtype: 'btc',
              label: '',
              value: 'bc1q359khn0phg58xgezyqsuuaha28zkwx047c0c3y',
              ttl: 0
            },
            {
              key: 'address.eth',
              type: 'address',
              subtype: 'eth',
              label: '',
              value: '0x8aaD44321A86b170879d7A244c1e8d360c99DdA8',
              ttl: 0
            },
            {
              key: 'address.ada',
              type: 'address',
              subtype: 'ada',
              label: '',
              value: 'DdzFFzCqrhsuwQKiR3CdQ1FzuPAydtVCBFTRdy9FPKepAHEoXCee2qrio975M4cEbqYwZBsWJTNyrJ8NLJmAReSwAakQEHWBEd2HvSS7',
              ttl: 0
            },
            {
              key: 'profile.picture',
              type: 'profile',
              subtype: 'picture',
              label: '',
              value: '1/erc1155:0xc7e5e9434f4a71e6db978bd65b4d61d3593e5f27/14317',
              ttl: 0
            },
            {
              key: 'dweb.html_value',
              type: 'dweb',
              subtype: 'html_value',
              label: '',
              value: 'QmTiqc12wo2pBsGa9XsbpavkhrjFiyuSWsKyffvZqVGtut',
              ttl: 0
            },
            {
              key: 'dweb.redirect_domain_value',
              type: 'dweb',
              subtype: 'redirect_domain_value',
              label: '',
              value: 'https://abbfe6z95qov3d40hf6j30g7auo7afhp.mypinata.cloud/ipfs/Qme54oEzRkgooJbCDr78vzKAWcv6DDEZqRhhDyDtzgrZP6',
              ttl: 0
            },
            {
              key: 'profile.username',
              type: 'profile',
              subtype: 'username',
              label: '',
              value: '0x8912623832e174f2eb1f59cc3b587444d619376ad5bf10070e937e0dc22b9ffb2e3ae059e6ebf729f87746b2f71e5d88ec99c1fb3c7c49b8617e2520d474c48e1c',
              ttl: 0
            },
            {
              key: 'profile.public_key',
              type: 'profile',
              subtype: 'public_key',
              label: '',
              value: 'pqeBHabDQdCHhbdivgNEc74QO-x8CPGXq4PKWgfIzhY.7WJR5cZFuSyh1bFwx0GWzjmrim0T5Y6Bp0SSK0im3nI',
              ttl: 0
            }
          ]
        )
      })

    it('Brad.crypto\'s addrs is valid',
      async () => {
        expect(await alldid.addrs('Brad.crypto', ['eth', 'btc'])).toEqual(
          [
            {
              key: 'address.eth',
              label: '',
              subtype: 'eth',
              ttl: 0,
              type: 'address',
              value: '0x8aaD44321A86b170879d7A244c1e8d360c99DdA8',
              symbol: 'ETH'
            },
            {
              key: 'address.btc',
              label: '',
              subtype: 'btc',
              ttl: 0,
              type: 'address',
              value: 'bc1q359khn0phg58xgezyqsuuaha28zkwx047c0c3y',
              symbol: 'BTC'
            }
          ]
        )
      })

    it('Brad.crypto\'s addr is valid',
      async () => {
        expect(await alldid.addr('Brad.crypto', 'eth')).toEqual(
          {
            key: 'address.eth',
            label: '',
            subtype: 'eth',
            ttl: 0,
            type: 'address',
            value: '0x8aaD44321A86b170879d7A244c1e8d360c99DdA8',
            symbol: 'ETH'
          },
        )
      })

    it('Brad.crypto\'s registryAddress is valid',
      async () => {
        expect(await alldid.registryAddress('brad.crypto')).toEqual({ registry_address: '0xD1E5b0FF1287aA9f9A268759062E4Ab08b9Dacbe' })
      })
  })
})
