import { defaultCreateInstanceOptions } from '../../src/createInstance'
import { SolanaService } from '../../src/services/SolanaService'

describe('SolanaService', () => {
  const solanaService = new SolanaService(defaultCreateInstanceOptions.solana)

  describe('isSupported', () => {
    jest.setTimeout(30000)

    it('support abc.sol', () => {
      expect(solanaService.isSupported('abc.sol')).toBe(true)
    })

    it('do not support abc.bit', () => {
      expect(solanaService.isSupported('abc.bit')).toBe(false)
    })

    it('leon.sol is registered', async () => {
      expect(await solanaService.isRegistered('leon.sol')).toBe(true)
    })

    it('scorpiocat.sol is available', async () => {
      expect(await solanaService.isAvailable('scorpiocat.sol')).toBe(true)
    })

    it('leon.sol\'s owner is FvfD9ziv4CuPj5BSD278jy6sX8Q2GTZeQZNfQ89eE4P9', async () => {
      expect(await solanaService.owner('leon.sol')).toBe('FvfD9ziv4CuPj5BSD278jy6sX8Q2GTZeQZNfQ89eE4P9')
    })

    it('🍍.sol\'s ETH record is valid', async () => {
      expect(await solanaService.record('🍍.sol', 'address.eth')).toEqual(
        {
          key: 'address.eth',
          label: '',
          subtype: 'eth',
          ttl: 0,
          type: 'address',
          value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6'
        })
<<<<<<< HEAD
    })

    it('🍍.sol\'s ETH records is valid', async () => {
      expect(await solanaService.records('🍍.sol', ['address.eth'])).toEqual(
        [
          {
            key: 'address.eth',
            label: '',
            subtype: 'eth',
            ttl: 0,
            type: 'address',
            value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6'
          }
        ]
      )
=======
>>>>>>> e416421b4904479b3ee76b8ca09c17adec9c3157
    })

    it('🍍.sol\'s addr is CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2', async () => {
      const address = await solanaService.addr('🍍.sol', 'sol')
      expect(address).toEqual(
        {
          key: 'address.sol',
          label: '',
          subtype: 'sol',
          ttl: 0,
          type: 'address',
          value: 'CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2',
<<<<<<< HEAD
          symbol: 'SOL'
=======
          symbol: 'sol'
>>>>>>> e416421b4904479b3ee76b8ca09c17adec9c3157
        })
    })

    it('🍍.sol\'s addrs is valid', async () => {
      expect(await solanaService.addrs('🍍.sol')).toEqual([
        {
          key: 'address.eth',
          type: 'address',
          subtype: 'eth',
          symbol: 'ETH',
          label: '',
          value: '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6',
          ttl: 0
        },
        {
          key: 'address.btc',
          type: 'address',
          subtype: 'btc',
          symbol: 'BTC',
          label: '',
          value: '3JfBcjv7TbYN9yQsyfcNeHGLcRjgoHhV3z',
          ttl: 0
        },
        {
          key: 'address.sol',
          type: 'address',
          subtype: 'sol',
          symbol: 'SOL',
          label: '',
          value: 'CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2',
          ttl: 0
        },
        {
          key: 'address.ltc',
          type: 'address',
          subtype: 'ltc',
          symbol: 'LTC',
          label: '',
          value: 'MK6deR3Mi6dUsim9M3GPDG2xfSeSAgSrpQ',
          ttl: 0
        },
        {
          key: 'address.doge',
          type: 'address',
          subtype: 'doge',
          symbol: 'DOGE',
          label: '',
          value: 'DC79kjg58VfDZeMj9cWNqGuDfYfGJg9DjZ',
          ttl: 0
        }
      ])
    })

    it('🍍.sol\'s dweb is QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR', async () => {
      expect(await solanaService.dweb('🍍.sol')).toEqual('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR')
    })

    it('FvfD9ziv4CuPj5BSD278jy6sX8Q2GTZeQZNfQ89eE4P9\'s reverse is only1solana.sol', async () => {
      expect(await solanaService.reverse('FvfD9ziv4CuPj5BSD278jy6sX8Q2GTZeQZNfQ89eE4P9')).toEqual('only1solana.sol')
    })
  })
})
