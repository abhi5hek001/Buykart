# Buykart E-commerce Platform

Buykart is a modern, full-stack e-commerce application built with a mono-repo architecture. It features a responsive, premium user interface similar to major e-commerce platforms and a robust, scalable backend.

## 🚀 Live Demo
- **Website**: [https://buykart.sahayabhishek.tech]

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
- **Containerization**: Docker
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

### ⚡ Caching Verification
| CloudFront Miss | CloudFront Hit | Cloudflare Hit |
|:---:|:---:|:---:|
| ![CloudFront Miss](./cloudfront-miss.png) | ![CloudFront Hit](./cloudfront-hit.png) | ![Cloudflare Hit](./cloudlare-cache-hit.png) |

---

## 📂 Database Schema

We use **Prisma ORM** with MySQL. Below is the relational schema overview:

![ER Diagram](./ERD.png)

### 👤 User & Authentication
| Model | PK / FK | Field | Type | Description |
|-------|---------|-------|------|-------------|
| **User** | 🔑 PK | `id` | Int | Unique User ID |
| | | `email` | String | Unique email address |
| | | `password` | String | Hashed password (Bcrypt) |

### 📦 Product Management
| Model | PK / FK | Field | Type | Relation |
|-------|---------|-------|------|----------|
| **Category** | 🔑 PK | `id` | Int | |
| | | `name` | String | Category name (e.g., Electronics) |
| **Product** | 🔑 PK | `id` | Int | |
| | 🔗 FK | `categoryId` | Int | → **Category**(`id`) |
| | | `price` | Decimal | Product price |
| | | `stock` | Int | Inventory count |

### 🛒 Shopping & Wishlist
| Model | PK / FK | Field | Type | Relation |
|-------|---------|-------|------|----------|
| **Cart** | 🔑 PK | `id` | Int | |
| | 🔗 FK | `userId` | Int | → **User**(`id`) |
| | 🔗 FK | `productId` | Int | → **Product**(`id`) |
| | | `quantity` | Int | Item quantity |
| **Wishlist** | 🔑 PK | `id` | Int | |
| | 🔗 FK | `userId` | Int | → **User**(`id`) |
| | 🔗 FK | `productId` | Int | → **Product**(`id`) |

### 🧾 Orders & Transactions
| Model | PK / FK | Field | Type | Relation |
|-------|---------|-------|------|----------|
| **Order** | 🔑 PK | `id` | Int | |
| | 🔗 FK | `userId` | Int | → **User**(`id`) |
| | | `status` | Enum | Pending, Confirmed, Shipped, Delivered |
| | | `total` | Decimal | Total order amount |
| **OrderItem** | 🔑 PK | `id` | Int | |
| | 🔗 FK | `orderId` | Int | → **Order**(`id`) |
| | 🔗 FK | `productId` | Int | → **Product**(`id`) |
| | | `price` | Decimal | Price at time of purchase |

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
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

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
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 📝 Assumptions & Decisions
- **Mono-repo**: Kept both frontend and backend in one repo for easier code sharing and version tracking.
- **TiDB Cloud**: Selected for MySQL compatibility and serverless scalability.
- **Redis**: Used for high-speed caching of product categories and session data.
- **Shadcn UI**: Chosen for accessible, copy-paste components that are easily customizable.
- **Docker Network**: Backend and Redis run on a custom `buykart-network` bridge to communicate securely on EC2.
