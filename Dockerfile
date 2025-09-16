# Multi-stage build for MatTailor AI
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (includes TypeScript as dev dependency)
RUN npm install

# Copy source code
COPY . .

# Build arguments for API keys (optional)
ARG MATWEB_API_KEY=""
ARG MATERIALS_PROJECT_API_KEY=""

# Set environment variables for build (optional)
ENV VITE_MATWEB_API_KEY=$MATWEB_API_KEY
ENV VITE_MATERIALS_PROJECT_API_KEY=$MATERIALS_PROJECT_API_KEY

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration if it exists
COPY nginx.conf /etc/nginx/nginx.conf 2>/dev/null || echo "Using default nginx config"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of nginx directories
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
