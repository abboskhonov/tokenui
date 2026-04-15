# Use the official Bun image
FROM oven/bun:1 AS base

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose the port Railway will use
EXPOSE 3001

# Start the server
CMD ["bun", "run", "start"]
