# VaultX — Secure File Vault

A zero-knowledge file encryption web app built with React, TypeScript, and Vite. VaultX lets you encrypt, decrypt, and share files directly in the browser using military-grade AES-256-GCM encryption — the server stores nothing.

## Features

- **Encrypt** — Upload any file and encrypt it with AES-256-GCM using a Device ID as the key seed. The key is derived in-memory via PBKDF2 with 480,000 iterations and immediately discarded.
- **Decrypt** — Upload a `.vaultx` encrypted file and provide the original Device ID to restore the original file.
- **Share** — Encrypt a file with a randomly generated 256-bit server-side key. The key is returned to you once and never stored — share it with the recipient out-of-band.

## Security Model

- Keys are computed in memory per request and never logged or persisted.
- Files are processed in isolated temporary directories that are deleted after each response.
- The server is zero-storage: it never retains uploaded files or derived keys.

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Containerization | Docker (multi-stage) + Nginx |

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Production (Docker)

```bash
docker compose up --build
```

The app is served on port 80 via Nginx in the production container.

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── api/
│   └── vault.ts          # API calls: encrypt, decrypt, share
├── components/
│   ├── EncryptTab.tsx    # Encrypt tab UI
│   ├── DecryptTab.tsx    # Decrypt tab UI
│   ├── ShareTab.tsx      # Share tab UI
│   └── FileDropzone.tsx  # Drag-and-drop file input
└── App.tsx               # Tab layout and routing
```

## Cryptography

| Primitive | Detail |
|---|---|
| Cipher | AES-256-GCM |
| KDF | PBKDF2 — 480,000 iterations |
| Share keys | 256-bit random, single-use |
| Encrypted file extension | `.vaultx` |
