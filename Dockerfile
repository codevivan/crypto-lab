# Stage 1: Build the React + Vite application
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install exact dependencies using package-lock.json
RUN npm ci

# Copy the entire source code
COPY . .

# Build the production bundle into /app/dist
RUN npm run build

# Stage 2: Serve the production build using lightweight Nginx
FROM nginx:alpine AS production

# Copy custom Nginx configuration for single-page application routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production assets from the builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
