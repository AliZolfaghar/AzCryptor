// lib/encryptor.js
import fs from 'fs';
import path from 'path';
import { generateKeyPairSync, randomBytes, createCipheriv, publicEncrypt } from 'crypto';

export function encrypt({ input, output, meta }) {
  const aesKey = randomBytes(32);
  const iv = randomBytes(16);

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  });

  const encryptedKey = publicEncrypt(publicKey, aesKey);
  const cipher = createCipheriv('aes-256-cbc', aesKey, iv);

  const inputStream = fs.createReadStream(input);
  const outputStream = fs.createWriteStream(output);

  inputStream.pipe(cipher).pipe(outputStream);

  // استخراج نام فایل خروجی بدون پسوند
  const baseName = path.basename(output);
  const metaPath = (suffix) => path.join(meta, baseName + suffix);

  fs.writeFileSync(metaPath('.key'), encryptedKey);
  fs.writeFileSync(metaPath('.iv'), iv);
  fs.writeFileSync(metaPath('.private.pem'), privateKey);

  console.log('فایل رمزنگاری شد:', output);
  console.log('فایل‌های کلید و IV ذخیره شدند در:', meta);
}
