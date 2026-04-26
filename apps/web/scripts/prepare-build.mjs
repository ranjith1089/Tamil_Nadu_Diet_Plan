import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const staleTsConfig = resolve(process.cwd(), 'next.config.ts');

if (existsSync(staleTsConfig)) {
  rmSync(staleTsConfig);
  console.log('Removed stale next.config.ts to ensure Next.js uses next.config.mjs');
}
