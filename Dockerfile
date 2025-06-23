# Use official Node.js LTS image
FROM node:lts

# Install system dependencies for media processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    webp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create logs folder for error logging
RUN mkdir -p /app/logs

# Set the application working directory
WORKDIR /app

# Copy package.json and lock file
COPY ./package.json ./package-lock.json* ./

# Install Node.js dependencies and log errors
RUN npm install --legacy-peer-deps 2> /app/logs/npm-error.log || exit 1

# Copy all project files
COPY . .

# Expose port (optional, if using socket or HTTP)
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the bot using the main file
CMD ["node", "shukrani.js"]
