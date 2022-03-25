FROM python:3.9-alpine3.13

LABEL maintainer="lomank200222@gmail.com"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
COPY ./digital-shop-app /digital-shop-app
COPY ./scripts /scripts

WORKDIR /digital-shop-app

# libffi-dev, openssl-dev, cargo - for cryptography - for social-auth-app-django, social-auth-core
# jpeg-dev, libjpeg-dev zlib-dev - for easy-thumbnails

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --no-cache curl gnupg coreutils && \
    apk add --no-cache bash && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-deps \
        build-base jpeg-dev postgresql-dev musl-dev linux-headers \
        zlib-dev libffi-dev openssl-dev python3-dev cargo && \
    apk add --update --no-cache libjpeg && \
    /py/bin/pip install -r /requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home digitalshop && \
    # If you want to use nginx then move mkdir commands to it's Dockerfile
    mkdir -p /vol/web/static && \
    mkdir -p /vol/web/media && \
    chown -R digitalshop:digitalshop /vol && \
    touch /digital-shop-app/cov.coverage && \
    chown -R digitalshop:digitalshop /digital-shop-app/cov.coverage && \
    # Or you'll get permission denied error
    chown -R digitalshop:digitalshop /py/lib/python3.9/site-packages && \
    chmod -R +x /scripts && \
    curl -Os https://uploader.codecov.io/latest/alpine/codecov && \
    chmod +x codecov && \
    ./codecov

ENV PATH="/scripts:/py/bin:/py/lib:$PATH"

RUN python manage.py collectstatic --noinput

USER digitalshop

CMD ["run.sh"]