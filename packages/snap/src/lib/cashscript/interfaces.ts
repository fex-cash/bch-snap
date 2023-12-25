export enum SignatureAlgorithm {
    ECDSA = 0x00,
    SCHNORR = 0x01,
  }
  
  export enum HashType {
    SIGHASH_ALL = 0x01,
    SIGHASH_NONE = 0x02,
    SIGHASH_SINGLE = 0x03,
    SIGHASH_UTXOS = 0x20,
    SIGHASH_ANYONECANPAY = 0x80,
  }