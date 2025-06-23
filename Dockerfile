# Use official Node.js LTS image
FROM node:lts

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    webp \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of project
COPY . .

# Optional: expose a port
EXPOSE 3000

# Environment
ENV NODE_ENV=production

# Start the bot
CMD ["node", "shukrani.js"]
