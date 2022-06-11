# Denames

[![NPM version](https://img.shields.io/npm/v/denames.svg?style=flat)](https://www.npmjs.com/package/denames)
![CI](https://github.com/DeAccountSystems/denames/workflows/CI/badge.svg?branch=master)
[![Bundle Size Minified](https://img.shields.io/bundlephobia/min/denames.svg)](https://bundlephobia.com/result?p=denames)
[![Bundle Size Minified Zipped](https://img.shields.io/bundlephobia/minzip/denames.svg)](https://bundlephobia.com/result?p=denames)
[![Get help in Issues](https://img.shields.io/badge/Get%20help%20on-Discord-blueviolet)](https://discord.gg/b6ZVxSZ9Hn)

- [Installing Denames](README.md#installing-denames)
- [Using Denames](README.md#using-denames)
- [Default Ethereum Providers](README.md#default-ethereum-providers)
- [Error Handling](README.md#error-handling)
- [Free advertising for integrated apps](README.md#free-advertising-for-integrated-apps)

Denames is a library for interacting with blockchain accounts and domains. It can be used to retrieve crypto addresses on blockchain, users social contacts and custom records. 

Denames supports decentralized accounts/domains across below zones:

- .bit (Previously DAS)
  - `.bit`

- Zilliqa Name Service (ZNS)
  - `.zil`

- Ethereum Name Service (ENS)
  - `.eth`
  - `.kred`
  - `.xyz`
  - `.luxe`

- Unstoppable Name Service (UNS)
  - `.crypto`
  - `.nft`
  - `.blockchain`
  - `.bitcoin`
  - `.coin`
  - `.wallet`
  - `.888`
  - `.dao`
  - `.x`
  - ...

### Background
The Denames is currently built on top of `@unstoppabledomain/resolution` version `v5.0.1`, and added support for [.bit](https://did.id) alongside with ENS, UNS, ZNS.

Denames introduced a method which will return a list of crypto addresses for the given chain:
```typescript
import { Resolution } from 'denames'

const resolution = new Resolution()
const account = 'dastodamoon.bit'

interface DasAccountRecord {
  key: string; // This will always be the corresponding key for each account systems
  value: string;
  label: string; // This will always be empty string `''` for all accounts other than .bit
  ttl: number; // This will always be 0 for all accounts other than .bit
  avatar: string; // This will always be empty string `''` for all accounts other than .bit
}

resolution.addrList(account, 'ckb').then(records => {
  console.log(`account ${account} has ${records.length} CKB address records as below:`)
  
  records.forEach((record: DasAccountRecord, i) => {
    const { key, value, label, ttl, avatar } = record
    console.log(`CKB address ${i}: ${value}, label: ${label}, with a ttl ${ttl}`)
  })
})

```
output:
```shell
account dastodamoon.bit has 2 CKB address records as below:
CKB address 0: ckb1qyqzeajw8xtqgvw0d6q8ey7sysvv7evxvwqqvnvmwu, label: BusinessAddress, with a ttl 300
CKB address 1: ckb1qyq9j48k60dll8xjw04u2uu6vvd0fypqjkhqq84pmt, label: PersonalAddress, with a ttl 300
```

It will return an empty list `[]` when no records are set.

> For other methods from `@unstoppabledomain/resolution`, please see [@unstoppabledomains/resolution API Reference](https://unstoppabledomains.github.io/resolution/)

## Installing Denames

Denames can be installed with either `yarn` or `npm`.

```shell
yarn add denames
```

```shell
npm install denames
```

If you're interested in resolving domains via the command line, see our
[CLI section](#command-line-interface).

## Using Denames

Create a new project.

```shell
mkdir denames && cd $_
yarn init -y
yarn add denames
```

### Look up account's crypto addresses

Create a new file in your project, `address.js`.

> It is recommended that developers set up their own [.bit Indexer](https://github.com/dotbitHQ/das-account-indexer), see [.bit Backend Integration](https://docs.did.id/developers/integration-backend#das-account-indexer) for details.

```javascript
const { Resolution } = require('denames');
const resolution = new Resolution({
  sourceConfig: {
    das: {
      url: 'https://indexer-v1.did.id', // .bit indexer JSON-RPC endpoint. You can use the indexer provided by .bit team for test.
      network: 'mainnet',
    }
  }
});

function resolve(domain, currency) {
  resolution
    .addrList(domain, currency)
    .then((records) => console.log(domain, 'resolves to', records[0]?.value))
    .catch(console.error);
}

resolve('dastodamoon.bit', 'CKB');
resolve('brad.zil', 'ZIL');
```

Execute the script.

```shell
$ node address.js
dastodamoon.bit resolves to ckb1qyqzeajw8xtqgvw0d6q8ey7sysvv7evxvwqqvnvmwu
brad.zil resolves to zil1yu5u4hegy9v3xgluweg4en54zm8f8auwxu0xxj
```

### Command Line Interface

To use denames via the command line install the package globally.

```shell
yarn global add denames
```

```shell
npm install -g denames
```

By default, the CLI uses Infura as its primary gateway to the Ethereum
blockchain. If you'd like to override this default and set another provider you
can do so using the `--ethereum-url` flag.

For example:

```shell
denames --ethereum-url https://mainnet.infura.io/v3/${secret} -d udtestdev-usdt.crypto -a
```

Use the `-h` or `--help` flag to see all the available CLI options.

## Default Ethereum Providers

Denames provides zero-configuration experience by using built-in
production-ready [Infura](http://infura.io/) endpoint by default.  
Default Ethereum provider is free to use without restrictions and rate-limits
for `CNS (.crypto domains)` resolution.  
To resolve `ENS` domains on production it's recommended to change Ethereum
provider.  
Default provider can be changed by changing constructor options
`new Resolution(options)` or by using one of the factory methods:

- `Resolution.infura()`
- `Resolution.fromWeb3Version1Provider()`
- `Resolution.fromEthersProvider()`
- etc.

To see all constructor options and factory methods check
[Unstoppable API reference](https://unstoppabledomains.github.io/resolution).

## Autoconfiguration of blockchain network
In some scenarios system might not be flexible enough to easy distinguish between various Ethereum testnets on compile time.
For this case Denames library provide a special async constructor which should be waited for 
`await Resolution.autonetwork(options)`. This method makes a JSON RPC "net_version" call to the provider to get the network id.

This method configures only Ens and Cns, Zns is supported only on Zilliqa mainnet which is going to be used in any cases.
You can provide a configured provider or a blockchain url as in the following example:
```
await Resolution.autonetwork({
  cns: {provider},
  ens: {url}
});
```
## Error Handling

When denames encounters an error it returns the error code instead of
stopping the process. Keep an eye out for return values like `RECORD_NOT_FOUND`.

## Development

Use these commands to set up a local development environment (**macOS Terminal**
or **Linux shell**).

1. Install `nvm`

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
   ```

2. Install concrete version of `node.js`

   ```bash
   nvm install 12.12.0
   ```

3. Install `yarn`
   ```bash
   npm install -g yarn
   ```
4. Clone the repository

   ```bash
   git clone https://github.com/DeAccountSystems/denames.git
   cd denames
   ```

5. Install dependencies
   ```bash
   yarn install
   ```

### Internal config

#### To update:
- Network config: `$ yarn network-config:pull`
- Supported keys: `$ yarn supported-keys:pull`
- Both configs: `$ yarn config:pull`

## Get help

[Join our discord community](https://discord.gg/B7aa5fXq) and ask questions.
