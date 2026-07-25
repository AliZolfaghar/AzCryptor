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
# 🔐 AzCryptor

**AzCryptor** is a robust Command Line Interface (CLI) tool for performing hybrid file encryption and decryption. It combines the speed of AES-256 stream ciphering with the security of RSA-2048 public key cryptography to secure sensitive data at rest.

---
## ✨ Key Features
*   🛡️ **Hybrid Encryption:** Uses AES-256 (symmetric) for bulk data encryption and RSA-2048 (asymmetric) to protect the session key, offering maximum security with high throughput.
*   🔑 **Automated Key Management:** Automatically generates a full cryptographic chain during encryption: an encrypted session key (`.key`), an Initialization Vector (`.iv`), and the private RSA key (`.private.pem`).
*   💾 **Streaming Support:** Uses Node.js streams for efficient handling of large files, preventing memory overload.
*   🔄 **Utility Functionality:** Includes a utility to easily Base64-encode files into common import formats (CSV, JSON) for transfer or storage.

---
## 🚀 Getting Started

### Prerequisites
1.  **Node.js:** Ensure you have Node.js installed.
2.  **Installation:** Use npm to install AzCryptor globally:
    ```bash
    npm install azcryptor --global
    # Alternatively, if using yarn/pnpm, update the command accordingly.
    ```

### 🛡️ Critical Security Note (READ FIRST)
The cryptographic keys are **generated uniquely every time** you run the `encrypt` command. For successful decryption, you *must* retain all generated metadata files alongside the encrypted file. Losing any of these files makes recovery impossible:
1.  `[filename].enc.key`: The AES encryption key (wrapped by RSA Public Key).
2.  `[filename].enc.iv`: The Initialization Vector used for the stream cipher.
3.  `[filename].enc.private.pem`: **The private RSA key.**

---
## ⚙️ Usage Guide

### 1. Encrypting a File (Recommended)
This command performs the full hybrid encryption process and saves all necessary keys to a specified metadata directory (`-m`).

**Command:**
```bash
azcryptor encrypt --input <path/to/original_file> --output <path/to/encrypted_file> --meta <directory_for_keys>
```

**Example:** Encrypting `data.txt` and storing keys in `./metadata`:
```bash
azcryptor encrypt -i ./data.txt -o ./data.enc -m ./metadata
```
**Output Files Generated (in `<directory_for_keys>`):**
*   `data.enc.key`
*   `data.enc.iv`
*   `data.enc.private.pem`

### 2. Decrypting a File
You must place the encrypted file (`.enc`) and all associated metadata files (`.key`, `.iv`, `.private.pem`) in a location before running this command.

**Command:**
```bash
azcryptor decrypt --input <path/to/encrypted_file> --output <path/to/decrypted_file>
```

### 3. Base64 Encoding Utility (Transfer Format)
Use the `base64ify` tool to encode any file into formats suitable for data exchange (e.g., embedding in a database or transferring via JSON).

**Usage:**
```bash
node base64ify.js <path/to/file>
```
This will generate:
*   `<original_file>.b64` (Raw Base64)
*   `<original_file>.import.csv` (CSV format for easy import)
*   `<original_file>.import.json` (JSON key-value pair structure)

---
## 📜 Command Reference

| Command | Description | Required Flags | Action |
| :--- | :--- | :--- | :--- |
| `azcryptor encrypt` | Encrypts a file using AES/RSA and saves keys. | `-i`, `-o`, `-m` | Write |
| `azcryptor decrypt` | Decrypts a file using the saved private key. | `-i`, `-o` | Read/Write |
| `azcryptor enc` / `azcryptor dec` | Aliases for `encrypt` and `decrypt`. | N/A | Shortcut |

***

# File Structure After Encryption

D:\input
└── myFile.rar ← Original file

D:\output
└── myFile.rar.enc ← Encrypted file

D:\meta
├── myFile.rar.enc.key ← AES encryption key
├── myFile.rar.enc.iv ← IV value
└── myFile.rar.enc.private.pem ← RSA private key

D:\decrypted
└── myFile_restored.rar ← Restored file

--- 

# Important Security Notes

- The encryption keys are generated each time, and you will need these exact same files for decryption.
- Keep the encryption keys in a secure location.
- Without encryption keys , decryption is impossible.
- For enhanced security, encrypt the .key and .iv files
- Do not send the encryption keys along with the encrypted file.
- Note: AzCryptor only encrypts file contents, not file names or paths

