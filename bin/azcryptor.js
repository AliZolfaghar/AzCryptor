#!/usr/bin/env node
import { encrypt } from '../lib/encryptor.js';
import { decrypt } from '../lib/decryptor.js';
import { Command } from 'commander';

const program = new Command();

program
  .name('azcryptor')
  .description('AzCryptor - Hybrid AES + RSA file encryption CLI')
  .version('1.0.6');

program
  .command('encrypt')
  .requiredOption('-i, --input <path>', 'مسیر فایل ورودی')
  .requiredOption('-o, --output <path>', 'مسیر فایل خروجی رمزنگاری‌شده')
  .requiredOption('-m, --meta <dir>', 'مسیر پوشه ذخیره فایل‌های کلید و IV')
  .action(encrypt);

program
  .command('decrypt')
  .requiredOption('-i, --input <path>', 'مسیر فایل رمزنگاری‌شده')
  .requiredOption('-o, --output <path>', 'مسیر فایل خروجی رمزگشایی‌شده')
  .action(decrypt);

program.parse();
