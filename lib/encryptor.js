// lib/encryptor.js
import fs from 'fs';
import path from 'path';
import { generateKeyPairSync, randomBytes, createCipheriv, publicEncrypt } from 'crypto';

export function encrypt({ input, output }) {
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

  const base = output;
  fs.writeFileSync(base + '.key', encryptedKey);
  fs.writeFileSync(base + '.iv', iv);
  fs.writeFileSync(base + '.private.pem', privateKey);

  console.log('✅ فایل رمزنگاری شد:', output);
  console.log('🔑 کلید خصوصی ذخیره شد:', base + '.private.pem');
}
