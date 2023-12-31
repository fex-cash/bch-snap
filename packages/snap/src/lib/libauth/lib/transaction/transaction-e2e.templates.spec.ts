import test from 'ava';

import { authenticationTemplateP2pkh } from '../lib';

import { twoOfTwoRecoverable } from './fixtures/template.2-of-2-recoverable.spec.helper';
import { twoOfThree } from './fixtures/template.2-of-3.spec.helper';
import { cashChannels } from './fixtures/template.cash-channels.spec.helper';
import { sigOfSig } from './fixtures/template.sig-of-sig.spec.helper';
import {
  cashChannelsJson,
  p2pkhJson,
  sigOfSigJson,
  twoOfThreeJson,
  twoOfTwoRecoverableJson,
} from './transaction-e2e.spec.helper';

const ignoreDefault = (anything: object) => ({
  ...anything,
  default: true,
});

test('example authentication templates are updated', (t) => {
  const solution =
    'Run "yarn gen:templates" to correct this issue. (Note: watch tasks don\'t always update cached JSON imports when the source file changes. You may need to restart tsc.)';
  t.deepEqual(
    ignoreDefault(twoOfTwoRecoverable),
    ignoreDefault(twoOfTwoRecoverableJson),
    `Inconsistency in twoOfTwoRecoverableJson. ${solution}`
  );
  t.deepEqual(
    ignoreDefault(twoOfThree),
    ignoreDefault(twoOfThreeJson),
    `Inconsistency in twoOfThreeJson. ${solution}`
  );
  t.deepEqual(
    ignoreDefault(cashChannels),
    ignoreDefault(cashChannelsJson),
    `Inconsistency in cashChannelsJson. ${solution}`
  );
  t.deepEqual(
    ignoreDefault(authenticationTemplateP2pkh),
    ignoreDefault(p2pkhJson),
    `Inconsistency in p2pkhJson. ${solution}`
  );
  t.deepEqual(
    ignoreDefault(sigOfSig),
    ignoreDefault(sigOfSigJson),
    `Inconsistency in sigOfSigJson. ${solution}`
  );
});
