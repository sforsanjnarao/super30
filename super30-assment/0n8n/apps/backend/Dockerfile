FROM node:18 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Optional: Build TypeScript to JavaScript (recommended for production)
# RUN npm run build

FROM node:18 AS runner

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules

# If you built TypeScript, copy dist instead:
# COPY --from=builder /app/dist ./dist

# Run with tsx for TypeScript
CMD ["npx", "tsx", "src/workers/execution.worker.ts"]

# Or if you built to JavaScript:
# CMD ["node", "dist/workers/execution.worker.js"]