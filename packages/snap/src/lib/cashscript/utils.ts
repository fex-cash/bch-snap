import { Transaction, generateSigningSerializationBCH } from "../libauth";

export interface LibauthOutput {
    lockingBytecode: Uint8Array;
    valueSatoshis: bigint;
    token?: LibauthTokenDetails;
}

export interface LibauthTokenDetails {
    amount: bigint; // the amount cannot be a JSON numeric and is instead written as a decimal string in the JSON output
    category: Uint8Array;
    nft?: {
        capability: 'none' | 'mutable' | 'minting';
        commitment: Uint8Array;
    };
}


export function createSighashPreimage(
    transaction: Transaction,
    sourceOutputs: LibauthOutput[],
    inputIndex: number,
    coveredBytecode: Uint8Array,
    hashtype: number,
): Uint8Array {
    const context = { inputIndex, sourceOutputs, transaction };
    const signingSerializationType = new Uint8Array([hashtype]);

    const sighashPreimage = generateSigningSerializationBCH(context, { coveredBytecode, signingSerializationType });

    return sighashPreimage;
}