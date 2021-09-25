FROM nginx:1.17.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY server_nginx.conf /etc/nginx/conf.d/nginx.conf
COPY global_nginx.conf /etc/nginx/nginx.conf