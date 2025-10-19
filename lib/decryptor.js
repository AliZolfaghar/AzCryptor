// lib/decryptor.js
import fs from 'fs';
import path from 'path';
import { privateDecrypt, createDecipheriv } from 'crypto';

export function decrypt({ input, output }) {
  const base = input;
  const keyPath = base + '.key';
  const ivPath = base + '.iv';
  const privateKeyPath = base + '.private.pem';

  if (!fs.existsSync(keyPath) || !fs.existsSync(ivPath) || !fs.existsSync(privateKeyPath)) {
    console.error('❌ فایل‌های کلید یا IV یا کلید خصوصی پیدا نشدند.');
    process.exit(1);
  }

  const aesKey = privateDecrypt(fs.readFileSync(privateKeyPath, 'utf8'), fs.readFileSync(keyPath));
  const decipher = createDecipheriv('aes-256-cbc', aesKey, fs.readFileSync(ivPath));

  const inputStream = fs.createReadStream(input);
  const outputStream = fs.createWriteStream(output);

  inputStream.pipe(decipher).pipe(outputStream);

  console.log('✅ فایل رمزگشایی شد:', output);
}
