# Use Node.js image to build the app
FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the entire source code
COPY . .

# Build the production app
RUN npm run build

# Use NGINX for serving the built app
FROM nginx:1.25-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove the default NGINX static files
RUN rm -rf ./*

# Copy the built app from the builder stage
COPY --from=builder /app/dist .

# Expose port 80 for the frontend
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
