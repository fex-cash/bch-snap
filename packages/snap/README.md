# Bitcoin Cash Snap

A MetaMask Snap for Bitcoin Cash. The wallet website is [bchwallet](https://bchwallet.cash).

## Install
```sh
npm install bch-snap
```
or
```sh
yarn add bch-snap
```

## RPC Methods
`bch_getAddress`: Get current BCH cash address.

parameters:
```ts
{
  network: 'mainnet' | 'testnet'
}
```

`bch_switchAddress`: Switch bch address (based on BIP32) and cache index to browser (based on snap manage state).
The current address used by each DApp are stored independently of each other.

parameters:
```ts
{
  network: 'mainnet' | 'testnet'
}
```

`bch_showWIF`: Show wif private key in snap window.
This method **DOES NOT** read the user's private key, it is for display only.

parameters:
```ts
{
  network: 'mainnet' | 'testnet'
}
```

`bch_getPublicKey`: Get current BCH public key.

parameters:
```ts
{
  network: 'mainnet' | 'testnet'
}
```

`bch_signTransaction`: Sign for BCH unsigned transactions.

parameters:
```ts
{
  network: 'mainnet' | 'testnet';
  unsignedTx: string;
}
```

the original `unsignedTx` is an object like this:
```ts
import {type TransactionCommon} from '@bitauth/libauth';
import {type SourceOutput} from "mainnet-js";

export type UnsignedTx = {
  transaction  : TransactionCommon,
  sourceOutputs: SourceOutput[],
}
```

where `unsignedTx` parameter is a string using `pack()`, you can refer to the following code:
```ts
import { decode, encode } from "algo-msgpack-with-bigint";

export function pack(tx: any) {
  return base64EncodeURL(encode(tx))
}

export function unPack(tx: string) {
  const result = decode(base64DecodeURL(tx))
  return JSON.parse(JSON.stringify(result), function (key, value) {
    if (!!value && typeof value === "object") {
      const keys = Object.keys(value)
      const values = Object.values(value)

      const b = keys.every((v: any) => typeof Number(v) === "number") && values.every((v: any) => typeof v === "number")
      if (!b) {
        return value
      }
      return new Uint8Array(values as any);
    }
    if (["token", "nft"].includes(key) && value === null) {
      return undefined
    }
    if (["valueSatoshis", "amount"].includes(key)) {
      return BigInt(value)
    }
    return value;
  })
}

function base64EncodeURL(byteArray: Uint8Array) {
  return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
    return String.fromCharCode(val);
  }).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

function base64DecodeURL(b64urlstring: string) {
  return new Uint8Array(atob(b64urlstring.replace(/-/g, '+').replace(/_/g, '/')).split('').map(val => {
    return val.charCodeAt(0);
  }));
}
```
