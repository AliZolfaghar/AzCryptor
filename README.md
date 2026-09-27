```
    ___        ______                 __
   /   |____  / ____/______  ______  / /_____  _____
  / /| /_  / / /   / ___/ / / / __ \/ __/ __ \/ ___/
 / ___ |/ /_/ /___/ /  / /_/ / /_/ / /_/ /_/ / /
/_/  |_/___/\____/_/   \__, / .___/\__/\____/_/
                      /____/_/
(azolfaghar@gmail.com)
```

# AzCryptor

Hybrid AES-256 + RSA-2048 CLI for encrypting and decrypting files at rest.

Persian guide: [README.fa.md](README.fa.md)

## Features

- Hybrid encryption: AES-256-CBC for file data, RSA-2048 for the session key
- Streaming I/O for large files
- Terminal progress bar with percent, speed, and ETA
- Final report table with input, output, and meta paths
- Optional meta directory for decrypt (`-m`)
- `base64ify` helper for transfer/import formats

## Install

Requires Node.js 18+.

```bash
npm install -g azcryptor
```

## Security note

Every `encrypt` run generates a new key chain. Keep all meta files or recovery is impossible:

- `[output-name].key` — AES key wrapped with RSA
- `[output-name].iv` — initialization vector
- `[output-name].private.pem` — RSA private key

Do not ship private keys with the encrypted file. AzCryptor encrypts file contents only, not names or paths.

## Usage

### Encrypt

```bash
azcryptor encrypt -i ./data.txt -o ./data.enc -m ./meta
# alias: azcryptor enc ...
```

Writes `./data.enc` and meta files under `./meta`:

- `data.enc.key`
- `data.enc.iv`
- `data.enc.private.pem`

### Decrypt

By default, meta files are read beside the encrypted file:

```bash
azcryptor decrypt -i ./data.enc -o ./data.txt
# alias: azcryptor dec ...
```

Or point to the meta directory used during encryption:

```bash
azcryptor decrypt -i ./data.enc -o ./data.txt -m ./meta
```

### Base64 utility

```bash
azcryptor base64ify ./data.enc
```

Creates:

- `data.enc.b64`
- `data.enc.import.csv`
- `data.enc.import.json`

### CLI help

```bash
azcryptor --help
azcryptor encrypt --help
azcryptor decrypt --help
azcryptor base64ify --help
```

Running `azcryptor` with no arguments also prints help.

## Output layout

```text
input/
  myFile.rar

output/
  myFile.rar.enc

meta/
  myFile.rar.enc.key
  myFile.rar.enc.iv
  myFile.rar.enc.private.pem

decrypted/
  myFile_restored.rar
```

## Command reference

| Command | Required | Optional | Description |
| :--- | :--- | :--- | :--- |
| `encrypt` / `enc` | `-i`, `-o`, `-m` | | Encrypt file and write meta |
| `decrypt` / `dec` | `-i`, `-o` | `-m` | Decrypt file (meta beside input or from `-m`) |
| `base64ify` | `<file>` | | Encode file to base64/CSV/JSON |

## Publishing (maintainers)

Set the version in `package.json`, then:

```bash
# Windows
publish.bat

# Linux / macOS
chmod +x publish.sh
./publish.sh
```

Scripts run `npm install`, check login, dry-run pack, ask for confirmation, then `npm publish`.

## License

Apache-2.0
