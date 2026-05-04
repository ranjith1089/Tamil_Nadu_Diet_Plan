import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const staleConfigs = ['next.config.ts', 'next.config.mjs'];

for (const file of staleConfigs) {
  const fullPath = resolve(process.cwd(), file);
  if (existsSync(fullPath)) {
    rmSync(fullPath);
    console.log(`Removed stale ${file} to prevent unsupported Next.js config resolution.`);
  }
}
