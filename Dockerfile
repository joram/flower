FROM nginx:alpine

# Create nginx cache directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/log/nginx \
    /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run \
    && chmod -R 755 /var/cache/nginx /var/log/nginx /var/run

# Copy custom nginx config (listens on 8080 instead of 80)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files
COPY index.html /usr/share/nginx/html/
COPY flower.js /usr/share/nginx/html/

# Expose port 8080 (non-privileged port)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

