# Buykart E-commerce Platform

Buykart is a modern, full-stack e-commerce application built with a mono-repo architecture. It features a responsive, premium user interface similar to major e-commerce platforms and a robust, scalable backend.

## 🚀 Live Demo
- **Frontend**: [Your CloudFront/Domain URL Here]
- **API**: [Your EC2/Load Balancer URL Here]

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS, Shadcn UI
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (TiDB Cloud)
- **ORM**: Prisma
- **Caching**: Redis
- **Email**: Gmail SMTP via Nodemailer
- **Authentication**: JWT & Bcrypt

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Backend Cloud**: AWS EC2 (Dockerized)
- **Frontend Cloud**: AWS S3 + CloudFront (Static Hosting)
- **DNS/Proxy**: Cloudflare

---

## 🏗️ Architecture & Deployment

### CI/CD Pipelines
We use GitHub Actions for automated, atomic deployments.

#### 1. Backend Pipeline (`backend-deploy.yml`)
- **Trigger**: Push to `main` with changes in `/backend`
- **Steps**:
  1. Build optimized multi-stage Docker image
  2. Push image to Docker Hub
  3. SSH into AWS EC2
  4. Pull new image & restart container
  5. Run `npx prisma migrate deploy`
  6. Deploy Redis sidecar container on the same Docker network

#### 2. Frontend Pipeline (`frontend-deploy.yml`)
- **Trigger**: Push to `main` with changes in `/frontend`
- **Steps**:
  1. Build Vite application (`npm run build`)
  2. Sync `dist/` folder to AWS S3 bucket
  3. Invalidate CloudFront distribution cache
  4. Purge Cloudflare cache for immediate updates

---

## 📂 Database Schema

We use **Prisma ORM** with the following core models:

- **Users**: Authentication & profile data
- **Categories**: Hierarchical product categories
- **Products**: Item details, stock, pricing, image URLs
- **Cart**: Persistent user cart items
- **Wishlist**: User saved items
- **Orders**: Transactional data (Statuses: pending, confirmed, shipped, delivered, cancelled)
- **OrderItems**: Individual line items for orders

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MySQL Database
- Docker (optional, for Redis)

### 1. Clone the Repository
```bash
git clone https://github.com/abhi5hek001/Buykart.git
cd Buykart
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env 
# Fill in: DATABASE_URL, JWT_SECRET, REDIS_HOST, EMAIL_USER, etc.

# Run Migrations & Seed Data
npx prisma migrate dev
npm run seed

# Start Server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Start Dev Server
npm run dev
```

---

## ☁️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/buykart"
JWT_SECRET="your_secret_key"
REDIS_HOST="localhost"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📝 Assumptions & Decisions
- **Mono-repo**: Kept both frontend and backend in one repo for easier code sharing and version tracking.
- **TiDB Cloud**: Selected for MySQL compatibility and serverless scalability.
- **Redis**: Used for high-speed caching of product categories and session data.
- **Shadcn UI**: Chosen for accessible, copy-paste components that are easily customizable.
- **Docker Network**: Backend and Redis run on a custom `buykart-network` bridge to communicate securely on EC2.
