/* eslint-disable functional/no-expression-statement */
/**
 * This script produces a `*reasonson` file for every VMB test that is
 * expected to fail. Run it with: `yarn gen:vmb-tests`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type {
  AuthenticationVirtualMachineBCH,
  AuthenticationVirtualMachineBCHCHIPs,
  VmbTest,
} from '../lib';
import {
  createVirtualMachineBCH2022,
  createVirtualMachineBCH2023,
  createVirtualMachineBCHCHIPs,
  hexToBin,
  readTransactionCommon,
  readTransactionNonTokenAware,
  readTransactionOutputs,
  readTransactionOutputsNonTokenAware,
} from '../lib';

// eslint-disable-next-line functional/no-return-void
const writeReasonsFile = (
  invalidJsonPath: string,
  reasonsPath: string,
  {
    supportsTokens,
    vm,
  }: {
    supportsTokens: boolean;
    vm: AuthenticationVirtualMachineBCH | AuthenticationVirtualMachineBCHCHIPs;
  }
) => {
  const vmbTests = JSON.parse(
    readFileSync(invalidJsonPath, { encoding: 'utf8' })
  ) as VmbTest[];
  const getReason = ({
    sourceOutputsHex,
    txHex,
  }: {
    sourceOutputsHex: string;
    txHex: string;
  }) => {
    const sourceOutputsRead = (
      supportsTokens
        ? readTransactionOutputs
        : readTransactionOutputsNonTokenAware
    )({ bin: hexToBin(sourceOutputsHex), index: 0 });
    const transactionRead = (
      supportsTokens ? readTransactionCommon : readTransactionNonTokenAware
    )({ bin: hexToBin(txHex), index: 0 });
    if (typeof sourceOutputsRead === 'string') return sourceOutputsRead;
    if (typeof transactionRead === 'string') return transactionRead;
    const sourceOutputs = sourceOutputsRead.result;
    const transaction = transactionRead.result;
    return vm.verify({ sourceOutputs, transaction });
  };
  const reasons = vmbTests.reduce<{ [shortId: string]: string | true }>(
    (aggReasons, testCase) => {
      const [shortId, , , , txHex, sourceOutputsHex] = testCase;
      return {
        ...aggReasons,
        [shortId]: getReason({ sourceOutputsHex, txHex }),
      };
    },
    {}
  );
  writeFileSync(reasonsPath, JSON.stringify(reasons), { encoding: 'utf8' });
};

const basePath = 'src/lib/vmb-tests/generated/bch';
const rel = (path: string) => resolve(basePath, path);

writeReasonsFile(
  rel('./bch_vmb_tests_2022_invalidon'),
  rel('./bch_vmb_tests_2022_invalid_reasonson'),
  { supportsTokens: false, vm: createVirtualMachineBCH2022(false) }
);
writeReasonsFile(
  rel('./bch_vmb_tests_2022_nonstandardon'),
  rel('./bch_vmb_tests_2022_nonstandard_reasonson'),
  { supportsTokens: false, vm: createVirtualMachineBCH2022(true) }
);
writeReasonsFile(
  rel('./CHIPs/bch_vmb_tests_before_chip_cashtokens_invalidon'),
  rel('./CHIPs/bch_vmb_tests_before_chip_cashtokens_invalid_reasonson'),
  { supportsTokens: false, vm: createVirtualMachineBCH2022(false) }
);
writeReasonsFile(
  rel('./CHIPs/bch_vmb_tests_before_chip_cashtokens_nonstandardon'),
  rel('./CHIPs/bch_vmb_tests_before_chip_cashtokens_nonstandard_reasonson'),
  { supportsTokens: false, vm: createVirtualMachineBCH2022(true) }
);
writeReasonsFile(
  rel('./CHIPs/bch_vmb_tests_chip_cashtokens_invalidon'),
  rel('./CHIPs/bch_vmb_tests_chip_cashtokens_invalid_reasonson'),
  { supportsTokens: true, vm: createVirtualMachineBCH2023(false) }
);
writeReasonsFile(
  rel('./CHIPs/bch_vmb_tests_chip_cashtokens_nonstandardon'),
  rel('./CHIPs/bch_vmb_tests_chip_cashtokens_nonstandard_reasonson'),
  { supportsTokens: true, vm: createVirtualMachineBCH2023(true) }
);
writeReasonsFile(
  rel('./CHIPs/bch_vmb_tests_chip_loops_invalidon'),
  rel('./CHIPs/bch_vmb_tests_chip_loops_invalid_reasonson'),
  { supportsTokens: true, vm: createVirtualMachineBCHCHIPs(false) }
);
writeReasonsFile(
  rel('./CHIPs/bch_vmb_tests_chip_loops_nonstandardon'),
  rel('./CHIPs/bch_vmb_tests_chip_loops_nonstandard_reasonson'),
  { supportsTokens: true, vm: createVirtualMachineBCHCHIPs(true) }
);
