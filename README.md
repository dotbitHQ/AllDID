<h1 align="center">AllDID.js</h2>
<p align="center">The all-in-one DID SDK, resolving all decentralized name(Web3 Name).</p>
<div align="center">

![NPM](https://img.shields.io/npm/l/alldid) ![npm](https://img.shields.io/npm/v/alldid)
</div>

> This is a whole new version of denames. If you are looking for the source code of npm package [denames](https://www.npmjs.com/package/denames)(Deprecated), please check out the branch [denames](https://github.com/dotbitHQ/denames/tree/denames).

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [CHANGELOG](#changelog)
- [Plugins](#plugins)
- [FAQ](#faq)
- [Get Help](#get-help)
- [Contribute](#contribute)
- [License](#license)

## Features
- Check if the given name is a valid DID name.(e.g. **isSupported, isRegistered, isAvailable**.)
- Query DID name info (e.g. **owner, manager**.)
- Query DID name records (e.g. **tokenId, records, addresses, dwebs, reverse and registryAddress**.)
- Supported decentralized name suffix:
  - Ethereum Name Service - ENS
    - .eth
  - .bit - DOTBIT
    - .bit
  - Solana Name Service - SNS
    - .sol
  - Unstoppable Domains Name Service - UNS. Please, refer to the [Top Level Domains List](https://resolve.unstoppabledomains.com/supported_tlds).
    - .crypto
    - .bitcoin
    - .blockchain
    - .dao
    - .nft
    - .888
    - .wallet
    - .x
    - .klever
    - .zil
    - .hi
  - Space ID - SID
    - .bnb

## Getting Started

First, you need to install `alldid` using [`npm`](https://www.npmjs.com/package/alldid)
```bash
npm install alldid --save
```
or [`yarn`](https://yarnpkg.com/package/alldid).
```bash
yarn add alldid
```

Then, you need to import AllDID.js SDK in your code and create an instance before interacting with it:
```javascript
// For CommonJS
const { createInstance } = require('alldid')
const alldid = createInstance()
```

```javascript
// For ES Module
import { createInstance } from 'alldid'
const alldid = createInstance()
```

Now you could perform various operations using AllDID.js SDK. Here is a simple example:
```javascript
// Get DID name address
alldid.addrs('leonx.bit', ['eth']).then(console.log)
alldid.addrs('leon.wallet', ['eth']).then(console.log)
alldid.addrs('🍍.sol', ['eth']).then(console.log)
```
A sample result would be like:
```javascript
// leonx.bit
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "symbol":"ETH",
    "ttl": 300,
    "type": "address",
    "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa"
  }
]

// leon.wallet
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "symbol":"ETH",
    "ttl": 0,
    "type": "address",
    "value": "0x98e32b218bd1d8f3c267466b8d7635501dbdd1c1"
  }
]

// 🍍.sol
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "symbol":"ETH",
    "ttl": 0,
    "type": "address",
    "value": "0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"
  }
]
```

## CHANGELOG
TBD

## API Documentation
### Table of Contents
- [installService(service)](#installserviceservice)
- [isSupported(name)](#issupportedname)
- [isRegistered(name)](#isregisteredname)
- [isAvailable(name)](#isavailablename)
- [owner(name)](#ownername)
- [manager(name)](#managername)
- [tokenId(name)](#tokenidname)
- [records(name, keys?)](#recordsname-keys)
- [addrs(name, currencyTicker?)](#addrsname-currencyticker)
- dwebs(name)(todo)
- reverse(address)(todo)
- [registryAddress(name)](#registryaddressname)

#### installService(service)
Used to install a NamingService and add it to the services array.
> Note: For a better development experience, we suggest you using createInstance to initialize AllDID, since it has already set a bunch of default services.
##### Parameter
service: NamingService

NamingService is a concrete implementation compatible with a specific Domain Name System.
##### Return Value
N/A
##### Example
```javascript
const { AllDID } = require('alldid');

// To create a new AllDID instance.
const alldid = new AllDID()

alldid.installService(new DotbitService(defaultCreateInstanceOptions.dotbit))
```

#### isSupported(name)
Used to check if a DID name is supported by install's NamingService. Returns true if any NamingService supports the DID name, false otherwise.
##### Parameter
name: string

##### Return Value
boolean
##### Example
```javascript
// Check if the given name is a valid DID name.
alldid.isSupported('abc.bit').then(console.log)

// The printed result would be like:
true
```

#### isRegistered(name)
It is used to query whether the DID name has been registered, if it has been registered, it returns true, otherwise it returns false.
##### Parameter
name: string

##### Return Value
boolean
##### Example
```javascript
// Check if the given name is registered
alldid.isRegistered('jeffx.bit').then(console.log)

// The printed result would be like:
true
```
#### isAvailable(name)
Used to query whether the DID name is available, return true if available, otherwise return false.
##### Parameter
name: string

##### Return Value
boolean
##### Example
```javascript
// Check if it is available to register
alldid.isAvailable('jeffx.bit').then(console.log)

// The printed result would be like:
true
```

#### owner(name)
The address used to query the owner of the DID name, the format of the address varies according to different domain name systems.
##### Parameter
name: string

##### Return Value
address string
##### Example
```javascript
// Query the address of the owner of the name
alldid.owner('leon.bit').then(console.log)
alldid.owner('leon.sol').then(console.log)

// The printed result would be like:
// leon.bit
"0x0403d6d288db8908b5ff21b60d347c6e450eb828"
// leon.sol
"FvfD9ziv4CuPj5BSD278jy6sX8Q2GTZeQZNfQ89eE4P9"
```

#### manager(name)
Query the address of the manager of the DID name. The address format is different according to different domain name systems.

> Note: If this method is not supported, an "Unsupported Method" exception will be thrown
##### Parameter
name: string

##### Return Value
address string
##### Example
```javascript
// Query the address of the manager of the name
alldid.manager('leon.bit').then(console.log)
alldid.manager('leon.eth').then(console.log)

// The printed result would be like:
// leon.bit
"0x0403d6d288db8908b5ff21b60d347c6e450eb828"
// leon.eth
"0xfA45C6991a2C3d74ada3A279E21135133CE3Da8A"
```

#### tokenId(name)
Query the TokenID of the DID name.

The TokenID format is different according to different domain name systems.

##### Parameter
name: string

##### Return Value
hex string
##### Example
```javascript
// Query the tokenId of the name
alldid.tokenId('leon.bit').then(console.log)
alldid.tokenId('leon.sol').then(console.log)

// The printed result would be like:
// leon.bit
"0x38ae79fc97c608c6a9707d5df4bf44d1a4d8d6ab"
// leon.sol
"3iV8KnUZkM78tUAwWb9V9c7FWaFxCrqpC3tFzywrEayg"
```

#### records(name, keys?)
Query all records of DID name, return an array.

##### Parameter
name: string
keys?: string | string[]

keys are string or string[] type, a set of labels separated by `.` support the following formats:
```ts
enum KeyPrefix {
  Address= 'address',
  Profile= 'profile',
  Dweb = 'dweb',
  Text = 'text'
} 

// eth adress
'address.eth'
// uns dweb
'dweb.ipfs.hash'
// uns profile
'profile.social'
```

##### Return Value
RecordItem[]
##### Example
```javascript
// Query the records of the name
alldid.records('leon.bit', 'address.eth').then(console.log)
alldid.records('leont.eth', ['address.eth']).then(console.log)
alldid.records('Brad.crypto').then(console.log)

// The printed result would be like:
// leon.bit
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "ttl": 300,
    "type": "address",
    "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa"
  }
]

// leon.eth
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "ttl": 0,
    "type": "address",
    "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa"
  }
]

// Brad.crypto
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
    key: "dweb.html_value", 
    label: "", 
    subtype: "html_value", 
    ttl: 0, 
    type: "dweb", 
    value: "QmTiqc12wo2pBsGa9XsbpavkhrjFiyuSWsKyffvZqVGtut"
  }
]
```
#### addrs(name, currencyTicker?)
Query the addresses of DID name.

##### Parameter
name: string
currencyTicker?: string | string[]

##### Return Value
RecordItemAddr[]

##### Example
```javascript
// Query the addresses of the name
alldid.addrs('leonx.bit', ['eth']).then(console.log)
alldid.addrs('Brad.crypto', ['eth',  'btc']).then(console.log)

// The printed result would be like:
// leonx.bit
[{
  "key": "address.eth",
  "label": "",
  "subtype": "eth",
  "ttl": 300,
  "type": "address",
  "symbol": "ETH",
  "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa"
}]

// Brad.crypto
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
```

#### registryAddress(name)
Query the registry address of DID name.

> Note: If this method is not supported, an "Unsupported Method" exception will be thrown
##### Parameter
name: string

##### Return Value
address string
##### Example
```javascript
// Query the registry address of the name
alldid.registryAddress('leon.wallet').then(console.log)
alldid.registryAddress('🍍.sol').then(console.log)

// The printed result would be like:
// leon.wallet
"0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f"
// 🍍.sol
"58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
```

## Plugins
TBD
## FAQ
TBA

## Get Help
If you have questions or need help with AllDID.js, there are several ways to get assistance:
- Join the .bit community on [Discord channel](https://discord.gg/fVppR7z4ht).
- File [issues](https://github.com/dotbitHQ/AllDID/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) on the GitHub repository for AllDID.js.

## Contribute
We welcome contributions to AllDID.js! If you are interested in helping to improve the project, there are several ways you can contribute:
- Report bugs or suggest improvements by opening an [issue](https://github.com/dotbitHQ/AllDID/issues) on the GitHub repository.
- Submit a pull request with your changes to the code.

Please note that AllDID.js SDK is still under development, so any contribution (including pull requests) is welcome.

## License
AllDID.js (including **all** dependencies) is protected under the [MIT License](LICENSE). This means that you are free to use, modify, and distribute the software as long as you include the original copyright and license notice. Please refer to the license for the full terms.