FROM nginx:1.17.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
# Copy global nginx settings
COPY nginx.conf /etc/nginx/nginx.conf

# Copy server configuration
COPY nginx_server.conf /etc/nginx/conf.d/nginx.conf
