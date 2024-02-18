# Bitcoin Cash Wallet

A MetaMask Snap for Bitcoin Cash. The wallet website is [bchwallet](https://bchwallet.cash).


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
This method DOES NOT return the user's private key to the DApp. It is for MetaMask’s display only.

parameters:
```ts
{
  network: 'mainnet' | 'testnet'
}
```

`bch_getPublicKey`: Get current BCH cash address’s public key.

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

`bch_signTransactionForArg`:Sign for BCH unsigned transactions.
This method is intended to solve the problem of passing `SignatureTemplate` parameter.

`SignatureTemplate` can be found here: https://github.com/CashScript/cashscript/blob/v0.8.2/packages/cashscript/src/SignatureTemplate.ts#L4

parameters:
```ts
{
  network: 'mainnet' | 'testnet';
  unsignedTx: string;
}
```

the original `unsignedTx` is an object like this:

`TransactionCommon` can be found here: https://github.com/bitauth/libauth/blob/master/src/lib/message/transaction-types.ts#L245

`SourceOutput` can be found here: https://github.com/mainnet-cash/mainnet-js/blob/1.1.28/packages/mainnet-js/src/wallet/model.ts#L317
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
export function pack(tx: any) {
  return JSON.stringify(tx, (_, value) => typeof value === "bigint" ? `${value.toString()}` : value)
}

export function unPack(txStr: string) {
  return JSON.parse(txStr, function (key, value) {
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
```
