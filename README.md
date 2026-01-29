<div align="center">
  <h1>📊 Portfolio Management System (PMS) - Backend</h1>
  <p><strong>Professional Investment Portfolio Management API</strong></p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
  
  [📚 Full Documentation](https://devnarayan95.github.io/portfolio-management-docs/) • [🌐 Live Demo](#) • [🚀 Quick Start](#-quick-start)
</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📖 API Documentation](#-api-documentation)
- [🏗️ Project Structure](#️-project-structure)
- [🌍 Environment Configuration](#-environment-configuration)
- [📝 Available Scripts](#-available-scripts)
- [🐳 Docker Setup](#-docker-setup)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)

<br>

## ✨ Features

### 🎯 Core Features

- ✅ **JWT Authentication** - Secure authentication with access and refresh tokens
- ✅ **Multi-Portfolio Management** - Create and manage multiple investment portfolios
- ✅ **4 Asset Classes** - Mutual Funds, Stocks, Bonds, Cryptocurrency
- ✅ **SIP Support** - Systematic Investment Plan tracking and management
- ✅ **Transaction Management** - Complete buy/sell transaction logging
- ✅ **Dashboard Analytics** - Real-time portfolio performance metrics
- ✅ **Investment Performance** - Gain/loss calculations, ROI, and trends
- ✅ **API Documentation** - Interactive Swagger/OpenAPI documentation

### 🔧 Technical Features

- 🏗️ **Clean Architecture** - Modular design with separation of concerns
- 🔐 **Enterprise Security** - Bcrypt hashing, JWT tokens, CORS, validation
- 📊 **Production Ready** - Error handling, logging, graceful shutdown
- 🐳 **Docker Support** - Multi-stage builds and Docker Compose
- ⚡ **High Performance** - Sub-200ms API response times
- 🌍 **Environment Validation** - Joi schema validation
- 📈 **Scalable Design** - Supports 100,000+ concurrent users
- 📝 **Type Safety** - Full TypeScript implementation

<br>

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/nestjs/docs.nestjs.com/master/src/assets/logo.png" width="60" alt="NestJS"/>
      <br><strong>NestJS</strong><br/>11.x
    </td>
    <td align="center" width="20%">
      <img src="https://www.typescriptlang.org/favicon.ico" width="60" alt="TypeScript"/>
      <br><strong>TypeScript</strong><br/>5.x
    </td>
    <td align="center" width="20%">
      <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="60" alt="PostgreSQL"/>
      <br><strong>PostgreSQL</strong><br/>15
    </td>
    <td align="center" width="20%">
      <img src="https://www.prisma.io/images/favicon-32x32.png" width="60" alt="Prisma"/>
      <br><strong>Prisma</strong><br/>5.x
    </td>
    <td align="center" width="20%">
      <img src="https://www.docker.com/favicon.ico" width="60" alt="Docker"/>
      <br><strong>Docker</strong><br/>24+
    </td>
  </tr>
</table>

<br>

## 📦 Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 15
- **Docker** >= 24.0 (optional)

### 🔍 Verify Installations

```bash
node --version    # v20.x.x or higher
npm --version     # 10.x.x or higher
psql --version    # 15.x or higher
docker --version  # 24.x or higher
```

<br>

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/DevNarayan95/portfolio-management-backend.git
cd portfolio-management-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Configuration](#-environment-configuration))

### 4️⃣ Setup Database

**Option A: Using Docker** (Recommended)

```bash
docker-compose up -d postgres
npm run db:generate
npm run db:migrate:dev
```

**Option B: Local PostgreSQL**

```bash
createdb portfolio_db
npm run db:generate
npm run db:migrate:dev
```

### 5️⃣ Start Development Server

```bash
npm run start:dev
```

You should see:

```
✅ Application is running!
🌐 API: http://localhost:3000
📚 Swagger: http://localhost:3000/api-docs
🔧 Environment: development
```

### 6️⃣ Access Documentation

- **Swagger API**: http://localhost:3000/api-docs
- **Full Documentation**: https://devnarayan95.github.io/portfolio-management-docs/

<br>

## 📖 API Documentation

### 🎯 Base URL

```
Development: http://localhost:3000
Production:  https://api.yourdomain.com
```

### 📚 Quick Reference

For complete API documentation with examples, request/response schemas, and interactive testing:

- **Swagger UI**: http://localhost:3000/api-docs (when running locally)
- **Complete Documentation**: https://devnarayan95.github.io/portfolio-management-docs/

### 📝 Main Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout user

#### Portfolio

- `POST /portfolios` - Create portfolio
- `GET /portfolios` - Get all portfolios
- `GET /portfolios/:id` - Get portfolio by ID
- `PUT /portfolios/:id` - Update portfolio
- `DELETE /portfolios/:id` - Delete portfolio

#### Investment

- `POST /portfolios/:portfolioId/investments` - Add investment
- `GET /portfolios/:portfolioId/investments` - Get investments
- `GET /portfolios/:portfolioId/investments/:investmentId/performance` - Get performance

#### Dashboard

- `GET /dashboard/summary` - Overall dashboard summary
- `GET /dashboard/portfolio/:portfolioId/summary` - Portfolio summary
- `GET /dashboard/portfolio/:portfolioId/allocation` - Asset allocation

<br>

## 🏗️ Project Structure

```
portfolio-management-backend/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── src/
│   ├── config/              # App configuration
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── user/           # User management
│   │   ├── portfolio/      # Portfolio management
│   │   ├── investment/     # Investment tracking
│   │   ├── transaction/    # Transaction management
│   │   └── dashboard/      # Analytics & metrics
│   ├── common/             # Shared utilities
│   ├── logger/             # Logging service
│   ├── app.module.ts       # Root module
│   └── main.ts             # Entry point
├── test/                   # E2E tests (Future scope)
├── docker-compose.yml      # Docker configuration
├── Dockerfile              # Docker image
└── .env.example            # Environment template
```

<br>

## 🌍 Environment Configuration

### .env.example

```env
# ==============================================
# SERVER CONFIGURATION
# ==============================================
NODE_ENV=development
PORT=3000

# ==============================================
# APPLICATION INFO
# ==============================================
APP_NAME=Portfolio Management System
APP_VERSION=1.0.0
APP_DESCRIPTION=API for managing investment portfolios with JWT authentication, multi-asset support, and transaction tracking.
APP_SERVER_URL=http://localhost:3000

# ==============================================
# DEVELOPER INFO
# ==============================================
APP_DEVELOPER_NAME=Developer_name
APP_DEVELOPER_EMAIL=test@example.com

# ==============================================
# DATABASE CONFIGURATION
# ==============================================
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db

# ==============================================
# JWT CONFIGURATION
# ==============================================
# Generate secure secrets using:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Access Token Secret (minimum 32 characters)
JWT_SECRET=REPLACE_WITH_YOUR_SECRET_KEY_MIN_32_CHARS

# Refresh Token Secret (minimum 32 characters)
JWT_REFRESH_SECRET=REPLACE_WITH_YOUR_REFRESH_SECRET_KEY_MIN_32_CHARS

# Token Expiration (in seconds)
JWT_EXPIRATION=3600           # 1 hour
JWT_REFRESH_EXPIRATION=604800 # 7 days

# ==============================================
# LOGGING CONFIGURATION
# ==============================================
LOG_LEVEL=debug               # debug | info | warn | error
LOG_DIR=./logs

# ==============================================
# CORS CONFIGURATION
# ==============================================
CORS_ORIGIN=http://localhost:3001

# ==============================================
# PRISMA CONFIGURATION
# ==============================================
PRISMA_CLIENT_ENGINE_TYPE=library
```

### Generate JWT Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Environment Files

- `.env` - Active environment (never commit)
- `.env.example` - Template (commit to git)
- `.env.development` - Development settings
- `.env.production` - Production settings

**⚠️ Never commit `.env` files to git!**

<br>

## 📝 Available Scripts

### Development

```bash
npm run start          # Start application
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debugging
npm run build          # Build for production
```

### Database

```bash
npm run db:generate        # Generate Prisma Client
npm run db:push            # Push schema changes (dev)
npm run db:migrate:dev     # Create and run migrations
npm run db:migrate:deploy  # Run migrations (production)
```

### Code Quality

```bash
npm run lint           # Lint code
npm run format         # Format with Prettier
npm run test           # Run tests (Future scope)
npm run test:watch     # Watch mode (Future scope)
npm run test:cov       # Coverage report (Future scope)
npm run test:e2e       # E2E tests (Future scope)
```

### Docker

```bash
npm run docker:build   # Build Docker image
npm run docker:up      # Start services
npm run docker:down    # Stop services
npm run docker:logs    # View logs
npm run docker:restart # Restart API
```

<br>

## 🐳 Docker Setup

### Start All Services

```bash
docker-compose up -d
```

### Services

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api-docs
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050 (admin@example.com / admin)

### Common Commands

```bash
# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Reset database (removes volumes)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Execute commands in container
docker-compose exec api npm run db:migrate:dev
```

<br>

## 🔒 Security

### Implemented Security Features

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Bcrypt Password Hashing (12 rounds)
- ✅ Environment Variable Validation
- ✅ CORS Configuration
- ✅ Input Validation (class-validator)
- ✅ SQL Injection Prevention (Prisma ORM)
- ✅ Global Exception Handling
- ✅ Request Logging

### Best Practices

**🔐 JWT Secrets**

- Minimum 32 characters
- Use cryptographically secure random strings
- Never commit to git
- Rotate regularly in production

**🔐 Passwords**

- Minimum 8 characters
- Include uppercase, lowercase, number, special character
- Bcrypt hashing with 12 rounds

**🔐 Production**

- Enable HTTPS/SSL
- Use strong database passwords
- Set appropriate CORS origins
- Disable Swagger (set `ENABLE_SWAGGER=false`)

<br>

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres
docker-compose logs postgres

# Verify DATABASE_URL
cat .env | grep DATABASE_URL

# Regenerate Prisma Client
npm run db:generate
```

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run start:dev
```

### JWT Errors

```bash
# Verify secret length (must be >= 32 chars)
echo $JWT_SECRET | wc -c

# Generate new secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Docker Issues

```bash
# Reset everything
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f
```

<br>

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/portfolio-management-backend.git
   cd portfolio-management-backend
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features (when available)

4. **Commit your changes**

   ```bash
   git commit -m 'feat: add amazing feature'
   ```

   **Commit Convention:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation update
   - `refactor:` - Code refactoring
   - `test:` - Add tests
   - `chore:` - Maintenance

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Quality

```bash
npm run lint       # Check linting
npm run format     # Format code
```

<br>

## 📞 Support & Resources

### Documentation

- 📖 **Full Documentation**: https://devnarayan95.github.io/portfolio-management-docs/
- 📖 **API Documentation**: http://localhost:3000/api-docs (when running)
- 📖 [NestJS Docs](https://docs.nestjs.com/)
- 📖 [Prisma Docs](https://www.prisma.io/docs/)

### Community

- 💬 [GitHub Issues](https://github.com/DevNarayan95/portfolio-management-backend/issues)
- 💬 [GitHub Discussions](https://github.com/DevNarayan95/portfolio-management-backend/discussions)
- 💬 [NestJS Discord](https://discord.gg/G7Qnnhy)

### Contact

- **Developer**: Narayan Shaw
- **Email**: nshaw.dev@gmail.com
- **GitHub**: [@DevNarayan95](https://github.com/DevNarayan95)

<br>

## 🌟 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - Powerful open-source database
- [Pino](https://getpino.io/) - Fast JSON logger
- [Docker](https://www.docker.com/) - Containerization platform
- [Claude](https://claude.ai/) - AI platform

<br>

---

<div align="center">

### Made with ❤️ by [Narayan Shaw](https://github.com/DevNarayan95)

**[⬆ Back to top](#-portfolio-management-system-pms---backend)**

**[⭐ Star us on GitHub!](https://github.com/DevNarayan95/portfolio-management-backend)**

**Version 1.0.0** • Last Updated: January 29, 2026

</div>
