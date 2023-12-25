import type { Ripemd160 } from '../lib';
import { instantiateRipemd160 } from '../lib';

import { benchmarkHashingFunction } from './hash.bench.helper';

benchmarkHashingFunction<Ripemd160>(
  'ripemd160',
  instantiateRipemd160(),
  'ripemd160'
);
