# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install OpenSSL 1.1 compatibility for Prisma
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.15/main" >> /etc/apk/repositories && \
    apk add --no-cache openssl libssl1.1 libc6-compat

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# FIX: Change server.js to app.js
CMD ["node", "app.js"]