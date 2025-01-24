# Stage 1: Build the application
FROM node:18 AS builder

# Define build arguments for environment variables
ARG VITE_APP_URL
ARG VITE_API_URL

# Set env variables during build process
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the application using a lightweight server
FROM nginx:alpine AS server

# Copy build files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional, if you have specific routes)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port on which the app will run
EXPOSE 80

# Start the server
CMD ["nginx", "-g", "daemon off;"]