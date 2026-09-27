#!/usr/bin/env node
import { createRequire } from 'module';
import { Command } from 'commander';
import { encrypt } from '../lib/encryptor.js';
import { decrypt } from '../lib/decryptor.js';
import { base64ify } from '../lib/base64ify.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();

program
  .name('azcryptor')
  .description('Hybrid AES-256 + RSA-2048 file encryption CLI')
  .version(version)
  .showHelpAfterError()
  .addHelpText(
    'after',
    `
Examples:
  $ azcryptor encrypt -i ./data.txt -o ./data.enc -m ./meta
  $ azcryptor decrypt -i ./data.enc -o ./data.txt
  $ azcryptor decrypt -i ./data.enc -o ./data.txt -m ./meta
  $ azcryptor base64ify ./data.enc

Docs:
  README.md (English)  |  README.fa.md (Persian)
`,
  );

program
  .command('encrypt')
  .alias('enc')
  .description('Encrypt a file and write key/iv/private key to --meta')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Encrypted output file path')
  .requiredOption('-m, --meta <dir>', 'Directory to save .key, .iv, and .private.pem')
  .addHelpText(
    'after',
    `
Example:
  $ azcryptor encrypt -i ./data.txt -o ./data.enc -m ./meta
`,
  )
  .action(encrypt);

program
  .command('decrypt')
  .alias('dec')
  .description('Decrypt a file (meta beside input by default, or from --meta)')
  .requiredOption('-i, --input <path>', 'Path to the encrypted file')
  .requiredOption('-o, --output <path>', 'Path to the decrypted output file')
  .option('-m, --meta <dir>', 'Directory containing .key, .iv, and .private.pem (default: beside input)')
  .addHelpText(
    'after',
    `
Examples:
  $ azcryptor decrypt -i ./data.enc -o ./data.txt
  $ azcryptor decrypt -i ./data.enc -o ./data.txt -m ./meta
`,
  )
  .action(decrypt);

program
  .command('base64ify')
  .description('Encode a file to .b64, .import.csv, and .import.json')
  .argument('<file>', 'File to encode')
  .addHelpText(
    'after',
    `
Example:
  $ azcryptor base64ify ./data.enc
`,
  )
  .action((file) => base64ify(file));

if (process.argv.length <= 2) {
  program.help();
} else {
  program.parse();
}
