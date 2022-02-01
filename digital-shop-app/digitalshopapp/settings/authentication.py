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
# If you want to let users log in even if they didn't verify their email choose "optional"
# "none" - no email message at all
# "mandatory" - unable to log in until confirm email. Sends confirmation email message
# "optional" - user can login even without email confirmation. Sends confirmation email message
ACCOUNT_EMAIL_VERIFICATION = "optional"
# Determines the expiration date of email confirmation mails (# of days). 3 by default
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3
# Cooldown before sending another verification email message (in seconds, default 180)
ACCOUNT_EMAIL_CONFIRMATION_COOLDOWN = 180
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
# This enabled old_password field in password change endpoint
OLD_PASSWORD_FIELD_ENABLED = True
# Set this to True to logout when password was changed
#LOGOUT_ON_PASSWORD_CHANGE = True


# Token authentication
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
}

CORS_ALLOW_CREDENTIALS=True
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1",
]
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