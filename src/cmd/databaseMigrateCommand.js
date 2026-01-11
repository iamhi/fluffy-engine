import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { migrate } from '../db/migrations/migrate.js';

const argv = yargs(hideBin(process.argv))
  .option('changelog', {
    alias: 'c',
    type: 'string',
    description: 'Select the changelog from which to start',
  })
  .help()
  .alias('help', 'h').argv;

const { changelog } = argv;

console.log('--------------------------');
console.log('--- Starting migration ---');
console.log('--------------------------');
console.log('\n');

migrate(changelog);

console.log('\n');
console.log('--------------------------');
console.log('--- Finished migration ---');
console.log('--------------------------');
