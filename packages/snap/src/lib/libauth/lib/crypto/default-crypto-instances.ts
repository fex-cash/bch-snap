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
