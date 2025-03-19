FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm@9

# Copy package.json and related files
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.build.json tsup.config.ts ./

# Install dependencies
RUN npm ci

# Copy source files
COPY src ./src

# Build the application
RUN npm run build

FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache python3 make g++

# Install pnpm and PM2
RUN npm install -g pnpm@9 pm2

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY ecosystem.config.js ./

# Create data directory for database
RUN mkdir -p /data/db

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV ELIZA_DB_PATH=/data/db

# Expose port that the app will run on
EXPOSE 8080

# Command to run the application using PM2
CMD ["pm2-runtime", "ecosystem.config.js"] 