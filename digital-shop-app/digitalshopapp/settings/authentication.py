import os
from datetime import timedelta


# Auth settings

# Sets custom user model
AUTH_USER_MODEL = 'mainapp.CustomUser'

# Login
LOGIN_REDIRECT_URL = '/'
LOGIN_URL = '/login/'

# Logout
LOGOUT_URL = '/logout/'
LOGOUT_REDIRECT_URL = '/login/'

# django-allauth params

SITE_ID = 1
#ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True


# Token authentication
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

CORS_ALLOW_CREDENTIALS=True
#CORS_ALLOWED_ORIGINS = [
#    "http://localhost:9000"
#]
#CORS_ORIGIN_WHITELIST = (
#    'localhost:9000',
#)

REST_AUTH_SERIALIZERS = {
    'PASSWORD_RESET_SERIALIZER': 'mainapp.serializers.CustomPasswordResetSerializer',
    'PASSWORD_RESET_CONFIRM_SERIALIZER': 'mainapp.serializers.CustomPasswordResetConfirmSerializer',
}

REST_USE_JWT = True
JWT_AUTH_COOKIE = 'digital-shop-access-token'
JWT_AUTH_REFRESH_COOKIE = 'digital-shop-refresh-token'