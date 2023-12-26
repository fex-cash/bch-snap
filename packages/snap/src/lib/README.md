# Reasons for copying code from third-party libraries

## libauth
### Source Repository
- Repo: https://github.com/bitauth/libauth
- Tags: v2.0.0-alpha.8

### Issues
- The path to import in `libauth` code has a `.js` suffix, which causes the import to be incorrect when packaging on the snap side.
- The snap builds package failed because of top level await.

### How to solve
- Download `libauth` source code
- Remove the `.js` suffix from all files
- Modify `default-crypto-instances.ts`
```typescript
import { instantiateRipemd160 } from './ripemd160';
import { instantiateSecp256k1 } from './secp256k1';
import { instantiateSha1 } from './sha1';
import { instantiateSha256 } from './sha256';
import { instantiateSha512 } from './sha512';

let [sha1, sha256, sha512, ripemd160, secp256k1] = [] as any

Promise.all([
  instantiateSha1(),
  instantiateSha256(),
  instantiateSha512(),
  instantiateRipemd160(),
  instantiateSecp256k1(),
]).then(data => {
  [sha1, sha256, sha512, ripemd160, secp256k1] = data
})

export { ripemd160, secp256k1, sha1, sha256, sha512 };
```

## cashscript
### Source Repository
- Repo: https://github.com/CashScript/cashscript
- Tags: v0.8.1

### Issues
- To resolve dependency issues

### How to solve
- Just copy the code related to the signatures
