import type { Sha256 } from '../lib';
import { instantiateSha256 } from '../lib';

import { benchmarkHashingFunction } from './hash.bench.helper';

benchmarkHashingFunction<Sha256>('sha256', instantiateSha256(), 'sha256');
