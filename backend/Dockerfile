FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies (skip postinstall scripts like lefthook)
RUN bun install --ignore-scripts

# Copy source code
COPY . .

# Expose ports
EXPOSE ${PORT:-3000} 9229

# Start with hot reload and debugger
CMD ["bun", "run", "--watch", "--inspect=0.0.0.0:9229", "src/index.ts"]
