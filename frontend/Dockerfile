FROM node:17-alpine3.12

LABEL maintainer="lomank200222@gmail.com"

COPY ./react /react

#COPY ./assets /assets
#COPY ./webpack /webpack
#COPY ./package.json /package.json
#COPY ./package-lock.json /package-lock.json

COPY ./run.sh /run.sh

WORKDIR /react

RUN npm ci && \
    adduser --disabled-password --no-create-home dsfrontend && \
    chown -R dsfrontend:dsfrontend /react && \
    chown -R dsfrontend:dsfrontend package.json && \
    chmod +x /run.sh

USER dsfrontend

CMD ["run.sh"]