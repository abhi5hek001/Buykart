# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# FIX: Change server.js to app.js
CMD ["node", "app.js"]