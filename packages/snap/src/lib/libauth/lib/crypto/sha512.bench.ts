import type { Sha512 } from '../lib';
import { instantiateSha512 } from '../lib';

import { benchmarkHashingFunction } from './hash.bench.helper';

benchmarkHashingFunction<Sha512>('sha512', instantiateSha512(), 'sha512');
