import type { Sha1 } from '../lib';
import { instantiateSha1 } from '../lib';

import { benchmarkHashingFunction } from './hash.bench.helper';

benchmarkHashingFunction<Sha1>('sha1', instantiateSha1(), 'sha1');
