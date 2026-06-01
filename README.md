# 🖼️ Image Processing Service

A scalable backend system for uploading, transforming, and retrieving images — built as a lightweight Cloudinary-style service.

---

## 📌 Overview

This project is a full-stack image processing backend built using:

- Node.js + Express (core backend)
- Python FastAPI (image processing microservice)
- MongoDB (data storage)
- Cloudinary (image hosting)
- Redis (caching + rate limiting)

It supports authentication, image upload, real-time transformations, and fast image retrieval via short codes.

---

## ✨ Features

### 🔐 Authentication
- User signup & login
- JWT access + refresh token system
- Secure logout
- HTTP-only cookie based auth

### 🖼️ Image Management
- Upload images (JPG, PNG, WEBP)
- Cloudinary storage
- Unique image ID generation (nanoid)
- Fetch images via `/fetch/:imageCode`
- Get all user images

### 🔄 Image Processing
Handled by Python FastAPI + Pillow:
- Resize images
- Crop images
- Grayscale / color mode conversion
- Processed images re-uploaded to Cloudinary

### ⚡ Performance
- Redis caching (faster image fetch)
- Rate limiting (100 requests/min per IP)
- Optimized API response flow

---

## 🏗️ Architecture

```
Client
  │
  ├── Auth APIs (signup / signin / logout / refresh)
  ├── Image APIs (upload / list / transform)
  └── Fetch API (/fetch/:imageCode)
          │
          ▼
Node.js Backend (Express)
          │
          ├── MongoDB (metadata storage)
          ├── Redis (cache + rate limit)
          └── Cloudinary (image storage)
                     │
                     ▼
        Python FastAPI Microservice
                     │
               Pillow (image processing)
                     │
                     ▼
               Cloudinary (re-upload)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Backend | Node.js, Express |
| Microservice | Python, FastAPI |
| Database | MongoDB |
| Cache | Redis (Upstash) |
| Image Storage | Cloudinary |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| Processing | Pillow (PIL) |

---

## 📁 Project Structure

```
├── index.js                    # Entry point, DB connect + server start
├── app.js                      # Express app setup, middleware, routes
│
└── src/
    ├── Routes/
    │   ├── user.route.js       # Auth routes
    │   └── image.route.js      # Image routes
    │
    ├── Controllers/
    │   ├── user.controller.js  # Auth controller
    │   └── image.controller.js # Image controller
    │
    ├── Services/
    │   ├── user.service.js     # Auth business logic
    │   ├── image.service.js    # Image business logic
    │   └── user.validate.service.js  # Validation helpers
    │
    ├── Models/
    │   ├── user.model.js
    │   └── image.model.js
    │
    ├── Middleware/
    │   ├── auth.middleware.js  # JWT verification
    │   └── multer.middleware.js
    │
    ├── Util/
    │   ├── cloudinary.config.js     # Cloudinary upload utils
    │   └── python.service.config.js # Python microservice caller
    │
    ├── redis.cache/
    │   └── image.redis.cache.js     # Redis get/set for image cache
    │
    ├── rate.limiter.service/
    │   ├── rate.limiter.config.file.js  # Upstash Redis client
    │   ├── user.rate.limiter.js         # IP-based rate limiter
    │   └── image.rate.limiter.js        # Per-user image rate limiter
    │
    └── python.service/
        └── main.py             # FastAPI image transformation server

```

---

## 🚀 Getting Started

### 1. Clone Repo
```bash
git clone https://github.com/agrahariaakriti/ImageServiceRepo.git
cd ImageServiceRepo
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Python Setup

```bash
cd src/python.service
pip install fastapi pillow requests uvicorn streamifier
```

---

### 4. Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_url

JWT_ACCESS_TOKEN_SECRET=secret
JWT_REFRESH_TOKEN_SECRET=secret

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

REDIS_URL=xxx
REDIS_TOKEN=xxx

imageurl=http://localhost:5000/fetch
```

---

### 5. Run Services

```bash
# Python microservice
cd src/python.service
uvicorn main:app --reload
```

```bash
# Node backend
npm run dev
```

---

## 📬 API Endpoints

### Auth
- POST `/api/v1/users/signup`
- POST `/api/v1/users/signin`
- POST `/api/v1/users/logout`
- GET `/api/v1/users/refresh`

### Images
- POST `/api/v1/image/imageupload`
- GET `/api/v1/image/getallimg`
- POST `/api/v1/image/transformimage/:code`
- GET `/fetch/:imageCode`

---

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- HTTP-only cookies
- Rate limiting (Redis)
- File validation before upload

---

## 🧠 Key Learnings

- Microservice architecture (Node + Python)
- Image processing pipeline design
- Redis caching strategies
- Secure authentication system (JWT)
- Cloud-based image storage (Cloudinary)

---

## 🔮 Future Improvements

- Pagination for images
- Image compression
- Watermark feature
- Async processing queue (BullMQ)
- Admin dashboard

---

## 📄 License

MIT License

---

<p align="center">
Built with ❤️ using Node.js + Python
</p>
