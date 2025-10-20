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

**AzCryptor** - Secure File Encryption Solution 


command-line (CLI) tool for encrypting and decrypting files using the hybrid AES + RSA algorithm.

---

## Key Features

- Hybrid Encryption: AES-256 for data + RSA-2048 for keys
- Automatic Key Generation: Automatic RSA key pair generation during encryption
- Secure Key Management: Secure storage of private keys for decryption
- Large File Support: Suitable for backups, archives, and databases
- Cross-Platform: Runs on Windows, Linux, and Mac
- Simple Interface: Fast and easy command-line interface

---

## Installation 

npm install azcryptor --global 

## Usage : 

To encrypt a file : 
```
azcryptor encrypt -i input-file-name -o encrypted-output-file-name -m meta-files-output-folder
``` 

To decrypt : 
```
Please copy the meta files along with the encrypted file and then proceed:
azcryptor decrypt -i encrypted-file-name -o decrypted-output-file-name
```

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

