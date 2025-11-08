# MeshExchange Web (Prototype)

Легкий фронтенд-прототип для файлообменника MeshExchange, собранный на Vite + React.

Что внутри:
- React + Vite scaffold
- анимированные компоненты с Framer Motion
- стартовая страница: Header, Hero, Features, Upload

Установка и запуск:

```bash
# установить зависимости
npm install
# запуск в режиме разработки
npm run dev
# сборка
npm run build
# превью собранной версии
# MeshExchange Web — Prototype

This repository contains a frontend prototype and a small local file-upload API for MeshExchange — a modern, private, and scalable file-exchange UI built with React, Vite and Framer Motion. The goal is a visually appealing, animated, and developer-friendly prototype that demonstrates the core flows: upload, listing, download and delete.

## Table of contents

- Project overview
- Features
- Architecture
- Quickstart (development)
- API reference
- Configuration
- Production & deployment notes
- Next steps and improvements
- License

## Project overview

This project is a lightweight full-stack prototype intended for local development and experimentation. It includes:

- A React + Vite frontend with animated components (Framer Motion).
- A minimal Express backend that accepts multipart uploads (Multer) and serves uploaded files from disk.
- A development proxy so the frontend can call `/api` without dealing with CORS.

The frontend focuses on UX: drag-and-drop, multi-file queue with per-file progress and animated file list.

## Features

- Animated hero, feature cards and micro-interactions
- Drag & drop multi-file upload
- Per-file progress bars and queue controls
- File listing with download and delete actions
- Simple local storage of uploaded files (server/uploads)
- Dev proxy between Vite and backend

## Architecture

- Frontend: `src/` (React components)
	- `src/components/UploadForm.jsx` — drag/drop multi-file queue and upload logic
	- `src/components/FileList.jsx` — lists uploaded files and supports delete/download
	- `src/components/*` — Header, Hero, Features, Docs, Footer
- Backend: `server/index.js` (Express + Multer)
	- `POST /api/upload` — upload a single file (field: `file`)
	- `GET /api/files` — list files
	- `DELETE /api/files/:name` — delete a file
	- `GET /uploads/:name` — static serving of uploaded files

## Quickstart (development)

### Requirements

- Node.js 18+ (recommended)
- npm

### Install and run

```bash
# from project root
npm install

# 1) start the backend (tries PORT env or 4000 and will try next ports if occupied)
npm run start:server

# 2) start the frontend dev server (Vite)
npm run dev
```

Notes:

- The backend will attempt to bind to `PORT` (env) or `4000` and if that port is in use it will try the next port up (up to +10). Check the backend console to see which port was chosen.
- Vite proxies `/api` and `/uploads` to the backend using `VITE_BACKEND` or default `http://localhost:4001` (the default assumes the backend used 4001). You can override this by setting `VITE_BACKEND`.

## API reference

All endpoints are prefixed with `/api` and the server serves uploaded files under `/uploads`.

### Upload a file

```
POST /api/upload
Content-Type: multipart/form-data
Field: file

Response: 200 OK
{
	"filename": "<stored-filename>",
	"originalname": "<original name>",
	"size": <bytes>,
	"url": "/uploads/<stored-filename>"
}
```

### List files

```
GET /api/files

Response: 200 OK
[ { name, size, mtime }, ... ]
```

### Delete a file

```
DELETE /api/files/:name

Response: 200 OK | 404 Not Found
```

## Configuration

- `VITE_BACKEND` — (optional) Vite proxy backend target. Example:

```bash
VITE_BACKEND=http://localhost:4001 npm run dev
```

- `PORT` — backend server will attempt to bind to this port (default 4000) and fallback to next ports if occupied.

## Development tips

- Hot Module Replacement (HMR) is enabled by Vite — changes in `src` reload instantly.
- The frontend emits a custom event `meshexchange:files-updated` after each successful upload so other UI parts can reactively refresh the file list.

## Production & deployment notes

This repository is a prototype — for production you'll want to:

- Replace local disk storage with durable storage (S3, MinIO, IPFS, or P2P storage).
- Use presigned uploads or direct-to-storage uploads to offload large file transfers from your server.
- Add authentication and authorization (JWT, OAuth) and attach ownership metadata to uploaded files.
- Harden the server (rate limits, file size limits, virus scanning, input validation).
- Use HTTPS and secure headers.
- Add persistent logging and monitoring.

## Example: presigned S3 flow (high level)

1. Client requests an upload token from `/api/upload-token` (authenticated)
2. Server generates a presigned PUT URL from S3 and returns it
3. Client PUTs the file directly to S3 and then notifies backend for post-processing (optional)

## Next steps & improvements

- Add authentication and link management (expiry, passwords, download limits).
- Support resumable uploads (tus.io or chunked uploads) for large files.
- Add image/video previews, thumbnails, and inline player components.
- Integrate observability: metrics for upload throughput, latency, error rates.
- Beautify UI further: Lottie animations, advanced page transitions, accessibility improvements.

## License

This project is provided as-is for prototyping and demonstration purposes. Adjust licensing to match your needs.

## Acknowledgements

Built with React, Vite and Framer Motion. The minimal backend uses Express and Multer for multipart upload handling.

## Contact

If you want me to continue: pick a follow-up (S3 presigned, auth, previews, Lottie animations, or deploy via Docker) and I will implement it next.

