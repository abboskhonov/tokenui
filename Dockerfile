# Use official Bun image
FROM oven/bun:1-slim

WORKDIR /app

# Copy package files from apps/api
COPY apps/api/package.json ./
COPY apps/api/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY apps/api/src ./src
COPY apps/api/drizzle ./drizzle
COPY apps/api/drizzle.config.ts ./
COPY apps/api/tsconfig.json ./

# Expose the port Railway will use
EXPOSE 3001

# Start the server
CMD ["bun", "run", "src/index.ts"]
