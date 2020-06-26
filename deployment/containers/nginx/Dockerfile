FROM nginx:1.17.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY /etc/letsencrypt /etc/letsencrypt
COPY nginx.conf /etc/nginx/conf.d
