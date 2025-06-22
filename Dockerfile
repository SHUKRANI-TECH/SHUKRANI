# Use official Node.js LTS image
FROM node:lts

# Install system dependencies for media processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    webp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the application working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./package.json ./package-lock.json* ./

# Install Node.js dependencies
RUN npm install

# Copy all project files
COPY . .

# Optional: Expose port (if using HTTP or socket)
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the bot using the main file: shukrani.js
CMD ["node", "shukrani.js"]
