FROM nginx:alpine

# Copy static files
COPY index.html /usr/share/nginx/html/
COPY flower.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

