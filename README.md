# Denames

[![NPM version](https://img.shields.io/npm/v/denames.svg?style=flat)](https://www.npmjs.com/package/denames)
![CI](https://github.com/zgayjjf/denames/workflows/CI/badge.svg?branch=master)
[![Bundle Size Minified](https://img.shields.io/bundlephobia/min/denames.svg)](https://bundlephobia.com/result?p=denames)
[![Bundle Size Minified Zipped](https://img.shields.io/bundlephobia/minzip/denames.svg)](https://bundlephobia.com/result?p=denames)
[![GitHub issues](https://img.shields.io/github/issues/zgayjjf/denames?label=Get%20Help)](https://github.com/zgayjjf/denames/issues/new)

- [Installing Resolution](README.md#installing-resolution)
- [Using Resolution](README.md#using-resolution)
- [Default Ethereum Providers](README.md#default-ethereum-providers)
- [Error Handling](README.md#error-handling)
- [Free advertising for integrated apps](README.md#free-advertising-for-integrated-apps)

> This is currently a fork of [@unstoppabledomains/resolution](https://github.com/unstoppabledomains/resolution), which brings back the support for ENS, and add support for [DAS](https://da.systems/).

Denames supports decentralized domains across four main zones:

- Decentralized Account Systems (DAS)
  - `.bit`
- Crypto Name Service (CNS)
  - `.crypto`
- Zilliqa Name Service (ZNS)
  - `.zil`
- Ethereum Name Service (ENS)
  - `.eth`
  - `.kred`
  - `.xyz`
  - `.luxe`

For more information, see detailed
[API Reference](https://unstoppabledomains.github.io/resolution/).

## Installing Resolution

Resolution can be installed with either `yarn` or `npm`.

```shell
yarn add denames
```

```shell
npm install denames --save
```

If you're interested in resolving domains via the command line, see our
[CLI section](#command-line-interface).

## Using Resolution

Create a new project.

```shell
mkdir denames && cd $_
yarn init -y
yarn add denames
```

### Look up a domain or account's crypto address

Create a new file in your project, `address.js`.

```javascript
const { default: Resolution } = require('denames');
const resolution = new Resolution();

function resolve(domain, currency) {
  resolution
    .addr(domain, currency)
    .then((address) => console.log(domain, 'resolves to', address))
    .catch(console.error);
}


resolve('dasloveckb.bit', 'CKB');
resolve('brad.crypto', 'ETH');
resolve('brad.zil', 'ZIL');
```

Execute the script.

```shell
$ node address.js
dasloveckb.bit resolves to ckt1qyqf6yms5my3p0fy52mllqwe3tvud0pysc5q24hqf2
brad.crypto resolves to 0x8aaD44321A86b170879d7A244c1e8d360c99DdA8
brad.zil resolves to zil1yu5u4hegy9v3xgluweg4en54zm8f8auwxu0xxj
```

### Find a custom record

Create a new file in your project, `custom-resolution.js`.

```javascript
const { default: Resolution } = require('denames');
const resolution = new Resolution();

function resolveCustomRecord(domain, record) {
  resolution
    .records(domain, [record])
    .then((value) => console.log(`Domain ${domain} ${record} is: ${value}`))
    .catch(console.error);
}

resolveCustomRecord('dasloveckb.bit', 'custom.location');
resolveCustomRecord('homecakes.crypto', 'custom.record.value');
```

## Default Ethereum Providers

Resolution provides zero-configuration experience by using built-in
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

## Autoconfiguration of blockchain network
In some scenarios system might not be flexible enough to easy distinguish between various Ethereum testnets on compile time.
For this case Resolution library provide a special async constructor which should be waited for 
`await Resolution.autonetwork(options)`. This method makes a JSON RPC "net_version" call to the provider to get the network id.

This method configures only Ens and Cns
Das is supported only on mainnet and aggron testnet, and will return mainnet instance calling `autonetwork()`
Zns is supported only on Zilliqa mainnet which is going to be used in any cases.
You can provide a configured provider or a blockchain url as in the following example:
```
await Resolution.autonetwork({
  cns: {provider},
  ens: {url}
});
```
## Error Handling

When resolution encounters an error it returns the error code instead of
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
   git clone https://github.com/zgayjjf/denames.git
   cd resolution
   ```

5. Install dependencies
   ```bash
   yarn install
   ```

### Internal config

#### To update uns config:
- Network config: `$ yarn network-config:pull`
- Supported keys: `$ yarn supported-keys:pull`
- Both configs: `$ yarn config:pull`


## Get help
[Please raise issue with github issues](https://github.com/DeAccountSystems/das-sdk/issues/new)