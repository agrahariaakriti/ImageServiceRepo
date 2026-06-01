# 🖼️ Image Processing Service

> A production-grade backend for uploading, transforming, and retrieving images — built like a lightweight Cloudinary clone.

---

## 📌 Overview

This is a full-featured **Image Processing Service** built with **Node.js**, **Express**, **Python (FastAPI)**, **MongoDB**, **Cloudinary**, and **Redis (Upstash)**. It allows users to securely authenticate, upload images, apply real-time transformations (resize, crop, grayscale, and more), and retrieve images via short, shareable codes.

Inspired by the [roadmap.sh Image Processing Service](https://roadmap.sh) project.

---

## ✨ Features

### 🔐 User Authentication
- User **Sign Up** with validation (email, username, strong password)
- User **Sign In** with hashed password comparison (bcrypt)
- **JWT-based** access token + refresh token strategy
- Secure **logout** (clears refresh token from DB)
- **Token refresh** endpoint via HTTP-only cookie

### 🖼️ Image Management
- Upload images (PNG, JPEG, WEBP, JPG supported)
- Images stored securely on **Cloudinary**
- Each image assigned a unique **8-character nanoid code**
- Retrieve image via short shareable URL (`/fetch/:imageCode`)
- List all images uploaded by the authenticated user

### 🔄 Image Transformations (via Python FastAPI microservice)
- **Resize** — custom width & height
- **Crop** — left, right, top, bottom pixel crop
- **Grayscale / Color Mode** — convert to L, RGB, RGBA, etc.
- Transformed image is re-uploaded to Cloudinary and a new code is generated

### ⚡ Performance & Reliability
- **Redis caching** (Upstash) for fast image retrieval
- **Rate limiting** — max 100 requests per IP per 60 seconds
- Multer-based **file upload** with temp disk storage

---

## 🏗️ Architecture

```
Client
  │
  ├── POST /api/v1/users/signup        → Register
  ├── POST /api/v1/users/signin        → Login
  ├── POST /api/v1/users/logout        → Logout
  ├── GET  /api/v1/users/refresh       → Refresh Access Token
  │
  ├── POST /api/v1/image/imageupload   → Upload Image (Auth + Multer)
  ├── GET  /api/v1/image/getallimg     → Get All Images (Auth)
  ├── GET  /api/v1/image/transformimage/:code → Get Transform Info
  ├── POST /api/v1/image/transformimage/:code → Apply Transformations
  │
  └── GET  /fetch/:imageCode           → Redirect to Original Image URL
                                            (Redis cache → MongoDB)
                                            
Node.js Backend ──→ Python FastAPI (image transform microservice)
                          │
                    Pillow (PIL) processing
                          │
                    Cloudinary (re-upload)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Web Framework | Express.js |
| Auth | JWT (Access + Refresh Tokens) |
| Password Hashing | bcrypt |
| File Upload | Multer (disk storage) |
| Image Storage | Cloudinary |
| Database | MongoDB + Mongoose |
| Caching | Redis via Upstash |
| Rate Limiting | Custom Redis middleware |
| Image Processing | Python FastAPI + Pillow |
| ID Generation | nanoid |
| Env Config | dotenv |

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

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB (local or Atlas)
- Cloudinary account
- Upstash Redis account

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/image-processing-service.git
cd image-processing-service
```

---

### 2. Install Node Dependencies

```bash
npm install
```

---

### 3. Install Python Dependencies

```bash
cd src/python.service
pip install fastapi pillow requests uvicorn streamifier
```

---

### 4. Environment Variables

Create a `.env` file in the root:

```env
PORT=5000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_CLOUD_API_KEY=your_api_key
CLOUDINARY_CLOUD_API_SECRET=your_api_secret

# Upstash Redis
REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_redis_token

# Image Base URL (your server URL)
imageurl=http://localhost:5000/fetch
```

---

### 5. Run the Python Microservice

```bash
cd src/python.service
python -m uvicorn main:app --reload
```

> Runs on `http://localhost:8000` by default.

---

### 6. Run the Node Server

```bash
npm run dev
# or
node index.js
```

---

## 📬 API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/signup` | ❌ | Register new user |
| POST | `/api/v1/users/signin` | ❌ | Login, get tokens |
| POST | `/api/v1/users/logout` | ✅ | Logout user |
| GET | `/api/v1/users/refresh` | ❌ | Refresh access token |

### Images

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/image/imageupload` | ✅ | Upload an image |
| GET | `/api/v1/image/getallimg` | ✅ | List all user images |
| GET | `/api/v1/image/transformimage/:imageCode` | ✅ | Get image info |
| POST | `/api/v1/image/transformimage/:imageCode` | ✅ | Apply transformations |
| GET | `/fetch/:imageCode` | ❌ | Redirect to original image |

---

### Transform Request Body Example

```json
{
  "imageurl": "https://res.cloudinary.com/...",
  "changingparameter": {
    "resized": { "width": 300, "height": 300 },
    "crop": { "left": 10, "top": 10, "right": 290, "bottom": 290 },
    "grayscale": "L"
  }
}
```

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** (salt rounds: 10)
- Access tokens stored in **HTTP-only cookies** (not localStorage)
- Refresh token stored in DB and validated on use
- Rate limiting prevents brute-force and abuse (100 req/min per IP)
- MIME type validation before any file processing

---

## 🧠 What I Learned Building This

- Designing a **microservice architecture** (Node + Python working together)
- Implementing a **dual-token auth system** (access + refresh)
- Using **Redis as a cache layer** to reduce database reads
- Integrating **Cloudinary** for cloud image storage and retrieval
- Building a real-time image processing pipeline using **Pillow (PIL)**
- **Rate limiting** from scratch using Redis counters

---

## 🔮 Roadmap / Planned Features

- [ ] Pagination for image listing (`?page=1&limit=10`)
- [ ] Image rotation and flip support
- [ ] Watermarking
- [ ] Message queue (BullMQ / RabbitMQ) for async transformation jobs
- [ ] Format conversion (PNG → JPEG, WEBP, etc.)
- [ ] Sepia and custom filter support
- [ ] Compression support
- [ ] Admin dashboard

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](./LICENSE)

---

<p align="center">Built with ❤️ | Inspired by <a href="https://roadmap.sh">roadmap.sh</a></p>
