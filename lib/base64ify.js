import fs from 'fs';
import path from 'path';
import { printReport } from './report.js';

export function base64ify(filePath) {
  if (!filePath) {
    console.error('No file selected.');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error('Input file not found:', filePath);
    process.exit(1);
  }

  const inputAbs = path.resolve(filePath);
  const fileBuffer = fs.readFileSync(inputAbs);
  const base64Content = fileBuffer.toString('base64');

  const b64Path = inputAbs + '.b64';
  const csvPath = inputAbs + '.import.csv';
  const jsonPath = inputAbs + '.import.json';

  fs.writeFileSync(b64Path, base64Content);
  fs.writeFileSync(csvPath, `guid,base64\n,${base64Content}\n`);
  fs.writeFileSync(jsonPath, `{"guid":"","base64":"${base64Content}"}`);

  printReport([
    ['Status', 'Base64 encoded'],
    ['Operation', 'base64ify'],
    ['Input', inputAbs],
    ['Base64', b64Path],
    ['CSV', csvPath],
    ['JSON', jsonPath],
  ]);
}
