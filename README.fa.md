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

ابزار خط فرمان برای رمزنگاری و رمزگشایی فایل‌ها با ترکیب AES-256 و RSA-2048.

راهنمای انگلیسی: [README.md](README.md)

## ویژگی‌ها

- رمزنگاری ترکیبی: AES-256-CBC برای داده، RSA-2048 برای کلید نشست
- پشتیبانی استریم برای فایل‌های حجیم
- نوار پیشرفت در ترمینال با درصد، سرعت و ETA
- جدول گزارش پایان کار با مسیر ورودی، خروجی و meta
- امکان تعیین پوشه meta برای decrypt با `-m`
- ابزار `base64ify` برای خروجی‌های انتقال/ایمپورت

## نصب

نیازمند Node.js 18 یا بالاتر.

```bash
npm install -g azcryptor
```

## نکته امنیتی

هر بار که `encrypt` اجرا می‌شود، کلیدهای جدید ساخته می‌شوند. بدون فایل‌های meta بازیابی ممکن نیست:

- `[نام-خروجی].key` — کلید AES پیچیده‌شده با RSA
- `[نام-خروجی].iv` — بردار اولیه
- `[نام-خروجی].private.pem` — کلید خصوصی RSA

کلید خصوصی را همراه فایل رمزشده نفرستید. AzCryptor فقط محتوای فایل را رمز می‌کند، نه نام یا مسیر را.

## استفاده

### رمزنگاری

```bash
azcryptor encrypt -i ./data.txt -o ./data.enc -m ./meta
# معادل: azcryptor enc ...
```

فایل `./data.enc` و metaها در `./meta` ساخته می‌شوند:

- `data.enc.key`
- `data.enc.iv`
- `data.enc.private.pem`

### رمزگشایی

پیش‌فرض: فایل‌های meta کنار فایل رمزشده خوانده می‌شوند:

```bash
azcryptor decrypt -i ./data.enc -o ./data.txt
# معادل: azcryptor dec ...
```

یا پوشه meta همان encrypt را مشخص کنید:

```bash
azcryptor decrypt -i ./data.enc -o ./data.txt -m ./meta
```

### ابزار Base64

```bash
azcryptor base64ify ./data.enc
```

خروجی‌ها:

- `data.enc.b64`
- `data.enc.import.csv`
- `data.enc.import.json`

### راهنمای ترمینال

```bash
azcryptor --help
azcryptor encrypt --help
azcryptor decrypt --help
azcryptor base64ify --help
```

اجرای `azcryptor` بدون آرگومان هم راهنما را نشان می‌دهد.

## ساختار خروجی

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

## مرجع دستورات

| دستور | الزامی | اختیاری | توضیح |
| :--- | :--- | :--- | :--- |
| `encrypt` / `enc` | `-i`, `-o`, `-m` | | رمزنگاری و نوشتن meta |
| `decrypt` / `dec` | `-i`, `-o` | `-m` | رمزگشایی (meta کنار فایل یا از `-m`) |
| `base64ify` | `<file>` | | تبدیل به base64/CSV/JSON |

## نصب از Git (بدون پکیج npm)

نصب دستور سراسری `azcryptor` از سورس GitHub، بدون نیاز به پکیج روی رجیستری npm:

```bash
# ویندوز (PowerShell / CMD)
curl -L -o install-from-git.bat https://raw.githubusercontent.com/AliZolfaghar/AzCryptor/main/install-from-git.bat
install-from-git.bat

# لینوکس / مک
curl -fsSL -o install-from-git.sh https://raw.githubusercontent.com/AliZolfaghar/AzCryptor/main/install-from-git.sh
chmod +x install-from-git.sh
./install-from-git.sh
```

آرگومان‌های اختیاری:

```bash
# مسیر نصب دلخواه
install-from-git.bat D:\tools\AzCryptor
./install-from-git.sh ~/tools/AzCryptor

# مسیر + آدرس ریپو
install-from-git.bat D:\tools\AzCryptor https://github.com/AliZolfaghar/AzCryptor.git
./install-from-git.sh ~/tools/AzCryptor https://github.com/AliZolfaghar/AzCryptor.git
```

مسیر پیش‌فرض کلون: `%USERPROFILE%\AzCryptor` / `~/AzCryptor`.  
نیازمندی‌ها: `git`، Node.js 18+ و ابزار `npm` (فقط برای dependencyهای محلی — نه برای دانلود پکیج `azcryptor` از رجیستری).

## نصب و تست لوکال (نگهدارندگان)

نصب/به‌روزرسانی دستور سراسری `azcryptor` از همین پوشه و اجرای تست سریع:

```bash
# ویندوز
install-local.bat

# لینوکس / مک
chmod +x install-local.sh
./install-local.sh
```

## انتشار روی npm (نگهدارندگان)

نسخه را در `package.json` تنظیم کنید، سپس:

```bash
# ویندوز
publish.bat

# لینوکس / مک
chmod +x publish.sh
./publish.sh
```

اسکریپت‌ها `npm install`، چک لاگین، dry-run، تأیید کاربر و سپس `npm publish` را انجام می‌دهند.

## لایسنس

Apache-2.0
