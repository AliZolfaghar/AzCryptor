import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { generateKeyPairSync, randomBytes, createCipheriv, publicEncrypt } from 'crypto';
import { createProgressTransform } from './progress.js';
import { printReport } from './report.js';

export async function encrypt({ input, output, meta }) {
  if (!fs.existsSync(input)) {
    console.error('Input file not found:', input);
    process.exit(1);
  }

  if (!fs.existsSync(meta)) {
    fs.mkdirSync(meta, { recursive: true });
  }

  const inputAbs = path.resolve(input);
  const outputAbs = path.resolve(output);
  const metaAbs = path.resolve(meta);
  const totalBytes = fs.statSync(inputAbs).size;

  const aesKey = randomBytes(32);
  const iv = randomBytes(16);

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  });

  const encryptedKey = publicEncrypt(publicKey, aesKey);
  const cipher = createCipheriv('aes-256-cbc', aesKey, iv);

  const baseName = path.basename(outputAbs);
  const keyPath = path.join(metaAbs, baseName + '.key');
  const ivPath = path.join(metaAbs, baseName + '.iv');
  const privateKeyPath = path.join(metaAbs, baseName + '.private.pem');

  fs.writeFileSync(keyPath, encryptedKey);
  fs.writeFileSync(ivPath, iv);
  fs.writeFileSync(privateKeyPath, privateKey);

  const progress = createProgressTransform(totalBytes, 'Encrypting');

  try {
    await pipeline(
      fs.createReadStream(inputAbs),
      progress,
      cipher,
      fs.createWriteStream(outputAbs),
    );
  } catch (error) {
    console.error('Encryption failed:', error.message);
    process.exit(1);
  }

  printReport([
    ['Status', 'Encrypted'],
    ['Operation', 'encrypt'],
    ['Input', inputAbs],
    ['Output', outputAbs],
    ['Meta dir', metaAbs],
    ['Key', keyPath],
    ['IV', ivPath],
    ['Private', privateKeyPath],
  ]);
}
