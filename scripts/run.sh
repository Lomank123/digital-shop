#!/bin/sh

set -e

npm run prod
npm prune --production
python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py makemigrations
python manage.py migrate

gunicorn placerem.wsgi:application --bind 0.0.0.0:$PORT