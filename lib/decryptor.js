import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { privateDecrypt, createDecipheriv } from 'crypto';
import { createProgressTransform } from './progress.js';
import { printReport } from './report.js';

function resolveMetaPaths(input, meta) {
  const inputAbs = path.resolve(input);
  const baseName = path.basename(inputAbs);

  if (meta) {
    const metaAbs = path.resolve(meta);
    return {
      metaAbs,
      keyPath: path.join(metaAbs, baseName + '.key'),
      ivPath: path.join(metaAbs, baseName + '.iv'),
      privateKeyPath: path.join(metaAbs, baseName + '.private.pem'),
    };
  }

  const metaAbs = path.dirname(inputAbs);
  return {
    metaAbs,
    keyPath: inputAbs + '.key',
    ivPath: inputAbs + '.iv',
    privateKeyPath: inputAbs + '.private.pem',
  };
}

export async function decrypt({ input, output, meta }) {
  if (!fs.existsSync(input)) {
    console.error('Input file not found:', input);
    process.exit(1);
  }

  const inputAbs = path.resolve(input);
  const outputAbs = path.resolve(output);
  const { metaAbs, keyPath, ivPath, privateKeyPath } = resolveMetaPaths(input, meta);

  const missing = [];
  if (!fs.existsSync(keyPath)) missing.push(keyPath);
  if (!fs.existsSync(ivPath)) missing.push(ivPath);
  if (!fs.existsSync(privateKeyPath)) missing.push(privateKeyPath);

  if (missing.length > 0) {
    console.error('Key, IV, or private key files not found. Looked for:');
    for (const filePath of missing) {
      console.error(' -', filePath);
    }
    process.exit(1);
  }

  const totalBytes = fs.statSync(inputAbs).size;
  const aesKey = privateDecrypt(
    fs.readFileSync(privateKeyPath, 'utf8'),
    fs.readFileSync(keyPath),
  );
  const decipher = createDecipheriv('aes-256-cbc', aesKey, fs.readFileSync(ivPath));
  const progress = createProgressTransform(totalBytes, 'Decrypting');

  try {
    await pipeline(
      fs.createReadStream(inputAbs),
      progress,
      decipher,
      fs.createWriteStream(outputAbs),
    );
  } catch (error) {
    console.error('Decryption failed:', error.message);
    process.exit(1);
  }

  printReport([
    ['Status', 'Decrypted'],
    ['Operation', 'decrypt'],
    ['Input', inputAbs],
    ['Output', outputAbs],
    ['Meta dir', metaAbs],
    ['Key', keyPath],
    ['IV', ivPath],
    ['Private', privateKeyPath],
  ]);
}
