import os
import dj_database_url

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': os.environ.get('DB_HOST', 'db'),
        'NAME': os.environ.get('DB_NAME', 'devdb'),
        'USER': os.environ.get('DB_USER', 'devuser'),
        'PASSWORD': os.environ.get('DB_PASS', 'devpassword'),
    }
}

# Heroku db setup
db_from_env = dj_database_url.config(conn_max_age=600)
DATABASES['default'].update(db_from_env)
