import { decode } from "algo-msgpack-with-bigint";

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
