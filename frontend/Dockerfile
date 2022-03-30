FROM nginxinc/nginx-unprivileged:1-alpine
LABEL maintainer="lomank200222@gmail.com"

COPY ./react /react
COPY ./run.sh /run.sh

USER root

RUN apk add --update nodejs npm && \
    touch /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d && \
    chmod +x /run.sh

COPY ./default.conf /etc/nginx/conf.d/default.conf

WORKDIR /react

RUN npm ci && \
    chown -R nginx:nginx /react && \
    chown -R nginx:nginx package.json

USER nginx

CMD ["/run.sh"]