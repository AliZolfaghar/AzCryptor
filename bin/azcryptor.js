#!/usr/bin/env node
import { encrypt } from '../lib/encryptor.js';
import { decrypt } from '../lib/decryptor.js';
import { Command } from 'commander';

const program = new Command();

program
  .name('azcryptor')
  .description('AzCryptor - Hybrid AES + RSA file encryption CLI')
  .version('1.0.7');

program
  .command('encrypt')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Encrypted output file path')
  .requiredOption('-m, --meta <dir>', 'Directory to save key and IV files')
  .action(encrypt);

program
  .command('decrypt')
  .requiredOption('-i, --input <path>', 'Path to the encrypted file')
  .requiredOption('-o, --output <path>', 'Path to the decrypted output file')
  .action(decrypt);

program
  .command('enc')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Encrypted output file path')
  .requiredOption('-m, --meta <dir>', 'Directory to save key and IV files')
  .action(encrypt);

program
  .command('dec')
  .requiredOption('-i, --input <path>', 'Path to the encrypted file')
  .requiredOption('-o, --output <path>', 'Path to the decrypted output file')
  .action(decrypt);

  program.parse();
