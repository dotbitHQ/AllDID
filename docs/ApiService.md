# ApiService

The all-in-one DID SDK Lite.

## Table of Contents
- [Create Instance](#create-instance)
- [Error Code](#error-code)

## Create Instance
To create a AllDID lite instance. You must pass your customized config to override it.

### Parameters
- config: `ApiServiceOptions`
  - baseUrl: `string`,
  - (Optional) network: `string`

### Return Value
`ApiService`
### Example
```javascript
const { createLiteInstance } = require('alldid')

// To create a AllDID lite instance by using customized config
const alldid = createLiteInstance({
  baseUrl: 'localhost:3000'
});
```

## Error Code
AllDID Lite implements the resolution service by requesting the Web server interface.

During this process, network request errors may occur, and the response error codes are as follows:

```js
// Invalid parameter in request
InvalidParameter = 4000, 

// The domain name in the request is not registered
UnregisteredName = 4001, 

// Record does not exist
RecordIsNotFound = 4002,

// Unsupported domain name
UnsupportedName = 4003,

// Unsupported method
UnsupportedMethod = 4004,

// Unknown Error
Unknown = 5000,
```
