# Use official Bun image
FROM oven/bun:1-slim

WORKDIR /app

# Copy everything from apps/api
COPY apps/api/ .

# Install dependencies
RUN bun install --frozen-lockfile

# Expose the port Railway will use
EXPOSE 3001

# Start the server
CMD ["bun", "run", "src/index.ts"]
