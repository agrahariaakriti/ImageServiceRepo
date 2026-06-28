# 🖼️ ImageVault — Scalable Image Processing Service

A full-stack image upload, transformation, and delivery platform — built like a lightweight Cloudinary clone, with its own async processing pipeline, caching layer, and secure authentication.

**🔗 Live App:** [image-service-frontend.netlify.app](https://image-service-frontend.netlify.app/)
**📦 Source Code:** [github.com/agrahariaakriti/ImageServiceRepo](https://github.com/agrahariaakriti/ImageServiceRepo)

---

## ✨ What it does

Upload an image, get a short shareable link back, and transform it (resize, crop, grayscale, rotate, watermark) on demand — without ever blocking the request thread. Every image gets a unique short code that resolves to the real file instantly via caching.

---

## 🧠 Why it's interesting (the engineering bits)

- **Two-service architecture**: a Node.js/Express API handles auth, uploads, and orchestration, while a separate **Python (FastAPI + Pillow) microservice** does the actual image manipulation — keeping heavy CPU work isolated from the main API.
- **Non-blocking transforms**: image edits are pushed onto a **Redis-backed job queue (BullMQ)** and processed by a background worker. The client gets an immediate `jobId` and polls for status instead of waiting on a slow synchronous request.
- **Fast repeat lookups**: image metadata is cached in **Redis**, so fetching an already-seen image skips a database round-trip entirely.
- **Secure-by-default auth**: JWT access + refresh tokens are stored in **httpOnly, secure, SameSite cookies** — never exposed to client-side JS — with a dedicated refresh flow to keep sessions alive safely.
- **Abuse protection**: IP-based and per-user rate limiting (Upstash Redis) on both auth and image routes.
- **Cloud-native storage**: final and transformed images are pushed to **Cloudinary**, with the local temp upload cleaned up immediately after.

---

## 🏗️ Architecture

```
                 ┌────────────────────┐
                 │   React Frontend    │
                 │  (Netlify, Vite)    │
                 └─────────┬──────────┘
                           │  HTTPS (cookies)
                           ▼
                 ┌────────────────────┐
                 │  Node.js + Express  │
                 │  Auth · Upload API  │
                 └───┬───────────┬────┘
                     │           │
        ┌────────────┘           └─────────────┐
        ▼                                       ▼
 ┌─────────────┐                        ┌───────────────┐
 │  MongoDB     │                        │ Redis (cache +│
 │ (metadata)   │                        │ rate limit +  │
 └─────────────┘                        │ job queue)     │
                                          └───────┬───────┘
                                                  │ BullMQ job
                                                  ▼
                                       ┌──────────────────────┐
                                       │ Background Worker     │
                                       │ → Python FastAPI       │
                                       │   (Pillow transforms)  │
                                       └──────────┬────────────┘
                                                  ▼
                                       ┌──────────────────────┐
                                       │     Cloudinary         │
                                       │  (image hosting/CDN)   │
                                       └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer              | Technology                          |
|---------------------|--------------------------------------|
| Frontend            | React, Vite, Framer Motion           |
| Backend API         | Node.js, Express                     |
| Processing Service  | Python, FastAPI, Pillow              |
| Database            | MongoDB                              |
| Cache / Queue       | Redis, BullMQ                        |
| File Storage / CDN  | Cloudinary                           |
| Auth                | JWT (access + refresh) + bcrypt      |
| File Upload Handling| Multer                               |
| Deployment          | Netlify (frontend), Render (backend & Python service) |

---

## 📬 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/users/signup` | Create a new account |
| POST | `/api/v1/users/signin` | Log in, sets httpOnly auth cookies |
| POST | `/api/v1/users/logout` | Clear session cookies |
| GET  | `/api/v1/users/refresh` | Rotate access token using refresh token |

### Images
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/image/imageupload` | Upload an image |
| GET  | `/api/v1/image/getallimg` | Get all images for the logged-in user |
| POST | `/api/v1/image/transformimage/:code` | Queue a transform job (resize/crop/grayscale/rotate/watermark) |
| GET  | `/api/v1/image/job/:jobId` | Poll the status of a transform job |
| GET  | `/fetch/:imageCode` | Redirects to the hosted image via its short code |

---

## 🚀 Running it locally

```bash
git clone https://github.com/agrahariaakriti/ImageServiceRepo.git
cd ImageServiceRepo
```

**Backend**
```bash
cd Backend
npm install
npm run dev
```

**Python transform service**
```bash
cd Backend/src/python.service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

**Frontend**
```bash
cd Frontend
npm install
npm run dev
```

### Environment variables (Backend `.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_url

JWT_ACCESS_TOKEN_SECRET=secret
JWT_REFRESH_TOKEN_SECRET=secret

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_CLOUD_API_KEY=xxx
CLOUDINARY_CLOUD_API_SECRET=xxx

REDIS_TCP_URL=xxx
PYTHON_SERVICE_URL=http://127.0.0.1:8001/transform

FRONTEND_URL=http://localhost:5173
imageurl=http://localhost:5000/fetch
```

---

## 🔮 What's next

- Pagination for large image collections
- Client-side image compression before upload
- Admin dashboard for usage/storage insights
- Queue-based retry dashboard for failed transform jobs

---

## 📄 License

MIT

---

Built solo, end-to-end — frontend, backend, microservice, infra, and deployment.
