/* global Buffer */
/* eslint-disable functional/no-let, @typescript-eslint/init-declarations, functional/no-expression-statement, functional/no-conditional-statement, functional/no-return-void*/
import { createHash, randomBytes } from 'crypto';

import asmCrypto from 'asmcrypto';
import test from 'ava';
import bcrypto from 'bcrypto';
import suite from 'chuhai';
import hashJs from 'hash';

import type { HashFunction } from '../lib';

export const benchmarkHashingFunction = <T extends HashFunction>(
  hashFunctionName: string,
  hashFunctionPromise: Promise<T>,
  nodeJsAlgorithm: 'ripemd160' | 'sha1' | 'sha256' | 'sha512'
) => {
  const singlePassNodeBenchmark = (inputLength: number) => {
    const bcryptoAlgorithm = nodeJsAlgorithm.toUpperCase() as
      | 'RIPEMD160'
      | 'SHA1'
      | 'SHA256'
      | 'SHA512';
    test(`node: ${hashFunctionName}: hash a ${inputLength}-byte input`, async (t) => {
      const hashFunction = await hashFunctionPromise;
      await suite(t.title, (s) => {
        let message: Uint8Array;
        let hash: Uint8Array | readonly number[] | null;
        /*
         * we let Node use the message as a Node buffer
         * (may slightly overestimate Node native performance)
         */
        let nodeJsBuffer: Buffer;
        const nextCycle = () => {
          message = randomBytes(inputLength);
          nodeJsBuffer = Buffer.from(message);
        };
        nextCycle();
        s.bench('libauth', () => {
          hash = hashFunction.hash(message);
        });
        s.bench('hash', () => {
          hash = hashJs[nodeJsAlgorithm]().update(message).digest();
        });
        s.bench('bcoin', () => {
          hash = bcrypto[bcryptoAlgorithm].digest(Buffer.from(message));
        });
        s.bench('node native', () => {
          hash = createHash(nodeJsAlgorithm).update(nodeJsBuffer).digest();
        });
        if (nodeJsAlgorithm !== 'ripemd160') {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const Algorithm =
            nodeJsAlgorithm === 'sha1'
              ? asmCrypto.Sha1
              : nodeJsAlgorithm === 'sha256'
              ? asmCrypto.Sha256
              : asmCrypto.Sha512;
          s.bench('asmcrypto', () => {
            const instance = new Algorithm();
            hash = instance.process(message).finish().result;
          });
        }
        s.cycle(() => {
          if (hash === null) {
            t.fail(
              `asmcrypto failed to produce a hash for message: ${message.toString()}`
            );
          } else {
            t.deepEqual(new Uint8Array(hash), hashFunction.hash(message));
            nextCycle();
          }
        });
      });
    });
  };

  const mb = 1_000_000;

  const incrementalNodeBenchmark = (totalInput: number, chunkSize: number) => {
    test(`node: ${hashFunctionName}: incrementally hash a ${
      totalInput / mb
    }MB input in ${chunkSize / mb}MB chunks`, async (t) => {
      const hashFunction = await hashFunctionPromise;
      await suite(t.title, (s) => {
        let message: Uint8Array;
        let messageChunks: readonly Uint8Array[];
        let nodeJsChunks: readonly Buffer[];
        let hash: Uint8Array | readonly number[] | null;
        const nextCycle = () => {
          message = randomBytes(totalInput);
          const chunkCount = Math.ceil(message.length / chunkSize);
          messageChunks = Array.from({ length: chunkCount }).map((_, index) =>
            message.slice(index * chunkSize, index * chunkSize + chunkSize)
          );
          nodeJsChunks = messageChunks.map((chunk) => Buffer.from(chunk));
        };
        nextCycle();
        s.bench('libauth', () => {
          hash = hashFunction.final(
            messageChunks.reduce(
              (state, chunk) => hashFunction.update(state, chunk),
              hashFunction.init()
            )
          );
        });
        s.bench('hash', () => {
          hash = messageChunks
            .reduce(
              (state, chunk) => state.update(chunk),
              hashJs[nodeJsAlgorithm]()
            )
            .digest();
        });
        s.bench('node native', () => {
          hash = nodeJsChunks
            .reduce(
              (state, chunk) => state.update(chunk),
              createHash(nodeJsAlgorithm)
            )
            .digest();
        });
        if (nodeJsAlgorithm !== 'ripemd160') {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const Algorithm =
            nodeJsAlgorithm === 'sha1'
              ? asmCrypto.Sha1
              : nodeJsAlgorithm === 'sha256'
              ? asmCrypto.Sha256
              : asmCrypto.Sha512;
          s.bench('asmcrypto', () => {
            const instance = new Algorithm();
            hash = instance.process(message).finish().result;
          });
        }
        s.cycle(() => {
          if (hash === null) {
            t.fail(
              `asmcrypto failed to produce a hash for message: ${message.toString()}`
            );
          } else {
            t.deepEqual(new Uint8Array(hash), hashFunction.hash(message));
            nextCycle();
          }
        });
      });
    });
  };

  /* eslint-disable @typescript-eslint/no-magic-numbers */
  singlePassNodeBenchmark(32);
  singlePassNodeBenchmark(100);
  singlePassNodeBenchmark(1_000);
  singlePassNodeBenchmark(10_000);

  incrementalNodeBenchmark(mb * 32, mb);
  /* eslint-enable @typescript-eslint/no-magic-numbers */
};
