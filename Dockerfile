FROM node:20-alpine

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Copy .env
COPY .env .env

# Build the app
RUN npm run build

EXPOSE 3000

# Start app
CMD ["npm", "run", "start:dev"]