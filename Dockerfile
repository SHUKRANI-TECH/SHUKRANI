# Use Node.js official image
FROM node:20

# Install media processing tools
RUN apt-get update && apt-get install -y \
  ffmpeg \
  imagemagick \
  webp \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install Node.js packages and log errors if any
RUN mkdir -p /app/logs && npm install --legacy-peer-deps 2> /app/logs/npm-error.log || exit 1

# Copy rest of the bot files
COPY . .

# Optional expose port
EXPOSE 3000

# Start the bot
CMD ["node", "shukrani.js"]
