FROM nginx:mainline-alpine

RUN mkdir -p /etc/nginx/templates/proxy/
COPY ./apps/client/nginx.conf /etc/nginx/templates/default.conf.template
COPY ./apps/client/nginx-proxy.conf /etc/nginx/templates/proxy/nginx-proxy.conf.template

COPY ./dist/apps/client /app
