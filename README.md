# Portfolio Management System - Backend API

A production-grade, full-stack portfolio management system built with NestJS, PostgreSQL, and modern technologies.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Production](#production)
- [Docker](#docker)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### Core Features

- ✅ User Authentication (JWT-based)
- ✅ User Profile Management
- ✅ Multi-Portfolio Support
- ✅ 4 Asset Classes (Mutual Funds, Stocks, Bonds, Crypto)
- ✅ SIP Management (Systematic Investment Plans)
- ✅ Complete Transaction History
- ✅ Real-time Dashboard & Analytics
- ✅ Investment Performance Tracking
- ✅ Asset Allocation Analysis

### Technical Features

- ✅ Production-grade Logging (Pino)
- ✅ Environment Validation (Joi)
- ✅ Docker & Docker Compose
- ✅ Kubernetes Ready
- ✅ Comprehensive Testing (Unit & E2E)
- ✅ Swagger/OpenAPI Documentation
- ✅ Global Error Handling
- ✅ Request/Response Interceptors
- ✅ Soft Deletes
- ✅ Access Control & Permissions

## 🛠 Tech Stack

### Backend

- **Runtime:** Node.js 20 LTS
- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 15
- **ORM:** Prisma 5.x
- **Authentication:** JWT + Bcrypt
- **Validation:** Class-validator + Joi
- **Logging:** Pino
- **Documentation:** Swagger/OpenAPI

### DevOps

- **Containerization:** Docker & Docker Compose
- **Orchestration:** Kubernetes
- **Reverse Proxy:** Nginx
- **Version Control:** Git & GitHub
- **CI/CD:** GitHub Actions

### Testing

- **Unit Tests:** Jest
- **E2E Tests:** Supertest
- **Coverage:** >70%

## 📦 Prerequisites

- Node.js 20 LTS
- PostgreSQL 15 or Docker
- Docker & Docker Compose (for containerization)
- Git

## 🚀 Installation

### Local Setup (Development)

```bash
# Clone repository
git clone https://github.com/yourusername/portfolio-management-backend.git
cd portfolio-management-backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Setup environment
cp .env.example .env

# Update .env with your local database
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_management_dev"
JWT_SECRET="your-dev-jwt-secret-min-32-chars"
JWT_REFRESH_SECRET="your-dev-refresh-secret-min-32-chars"

# Run migrations
npx prisma db push

# Start development server
npm run start:dev
```

### Docker Setup (Recommended)

```bash
# Development with Docker
docker-compose -f docker-compose.dev.yml up -d

# Production with Docker
docker-compose up -d

# With Nginx (Production)
docker-compose -f docker-compose.nginx.yml up -d
```

## 💻 Development

### Available Scripts

```bash
# Development server
npm run start:dev

# Build for production
npm run build

# Run production build
npm start

# Testing
npm test                # Unit tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage
npm run test:e2e       # E2E tests
npm run test:all       # All tests

# Linting & Formatting
npm run lint           # ESLint
npm run format         # Prettier

# Database
npm run db:push        # Push schema
npm run db:generate    # Generate Prisma Client
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Create migration
```

### Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication
│   ├── user/          # User profiles
│   ├── portfolio/     # Portfolio management
│   ├── investment/    # Investment management
│   ├── transaction/   # Transaction history
│   └── dashboard/     # Analytics & dashboard
├── common/
│   ├── filters/       # Global exception filter
│   ├── interceptors/  # Response interceptor
│   ├── logger/        # Pino logger
│   └── prisma/        # Prisma service
├── config/            # Configuration
├── app.module.ts      # Root module
└── main.ts            # Application entry
```

## 📦 Production Deployment

### Environment Setup

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Create production .env
cp deployment/.env.example .env.production

# Update with your values:
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=<your-production-db-url>
```

### Docker Deployment

```bash
# Build production image
docker build -t portfolio-api:latest .

# Run with production compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Health check
curl http://localhost:3000

# API Documentation
open http://localhost:3000/api
```

### Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace portfolio

# Create secrets
kubectl create secret generic portfolio-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=jwt-secret='...' \
  --from-literal=jwt-refresh-secret='...' \
  -n portfolio

# Deploy
kubectl apply -f deployment/k8s-deployment.yaml -n portfolio

# Check deployment
kubectl get pods -n portfolio

# View logs
kubectl logs -f deployment/portfolio-api -n portfolio
```

### Render.com Deployment

1. **Create PostgreSQL Database**
   - Visit Render dashboard
   - Create new PostgreSQL instance
   - Note the connection string

2. **Create Web Service**
   - Connect your GitHub repository
   - Build command: `npm install && npx prisma db push && npm run build`
   - Start command: `node dist/main.js`
   - Set environment variables:

```
     NODE_ENV=production
     DATABASE_URL=<your-render-db-url>
     JWT_SECRET=<your-secret>
     JWT_REFRESH_SECRET=<your-secret>
```

3. **Deploy**
   - Click Deploy
   - Wait for build and startup
   - Test at `https://your-service.onrender.com`

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Unit tests with coverage
npm run test:cov

# Watch mode for development
npm run test:watch

# E2E tests
npm run test:e2e
```

### Coverage Report

```bash
npm run test:cov
# View: coverage/index.html
```

Target: **70%+ Coverage**

## 📚 API Documentation

### Access Swagger UI

```
http://localhost:3000/api
```

### Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT token:

```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### Authentication

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh token

#### User

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/change-password` - Change password
- `DELETE /users/account` - Delete account
- `GET /users/stats` - Get user statistics

#### Portfolio

- `GET /portfolios` - Get all portfolios
- `POST /portfolios` - Create portfolio
- `GET /portfolios/:id` - Get portfolio
- `PUT /portfolios/:id` - Update portfolio
- `DELETE /portfolios/:id` - Delete portfolio
- `GET /portfolios/:id/stats` - Get portfolio stats

#### Investment

- `POST /portfolios/:id/investments` - Add investment
- `GET /portfolios/:id/investments` - Get investments
- `PUT /portfolios/:id/investments/:invId` - Update investment
- `DELETE /portfolios/:id/investments/:invId` - Delete investment

#### Transaction

- `POST /portfolios/:id/investments/:invId/transactions` - Add transaction
- `GET /portfolios/:id/transactions` - Get transactions
- `GET /portfolios/:id/transactions/analytics` - Get analytics

#### Dashboard

- `GET /dashboard/summary` - Dashboard summary
- `GET /dashboard/portfolio/:id/summary` - Portfolio summary
- `GET /dashboard/portfolio/:id/performance` - Investment performance
- `GET /dashboard/portfolio/:id/allocation` - Asset allocation

## 🔐 Security

- ✅ JWT Authentication
- ✅ Password Hashing (Bcrypt)
- ✅ CORS Protection
- ✅ Input Validation
- ✅ SQL Injection Prevention (Prisma)
- ✅ XSS Protection
- ✅ Rate Limiting Ready
- ✅ Environment Validation
- ✅ Soft Deletes

## 📊 Database Schema

See `prisma/schema.prisma` for complete schema including:

- Users
- Portfolios
- Investments
- Transactions
- Refresh Tokens

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Narayan Shaw** - Senior Full Stack Developer

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

## 🚀 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics & ML recommendations
- [ ] Third-party integrations (stock APIs, banks)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] API rate limiting
- [ ] Multi-tenancy support

---

**Happy Investing! 📈**
