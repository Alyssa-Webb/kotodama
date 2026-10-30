/** content-lint: validates every lesson pack in content/packs (filled out in M1). */
import { readdirSync } from 'node:fs';

const packs = readdirSync('content/packs').filter((f) => f.endsWith('.json'));
console.log(`content-lint: ${packs.length} pack(s) found; full checks arrive in M1.`);
