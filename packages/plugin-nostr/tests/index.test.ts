import { createInstance } from 'alldid'
import { PluginNostr } from '../src/index'

const alldid = createInstance()
alldid.installPlugin(new PluginNostr())

describe('nostrs works', function () {
  it('should work for .bit', async function () {
    const records = await alldid.nostrs('aliez.bit')
    expect(records).toEqual([{
      key: 'profile.nostr',
      type: 'profile',
      subtype: 'nostr',
      label: 'aliez',
      value: 'npub1p0ew5ln6hq4c20l7zftkwyrnn03php05zl8aydntugg74cu8m28sfk25c6',
      ttl: 300
    }])
  })

  it('should work for ens', async function () {
    const records = await alldid.nostrs('aliez.eth')
    expect(records).toEqual([{
      key: 'nostr',
      type: '',
      subtype: 'nostr',
      label: '',
      value: 'npub1p0ew5ln6hq4c20l7zftkwyrnn03php05zl8aydntugg74cu8m28sfk25c6',
      ttl: 0
    }])
  })
})

describe('nostr works', function () {
  it('should work for .bit', async function () {
    const records = await alldid.nostrs('aliez.bit')
    expect(records).toEqual({
      key: 'profile.nostr',
      type: 'profile',
      subtype: 'nostr',
      label: 'aliez',
      value: 'npub1p0ew5ln6hq4c20l7zftkwyrnn03php05zl8aydntugg74cu8m28sfk25c6',
      ttl: 300
    })
  })

  it('should work for ens', async function () {
    const records = await alldid.nostrs('aliez.eth')
    expect(records).toEqual({
      key: 'nostr',
      type: '',
      subtype: 'nostr',
      label: '',
      value: 'npub1p0ew5ln6hq4c20l7zftkwyrnn03php05zl8aydntugg74cu8m28sfk25c6',
      ttl: 0
    })
  })
})
